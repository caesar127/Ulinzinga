import {
  createConnectionRequest,
  acceptConnection,
  rejectConnection,
  getUserConnections,
  getPendingRequests,
  deleteConnection,
  getSuggestedConnectionsService,
  getAdvancedSuggestedConnectionsService,
} from "./connection.service.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const connection = await createConnectionRequest(
      req.user.userId,
      targetUserId
    );
    res.status(201).json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const approveConnection = async (req, res) => {
  try {
    const connection = await acceptConnection(req.params.id, req.user.userId);
    res.json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const declineConnection = async (req, res) => {
  try {
    const connection = await rejectConnection(req.params.id, req.user.userId);
    res.json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listConnections = async (req, res) => {
  try {
    const connections = await getUserConnections(req.user.userId);
    res.json(connections);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listPendingRequests = async (req, res) => {
  try {
    const requests = await getPendingRequests(req.user.userId);
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeConnection = async (req, res) => {
  try {
    await deleteConnection(req.params.id, req.user.userId);
    res.json({ message: "Connection removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSuggestedConnectionsController = async (req, res) => {
  try {
    const suggestions = await getSuggestedConnectionsService(req.user.userId);
    return res.json({ suggestions });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAdvancedSuggestedConnectionsController = async (req, res) => {
  try {
    const suggestions = await getAdvancedSuggestedConnectionsService(
      req.user.userId
    );
    return res.json({ suggestions });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};