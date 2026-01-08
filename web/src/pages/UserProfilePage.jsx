import { useState } from "react";
import { useSelector } from "react-redux";

// API imports
import { useGetCurrentUserProfileQuery } from "../features/users/usersApiSlice";
import {
  useGetUserConnectionsQuery,
  useGetSuggestedConnectionsQuery,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useSendConnectionRequestMutation,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "../features/connections/connectionsApiSlice";
import {
  useGetUserWalletQuery,
  useGetWalletTransactionsQuery,
  useAddFundsToWalletMutation,
  useGetWalletSummaryQuery,
  useGetSavingsGoalsQuery,
  useCreateSavingsGoalMutation,
  useDepositToSavingsMutation,
} from "../features/wallet/walletApiSlice";
import {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGiftTicketMutation,
} from "../features/events/eventsApiSlice";
import { useGetUserTicketsQuery } from "../features/user-events/userEventsApiSlice";

// Component imports
import ConnectionsSidebar from "../components/profile/ConnectionsSidebar";
import WalletSidebar from "../components/profile/WalletSidebar";
import {
  ProfileHeader,
  ProfileStats,
  ProfileTabs,
} from "../components/profile/ProfileHeader";
import { ContentTab, EventsTab } from "../components/profile/ProfileContent";
import AddMoneyModal from "../components/profile/AddMoneyModal";
import AddToSavingsModal from "../components/profile/AddToSavingsModal";
import CreateGoalModal from "../components/profile/CreateGoalModal";
import GiftTicketModal from "../components/profile/GiftTicketModal";
import {
  handleErrorToast2,
  handleSuccessToast2,
  handleToast2,
} from "../utils/toasts";

export default function ProfilePage() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { connections, pendingRequests, suggestedConnections } = useSelector(
    (state) => state.connections
  );
  const { events } = useSelector((state) => state.event);

  const { data: userProfile, isLoading: isUserLoading } =
    useGetCurrentUserProfileQuery(authUser?._id);
  const { data: connectionsData, isLoading: isConnectionsLoading } =
    useGetUserConnectionsQuery();
  const { isLoading: isSuggestedLoading } = useGetSuggestedConnectionsQuery();
  const { isLoading: isPendingLoading } = useGetPendingRequestsQuery();
  const { data: sentRequestsData, isLoading: isSentLoading } =
    useGetSentRequestsQuery();
  const { data: wallet, isLoading: isWalletLoading } = useGetUserWalletQuery();
  const { data: walletSummary } = useGetWalletSummaryQuery();
  const { data: transactions, isLoading: isTransactionsLoading } =
    useGetWalletTransactionsQuery();
  const { data: savingsGoals, refetch: refetchSavingsGoals } =
    useGetSavingsGoalsQuery();

  // Mutations
  const [sendConnectionRequest] = useSendConnectionRequestMutation();
  const [acceptConnection] = useAcceptConnectionMutation();
  const [declineConnection] = useDeclineConnectionMutation();
  const [addFundsToWallet] = useAddFundsToWalletMutation();
  const [createSavingsGoal] = useCreateSavingsGoalMutation();
  const [depositToSavings] = useDepositToSavingsMutation();
  const [giftTicket] = useGiftTicketMutation();

  // Local state
  const [connectionsTab, setConnectionsTab] = useState("connections");
  const [profileTab, setProfileTab] = useState("content");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isAddingToSavings, setIsAddingToSavings] = useState({});
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAddToSavingsModal, setShowAddToSavingsModal] = useState(false);
  const [selectedGoalForSavings, setSelectedGoalForSavings] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState("");
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [goalFormData, setGoalFormData] = useState({
    event_slug: "",
    savingType: "ticket_inclusive",
    ticketTypeId: "",
    targetAmount: "",
    targetDate: "",
  });

  const [showGiftTicketModal, setShowGiftTicketModal] = useState(false);
  const [giftTicketData, setGiftTicketData] = useState({
    selectedEvent: "",
    selectedTicketType: "",
    selectedConnection: "",
    recipientName: "",
    recipientEmail: "",
    quantity: 1,
    giftMessage: "",
  });
  const [isGiftingTicket, setIsGiftingTicket] = useState(false);

  const { data: upcomingData } = useGetEventsQuery({
    per_page: "20",
    page: 1,
    limit: 20,
    isPast: false,
    visible: true,
    isActive: true,
  });

  const selectedEventForTickets = events?.find(
    (e) => e.slug === goalFormData.event_slug
  );

  const { data: detailedEvent } = useGetEventByIdQuery(
    selectedEventForTickets?.slug,
    { skip: !selectedEventForTickets?.slug }
  );

  const balance =
    walletSummary?.regularBalance ||
    wallet?.regularBalance ||
    wallet?.balance ||
    0;
  const totalSavings = walletSummary?.totalSavings || 0;
  const currentUser = userProfile || authUser;

  const handleConnectUser = async (targetUserId) => {
    try {
      await sendConnectionRequest({ targetUserId }).unwrap();
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      await acceptConnection(connectionId).unwrap();
    } catch (error) {
      console.error("Failed to accept connection request:", error);
    }
  };

  const handleDeclineRequest = async (connectionId) => {
    try {
      await declineConnection(connectionId).unwrap();
    } catch (error) {
      console.error("Failed to decline connection request:", error);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    console.log("Profile updated:", updatedUser);
  };

  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };

  const handleConfirmAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      handleToast2("Please enter a valid amount");
      return;
    }

    setIsAddingMoney(true);
    setShowAddMoneyModal(false);

    try {
      const amountValue = parseFloat(amount);
      const description = "Added money to wallet";
      const response = await addFundsToWallet({
        amount: amountValue,
        description,
      }).unwrap();

      if (response?.payment?.checkout_url) {
        window.location.href = response?.payment?.checkout_url;
      }
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || "Failed to add money to wallet"
      );
    } finally {
      setIsAddingMoney(false);
      setAmount("");
    }
  };

  const handleCreateSavingsGoal = () => {
    setShowCreateGoalModal(true);
  };

  const handleConfirmCreateGoal = async () => {
    if (
      !goalFormData.event_slug ||
      !goalFormData.targetAmount ||
      !goalFormData.targetDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (
      goalFormData.savingType === "ticket_inclusive" &&
      !goalFormData.ticketTypeId
    ) {
      alert("Please select a ticket type for ticket inclusive savings");
      return;
    }

    const selectedEvent = events?.find(
      (e) => e.slug === goalFormData.event_slug
    );

    if (!selectedEvent) {
      alert("Please select a valid event");
      return;
    }

    setIsCreatingGoal(true);
    setShowCreateGoalModal(false);

    try {
      let goalName,
        ticketTypeInfo = null;

      let selectedTicketType = null;

      if (goalFormData.savingType === "ticket_inclusive") {
        const ticketTypes = detailedEvent.data?.packages || [];
        selectedTicketType = ticketTypes.find(
          (t) => t.id === Number(goalFormData.ticketTypeId)
        );
        if (!selectedTicketType) {
          alert("Please select a valid ticket type");
          setIsCreatingGoal(false);
          return;
        }

        ticketTypeInfo = {
          id: selectedTicketType.slug,
          name: selectedTicketType.name,
          price: selectedTicketType.price,
        };

        goalName = selectedEvent.title;
      } else {
        goalName = `${selectedEvent.title}`;
      }

      const goalData = {
        name: goalName,
        description:
          goalFormData.savingType === "ticket_inclusive"
            ? `${
                selectedTicketType.name
              } - MWK ${selectedTicketType.price.toLocaleString()}`
            : "Additional expenses for the event",
        targetAmount: parseFloat(goalFormData.targetAmount),
        targetDate: new Date(goalFormData.targetDate),
        event_slug: goalFormData.event_slug,
        savingType: goalFormData.savingType,
        ticketTypeId: goalFormData.ticketTypeId,
        ticketType: ticketTypeInfo,
      };

      await createSavingsGoal(goalData).unwrap();

      setGoalFormData({
        event_slug: "",
        savingType: "ticket_inclusive",
        ticketTypeId: "",
        targetAmount: "",
        targetDate: "",
      });
    } catch (error) {
      alert("Failed to create savings goal. Please try again.");
    } finally {
      setIsCreatingGoal(false);
    }
  };

  const handleAddToSavings = (goalId, goalName) => {
    setSelectedGoalForSavings({ id: goalId, name: goalName });
    setShowAddToSavingsModal(true);
  };

  const handleGiftTicket = () => {
    setShowGiftTicketModal(true);
  };

  const handleConfirmGiftTicket = async () => {
    if (
      !giftTicketData.selectedEvent ||
      !giftTicketData.selectedTicketType ||
      !giftTicketData.selectedConnection
    ) {
      handleToast2("Please fill in all required fields");
      return;
    }

    setIsGiftingTicket(true);
    setShowGiftTicketModal(false);

    try {
      const selectedConnection = connections?.find(
        (c) => c._id === giftTicketData.selectedConnection
      );
      const selectedEvent = events?.find(
        (e) => e.slug === giftTicketData.selectedEvent
      );

      if (!selectedConnection || !selectedEvent) {
        handleToast2("Invalid connection or event selected");
        return;
      }

      const giftData = {
        eventSlug: giftTicketData.selectedEvent,
        package_id: giftTicketData.selectedTicketType,
        name: selectedConnection.name,
        email: selectedConnection.email,
        quantity: giftTicketData.quantity,
        isGift: true,
        recipientName: selectedConnection.name,
        recipientEmail: selectedConnection.email,
        giftMessage: giftTicketData.giftMessage,
        redirect_url: window.location.origin + "/ticketpurchase",
        cancel_url: window.location.origin + "/ticketpurchasecancel",
      };

      const response = await giftTicket(giftData).unwrap();

      if (response?.payment?.checkout_url) {
        window.location.href = response.payment.checkout_url;
      }

      handleSuccessToast2(
        `Gift ticket purchase initiated for ${selectedConnection.name}`
      );

      setGiftTicketData({
        selectedEvent: "",
        selectedTicketType: "",
        selectedConnection: "",
        recipientName: "",
        recipientEmail: "",
        quantity: 1,
        giftMessage: "",
      });
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || "Failed to purchase gift ticket"
      );
    } finally {
      setIsGiftingTicket(false);
    }
  };

  const handleConfirmAddToSavings = async () => {
    if (!savingsAmount || parseFloat(savingsAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!selectedGoalForSavings) {
      alert("No savings goal selected");
      return;
    }

    setIsAddingToSavings((prev) => ({
      ...prev,
      [selectedGoalForSavings.id]: true,
    }));
    setShowAddToSavingsModal(false);

    try {
      const amountValue = parseFloat(savingsAmount);
      await depositToSavings({
        goalId: selectedGoalForSavings.id,
        amount: amountValue,
      }).unwrap();
      console.log(amountValue, selectedGoalForSavings);
      handleSuccessToast2(
        `Successfully added MWK ${parseFloat(
          amountValue
        ).toLocaleString()} to ${selectedGoalForSavings.name}`
      );
      await refetchSavingsGoals();
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || "Failed to add money to savings goal"
      );
    } finally {
      setIsAddingToSavings((prev) => ({
        ...prev,
        [selectedGoalForSavings.id]: false,
      }));
      setSavingsAmount("");
      setSelectedGoalForSavings(null);
    }
  };

  return (
    <div className="h-screen bg-[#ffff] grid grid-cols-11 px-10">
      <div className="col-span-3 px-1 pt-2 overflow-y-auto custom-scrollbar min-h-screen pr-4">
        <ConnectionsSidebar
          connectionsTab={connectionsTab}
          setConnectionsTab={setConnectionsTab}
          isConnectionsLoading={isConnectionsLoading}
          connections={connections}
          isPendingLoading={isPendingLoading}
          pendingRequests={pendingRequests}
          isSentLoading={isSentLoading}
          sentRequestsData={sentRequestsData}
          isSuggestedLoading={isSuggestedLoading}
          suggestedConnections={suggestedConnections}
          handleConnectUser={handleConnectUser}
          handleAcceptRequest={handleAcceptRequest}
          handleDeclineRequest={handleDeclineRequest}
        />
        <GiftTicketModal
          isOpen={showGiftTicketModal}
          onClose={() => setShowGiftTicketModal(false)}
          events={events}
          connections={connections}
          giftTicketData={giftTicketData}
          setGiftTicketData={setGiftTicketData}
          handleConfirmGiftTicket={handleConfirmGiftTicket}
          isGiftingTicket={isGiftingTicket}
        />
      </div>

      <div className="col-span-5 overflow-y-auto custom-scrollbar px-6 pt-6 min-h-screen bg-[#F3F3F3]">
        <ProfileHeader
          currentUser={currentUser}
          onProfileUpdate={handleProfileUpdate}
        />

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-[700] text-[#2D2D2D]">
              {currentUser?.name || "Loading..."}
            </h1>
            <p className="text-sm text-[#959595]">
              @{currentUser?.username || "username"}
            </p>
          </div>

          <ProfileStats currentUser={currentUser} connections={connections} />
        </div>

        <ProfileTabs profileTab={profileTab} setProfileTab={setProfileTab} />

        <div className="mt-6">
          {profileTab === "content" && <ContentTab currentUser={currentUser} />}
          {profileTab === "events" && <EventsTab currentUser={currentUser} />}
        </div>
      </div>

      <div className="col-span-3 overflow-y-auto custom-scrollbar px-4 pt-2 min-h-screen">
        <WalletSidebar
          balance={balance}
          totalSavings={totalSavings}
          isAddingMoney={isAddingMoney}
          handleAddMoney={handleAddMoney}
          handleCreateSavingsGoal={handleCreateSavingsGoal}
          isCreatingGoal={isCreatingGoal}
          savingsGoals={savingsGoals}
          isAddingToSavings={isAddingToSavings}
          handleAddToSavings={handleAddToSavings}
          refetchSavingsGoals={refetchSavingsGoals}
          isTransactionsLoading={isTransactionsLoading}
          transactions={transactions}
          handleGiftTicket={handleGiftTicket}
        />
      </div>

      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        amount={amount}
        setAmount={setAmount}
        handleConfirmAddMoney={handleConfirmAddMoney}
        isAddingMoney={isAddingMoney}
      />

      <AddToSavingsModal
        isOpen={showAddToSavingsModal}
        onClose={() => setShowAddToSavingsModal(false)}
        goalName={selectedGoalForSavings?.name}
        amount={savingsAmount}
        setAmount={setSavingsAmount}
        handleConfirmAddToSavings={handleConfirmAddToSavings}
        isAddingToSavings={
          selectedGoalForSavings
            ? isAddingToSavings[selectedGoalForSavings.id]
            : false
        }
      />

      <CreateGoalModal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        events={events}
        goalFormData={goalFormData}
        setGoalFormData={setGoalFormData}
        detailedEvent={detailedEvent?.data}
        handleConfirmCreateGoal={handleConfirmCreateGoal}
        isCreatingGoal={isCreatingGoal}
      />

      <GiftTicketModal
        isOpen={showGiftTicketModal}
        onClose={() => setShowGiftTicketModal(false)}
        events={events}
        connections={connections}
        giftTicketData={giftTicketData}
        setGiftTicketData={setGiftTicketData}
        handleConfirmGiftTicket={handleConfirmGiftTicket}
        isGiftingTicket={isGiftingTicket}
      />
    </div>
  );
}
