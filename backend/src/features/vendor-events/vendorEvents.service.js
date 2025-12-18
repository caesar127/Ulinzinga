import Event from "../events/events.model.js";
import Stall from "../stalls/stalls.model.js";

const hasAvailableStalls = async (eventId) => {
  const stallConfig = await Stall.findOne({ event: eventId });
  
  if (!stallConfig || !stallConfig.is_active) {
    return false;
  }
  
  return stallConfig.stall_types.some(type => type.available_count > 0);
};

export const getEventsForVendors = async () => {
  try {
    const currentDate = new Date();
    const events = await Event.find({
      visible: true,
      isActive: true,
      end_date: { $gte: currentDate }
    }).lean();

    const eventsWithAvailableStalls = [];
    
    for (const event of events) {
      const hasStalls = await hasAvailableStalls(event._id);
      if (hasStalls) {
        const stallConfig = await Stall.findOne({ event: event._id });
        const availableStalls = stallConfig.stall_types
          .filter(type => type.available_count > 0)
          .map(type => ({
            size: type.size,
            available_count: type.available_count,
            price: type.price,
            electricity: type.electricity
          }));

        eventsWithAvailableStalls.push({
          ...event,
          stall_availability: availableStalls
        });
      }
    }
    
    return eventsWithAvailableStalls;
  } catch (error) {
    throw new Error(`Failed to get events for vendors: ${error.message}`);
  }
};

export const getEventByIdForVendor = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    if (!event.visible) {
      throw new Error("Event is not available to vendors");
    }
    
    const hasStalls = await hasAvailableStalls(eventId);
    if (!hasStalls) {
      throw new Error("Event does not have any stalls available for vendors");
    }
    
    const stallConfig = await Stall.findOne({ event: eventId })
      .populate('event')
      .populate('organizer', 'firstName lastName email');
    
    if (!stallConfig) {
      throw new Error("Stall configuration not found for this event");
    }
    
    const availableStalls = stallConfig.stall_types
      .filter(type => type.available_count > 0)
      .map(type => ({
        size: type.size,
        available_count: type.available_count,
        total_count: type.available_count + stallConfig.bookings.filter(b => 
          b.stall_type === type.size && b.status === 'confirmed'
        ).reduce((sum, b) => sum + b.quantity, 0),
        price: type.price,
        electricity: type.electricity
      }));

    return {
      ...event.toObject(),
      stall_configuration: {
        ...stallConfig.toObject(),
        stall_types: availableStalls
      }
    };
  } catch (error) {
    throw new Error(`Failed to get event for vendor: ${error.message}`);
  }
};

export const getStallAvailabilityForEvent = async (eventId) => {
  try {
    const stallConfig = await Stall.findOne({ event: eventId });
    
    if (!stallConfig || !stallConfig.is_active) {
      throw new Error("No stall configuration found for this event or stalls are not active");
    }

    const availability = stallConfig.stall_types.map(type => ({
      size: type.size,
      available_count: type.available_count,
      price: type.price,
      electricity: type.electricity,
      total_booked: stallConfig.bookings
        .filter(b => b.stall_type === type.size && b.status === 'confirmed')
        .reduce((sum, b) => sum + b.quantity, 0)
    }));

    return {
      event_id: eventId,
      is_active: stallConfig.is_active,
      stall_types: availability
    };
  } catch (error) {
    throw new Error(`Failed to get stall availability: ${error.message}`);
  }
};

export const bookStallForVendor = async ({ eventId, stall_type, quantity, vendor_info }) => {
  try {
    const stallConfig = await Stall.findOne({ event: eventId });
    
    if (!stallConfig) {
      throw new Error("No stall configuration found for this event");
    }

    if (!stallConfig.is_active) {
      throw new Error("Stalls are not currently active for this event");
    }

    const typeIndex = stallConfig.stall_types.findIndex(t => t.size === stall_type);
    
    if (typeIndex === -1) {
      throw new Error(`Stall type '${stall_type}' is not available for this event`);
    }

    const stallType = stallConfig.stall_types[typeIndex];
    
    if (stallType.available_count < quantity) {
      throw new Error(`Only ${stallType.available_count} stalls of type '${stall_type}' are available`);
    }
    
    const existingBooking = stallConfig.bookings.find(
      b => b.vendor_email === vendor_info.email && b.status === 'confirmed'
    );

    if (existingBooking) {
      throw new Error("You already have a confirmed booking for this event");
    }
    
    stallType.available_count -= quantity;
    
    stallConfig.bookings.push({
      stall_type,
      quantity,
      vendor_name: vendor_info.name,
      vendor_email: vendor_info.email,
      vendor_phone: vendor_info.phone || '',
      business_name: vendor_info.businessName || '',
      booking_date: new Date(),
      status: 'pending' 
    });

    await stallConfig.save();
    
    const newBooking = stallConfig.bookings[stallConfig.bookings.length - 1];

    return {
      booking_id: newBooking._id,
      stall_type,
      quantity,
      vendor_info: {
        name: vendor_info.name,
        email: vendor_info.email,
        phone: vendor_info.phone || '',
        business_name: vendor_info.businessName || ''
      },
      status: 'pending',
      booking_date: newBooking.booking_date,
      total_price: stallType.price * quantity
    };
  } catch (error) {
    throw new Error(`Failed to book stall: ${error.message}`);
  }
};