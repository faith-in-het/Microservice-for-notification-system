*Developing a Notification Microservice System for handling and managing user notifications efficiently in a scalable architecture.

*Using Kafka as the message broker to enable asynchronous communication between backend services and the notification service.

*Creating separate notification objects for each publisher/user to support personalized and independent notification handling.

*Implementing node-cron for scheduling automated background jobs and recurring tasks.

*Running a scheduled job in scheduler.js every 24 hours to execute a reporting script.

*The reporting script connects to the database and generates daily analytics, including:

*Number of unique users notified

*Breakdown of notification categories/types

*Maintaining clean architecture by separating scheduling logic from reporting and database logic.

*Implementing a buffering/grace-period mechanism before sending notifications to users.

*Preventing notifications from being sent for content that is deleted immediately after being posted.

*Ensuring notifications are only delivered if the content still exists after the buffer period, improving reliability and user experience.

![alt text](image.png)

**How It Works:**

1.  **Buffering Events**: When an `EPISODE_PUBLISH` or `EPISODE_COMMENT` event is received, it is not handled instantly. Instead, it is added as a job to an in-memory buffer with a timestamp.
    *   New episodes are held for **5 minutes**.
    *   New comments are held for **60 seconds**.

2.  **Handling Deletions**: If a corresponding `EPISODE_DELETE` or `COMMENT_DELETE` event arrives while the job is still in the buffer, the job is removed, effectively cancelling the notification.

3.  **Processing Matured Jobs**: A background scheduler runs every 10 seconds to check the buffer. If a job's grace period has passed, the scheduler processes it, and the notification is generated and sent.

**Data Structure Choice:**

A JavaScript `Map` was chosen for the buffer due to its high performance for this specific task. It provides instant O(1) time complexity for adding, retrieving, and—most importantly—deleting jobs by their unique ID. This ensures that the cancellation process is fast and efficient, even under heavy load. 

### Event Types used and End points used in the code

### Event types and their corresponding eventDetails shape
FANFIC_PUBLISH
fanficId: string (fanfic_id)

EPISODE_PUBLISH
fanficId: string(fanfic_id)
episodeNumber: number

FANFIC_FOLLOW
fanficId: string (fanfic_id)
followerId: string (user_id)

EPISODE_COMMENT
fanficId: string(fanfic_id)
commentId: string (comment_id)
episodeNumber: number
commenterId: string (user_id)
commentText: string

USER_FOLLOW
	userId: string (user_id)
	followerId: string (user_id)

UNSUBSCRIBE
	userId: string (user_id)

RESUBSCRIBE
	userId: string (user_id)

DELETE_EPISODE
fanficId: string (fanfic_id)

DELETE_COMMENT
commentId: string (comment_id) 

### Upstream API Handlers

GET /users/{user_id}/followers
returns {page: Array<string> (user_id), cursor: string, hasMore: boolean}

GET /fanfics/{fanfic_id}/followers
returns {page: Array<string> (user_id), cursor: string, hasMore: boolean}

GET /fandoms/{fandom_id}/followers
returns {page: Array<string> (user_id), cursor: string, hasMore: boolean}

GET /fanfics/{fanfic_id}
returns {creators: Array<string> (user_id), fanficName: string, fanficDescription: string, fandoms: Array<string> (fandom_id)}

GET /fanfics/{fanfic_id}/episodes/{episode_number}
returns {episodeDescription: string}
Note: episodes are always attributed to the same creators as of the fanfic to which they belong.

GET /users/{user_id}
returns {nickname: string}
