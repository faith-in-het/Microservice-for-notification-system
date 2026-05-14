import { getFanfic, getFanficFollowers, getUser } from "./api.js";
import {  getFanfic, getFanficFollowers, getUser, getEpisode, } from "./api.js";
import { sendNotification } from "./producer.js";

export const handleFanficPublish = async (event) => {
  const { fanficId } = event;

  const fanfic = await getFanfic(fanficId);
  const followers = await getFanficFollowers(fanficId);

  const creator = await getUser(fanfic.creators[0]);

  const notifications = followers.map((followerId) => ({
    userId: followerId,

    notificationType: "NEW_FANFIC",

    title: `New fanfic from ${creator.nickname}`,

    body: `Check out the new fanfic "${fanfic.fanficName}"`,
}));


// Send all notifications together
await sendNotificationBatch(notifications);

console.log(
  `${notifications.length} notifications processed`
);
};

export const handleEpisodePublish = async (event) => {
  const { fanficId, episodeNumber } = event;

  // Get the fanfic details and its followers
  const fanfic = await getFanfic(fanficId);
  const followers = await getFanficFollowers(fanficId);

  
  const messages = followers.map((followerId) => ({
  value: JSON.stringify({
    userId: followerId,

    notificationType: "NEW_EPISODE",

    title: `New Episode in "${fanfic.fanficName}"`,

    body: `Episode ${episodeNumber} is now available for "${fanfic.fanficName}".`,
  }),
}));

await producer.send({
  topic: "notifications",
  messages,
});

console.log(
  `${messages.length} notifications pushed to Kafka`
);
};

// made object for notification here because this is a one to one event and above is one to many 
export const handleEpisodeComment = async (message) => {
  try {
    const { fanficId, commenterId, commentText } = message;

    const fanfic = await getFanfic(fanficId);
    const publisherId = fanfic.author;

    const commenter = await getUser(commenterId);

    const notification = new Notification({
      userId: publisherId,
      notificationType: "EPISODE_COMMENT",
      title: `New comment on your episode`,
      body: `${commenter.username} commented: "${commentText}" in "${fanfic.title}"`,
    });

    await notification.save();
    console.log("Notification saved for new comment:", notification);
  } catch (error) {
    console.error("Error handling new comment notification:", error);
  }
};

export const handleUserFollow = async (message) => {
  try {
    const { userId, followerId } = message;

    const follower = await getUser(followerId);

    const notification = new Notification({
      userId: userId,
      notificationType: "USER_FOLLOW",
      title: "You have a new follower!",
      body: `${follower.nickname} is now following you.`,
    });

    await notification.save();
    console.log("Notification saved for new follower:", notification);
  } catch (error) {
    console.error("Error handling new follower notification:", error);
  }
};
