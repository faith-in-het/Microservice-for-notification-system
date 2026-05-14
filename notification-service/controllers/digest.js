import Notification from "../Modals/notificationmodal.js";
import { sendDailyDigest } from "./api.js";
import { getFanfic } from "./api.js";

//main methods
export const generateAndSendDigests = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const notifications = await Notification.find({
      createdAt: { $gte: twentyFourHoursAgo },
    }).sort({ userId: 1 });

    if (notifications.length === 0) {
      console.log("No new notifications in the last 24 hours.");
      return;
    }

    let currentUser = null;
    let digest = createEmptyDigest();

    for (const notification of notifications) {
      if (currentUser !== notification.userId) {
        if (currentUser) {
          await sendDigest(currentUser, digest);
        }
        currentUser = notification.userId;
        digest = createEmptyDigest();
      }

      await processNotificationForDigest(notification, digest);
    }

    if (currentUser) {
      await sendDigest(currentUser, digest);
    }
  } catch (error) {
    console.error("Error generating digests:", error);
  }
};

const createEmptyDigest = () => ({
  newFanfics: [],
  fanficComments: [],
  newFollowers: 0,
});

// This is just a method we are using it above 
const processNotificationForDigest = async (notification, digest) => {
  switch (notification.notificationType) {
    case "NEW_FANFIC":
      if (notification.metadata && notification.metadata.fanficTitle) {
        digest.newFanfics.push(notification.metadata.fanficTitle);
      }
      break;
    case "EPISODE_COMMENT":
      if (notification.metadata && notification.metadata.fanficId) {
        const fanfic = await getFanfic(notification.metadata.fanficId);
        const fanficTitle = fanfic.title;
        let fic = digest.fanficComments.find((f) => f.fanfic === fanficTitle);
        if (fic) {
          fic.count++;
        } else {
          digest.fanficComments.push({ fanfic: fanficTitle, count: 1 });
        }
      }
      break;
    case "USER_FOLLOW":
      digest.newFollowers++;
      break;
  }
};

// This is just a method we are using it above 
const sendDigest = async (userId, digest) => {
  // Filter out empty sections
  const finalDigest = {};
  if (digest.newFanfics.length > 0) {
    finalDigest.newFanfics = digest.newFanfics;
  }
  if (digest.fanficComments.length > 0) {
    finalDigest.fanficComments = digest.fanficComments;
  }
  if (digest.newFollowers > 0) {
    finalDigest.newFollowers = digest.newFollowers;
  }

  if (Object.keys(finalDigest).length > 0) {
    console.log(`Sending digest to ${userId}:`, finalDigest);
    await sendDailyDigest(userId, finalDigest);
  }
};
