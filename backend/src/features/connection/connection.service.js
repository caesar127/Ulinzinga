import Connection from "./connection.model.js";
import User from "../users/users.model.js";
import mongoose from "mongoose";

export const createConnectionRequest = async (userId, targetUserId) => {
  if (userId === targetUserId) {
    throw new Error("You cannot connect with yourself");
  }

  try {
    const connection = await Connection.create({
      user: userId,
      connection: targetUserId,
    });

    return connection;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Connection request already exists");
    }
    throw error;
  }
};

export const acceptConnection = async (id, userId) => {
  const conn = await Connection.findById(id);
  if (!conn) throw new Error("Connection not found");

  if (conn.connection.toString() !== userId.toString()) {
    throw new Error("Only the recipient can accept the request");
  }

  conn.status = "accepted";
  await conn.save();

  return conn;
};

export const rejectConnection = async (id, userId) => {
  const conn = await Connection.findById(id);
  if (!conn) throw new Error("Connection not found");

  if (conn.connection.toString() !== userId.toString()) {
    throw new Error("Only the recipient can reject the request");
  }

  conn.status = "rejected";
  await conn.save();

  return conn;
};

export const getUserConnections = async (userId) => {
  const userObjectId = userId.toString();

  const connections = await Connection.find({
    $or: [{ user: userId }, { connection: userId }],
    status: "accepted",
  }).populate("user connection", "name username email");

  return connections.map((conn) =>
    conn.user._id.toString() === userObjectId ? conn.connection : conn.user
  );
};

export const getPendingRequests = async (userId) => {
  return Connection.find({
    connection: userId,
    status: "pending",
  }).populate("user", "name email");
};

export const getSentRequests = async (userId) => {
  return Connection.find({
    user: userId,
    status: "pending",
  }).populate("connection", "name email");
};

export const deleteConnection = async (id, userId) => {
  const conn = await Connection.findById(id);
  if (!conn) throw new Error("Connection not found");

  if (
    conn.user.toString() !== userId.toString() &&
    conn.connection.toString() !== userId.toString()
  ) {
    throw new Error("Not authorized to delete this connection");
  }

  await conn.deleteOne();
  return true;
};

export const getSuggestedConnectionsService = async (userId, limit = 2) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const existingConnections = await Connection.find({
    $or: [{ user: objectId }, { connection: objectId }],
  });

  const excludedUserIds = new Set([userId]);

  existingConnections.forEach((conn) => {
    excludedUserIds.add(conn.user.toString());
    excludedUserIds.add(conn.connection.toString());
  });

  const excludedIdsArray = [...excludedUserIds].map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const currentUser = await User.findById(userId).select("interests");
  if (!currentUser || !currentUser.interests.length) return [];

  const userInterests = currentUser.interests;

  const suggestions = await User.aggregate([
    {
      $match: {
        _id: { $nin: excludedIdsArray },
        isActive: true,
        interests: { $in: userInterests },
      },
    },

    {
      $addFields: {
        overlapIds: {
          $setIntersection: ["$interests", userInterests],
        },
      },
    },

    {
      $addFields: {
        overlapCount: { $size: "$overlapIds" },
      },
    },

    { $match: { overlapCount: { $gt: 0 } } },

    { $sort: { overlapCount: -1 } },

    {
      $lookup: {
        from: "eventcategories",
        localField: "overlapIds",
        foreignField: "_id",
        as: "interests",
      },
    },

    {
      $addFields: {
        interests: { $slice: ["$interests", 2] },
      },
    },

    {
      $project: {
        name: 1,
        email: 1,
        picture: 1,
        profile: 1,
        overlapCount: 1,
        interests: {
          _id: 1,
          categoryId: 1,
          name: 1,
          color: 1,
        },
      },
    },
  ]);

  return suggestions;
};

export const getAdvancedSuggestedConnectionsService = async (
  userId,
  limit = 10
) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  return await User.aggregate([
    { $match: { _id: { $ne: objectId } } },

    {
      $lookup: {
        from: "connections",
        let: { otherUserId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$user", objectId] },
                  { $eq: ["$connection", objectId] },
                ],
              },
            },
          },
        ],
        as: "existingConnection",
      },
    },

    { $match: { existingConnection: { $size: 0 } } },

    {
      $lookup: {
        from: "eventcategories",
        localField: "interests",
        foreignField: "_id",
        as: "interestsInfo",
      },
    },

    {
      $addFields: {
        sharedInterests: {
          $size: {
            $setIntersection: [
              "$interests",
              (await User.findById(userId).select("interests")).interests,
            ],
          },
        },
      },
    },

    { $sort: { sharedInterests: -1 } },
    { $limit: limit },
    { $project: { password: 0 } },
  ]);
};
