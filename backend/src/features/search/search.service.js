import Event from '../events/events.model.js';
import Content from '../content/content.model.js';
import User from '../users/users.model.js';
import Connection from '../connection/connection.model.js';

class SearchService {
  async searchEvents(query, limit = 10) {
    const events = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('organizer', 'name username profile.picture')
      .populate('interests', 'name');

    return events;
  }

  async searchContent(query, limit = 10) {
    const content = await Content.find(
      {
        $text: { $search: query },
        privacy: 'public',
        approvalStatus: 'approved'
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('user', 'name username profile.picture')
      .populate('event', 'title');

    return content;
  }

  async searchOrganizers(query, limit = 10) {
    const organizers = await User.find(
      {
        role: 'organizer',
        $text: { $search: query }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('name username profile.picture profile.bio');

    return organizers;
  }

  async searchConnections(query, userId, limit = 10) {
    // First, find connections where user is connected
    const connections = await Connection.find({
      $or: [
        { user: userId, status: 'accepted' },
        { connection: userId, status: 'accepted' }
      ]
    }).select('user connection');

    const connectedUserIds = connections.map(conn =>
      conn.user.toString() === userId.toString() ? conn.connection : conn.user
    );

    // Now search among connected users
    const users = await User.find({
      _id: { $in: connectedUserIds },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { 'profile.bio': { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .select('name username profile.picture profile.bio');

    return users;
  }

  async generalSearch(query, userId = null, limit = 10) {
    const [events, content, organizers, connections] = await Promise.all([
      this.searchEvents(query, limit),
      this.searchContent(query, limit),
      this.searchOrganizers(query, limit),
      userId ? this.searchConnections(query, userId, limit) : Promise.resolve([])
    ]);

    return {
      events,
      content,
      organizers,
      connections
    };
  }
}

export default new SearchService();