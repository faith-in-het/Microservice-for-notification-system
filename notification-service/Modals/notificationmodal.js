import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: String,
  notificationType: String,
  title: String,
  body: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model(
  "Notification",
  notificationSchema
);