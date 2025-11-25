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
  return Connection.find({
    $or: [{ user: userId }, { connection: userId }],
    status: "accepted",
  }).populate("user connection", "name email");
};

export const getPendingRequests = async (userId) => {
  return Connection.find({
    connection: userId,
    status: "pending",
  }).populate("user", "name email");
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

export const getSuggestedConnectionsService = async (userId, limit = 10) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const existingConnections = await Connection.find({
    $or: [{ user: objectId }, { connection: objectId }],
  });

  const excludedUserIds = new Set([userId]);

  existingConnections.forEach((conn) => {
    excludedUserIds.add(conn.user.toString());
    excludedUserIds.add(conn.connection.toString());
  });

  const excludedIdsArray = [...excludedUserIds];

  const currentUser = await User.findById(userId).select("interests location");

  const suggestions = await User.find({
    _id: { $nin: excludedIdsArray },
    interests: { $in: currentUser.interests },
    is_active: true,
  })
    .select("name email profile picture interests")
    .limit(limit);

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
