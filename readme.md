### Task 1 work flow

For sending notification to users we use Kafka 
and for notification to publisher of fanFic we have to make opbject for each Publisher and this is basic flow of the Task.


![alt text](image.png)

### Task 2 Flow

Used `node-cron` for scheduling background jobs such as:
A scheduled job in scheduler.js runs a reporting script once every
24 hours. This script connects to the database to count key metrics from the last day, such as the number of unique users notified and a breakdown of notification types. The scheduler simply acts as a timer, keeping the database logic separate in the reporting script.


### Task 3: Notification Buffering and Grace Period

To prevent sending notifications for content that is deleted immediately after being posted, this service implements a buffering mechanism. This provides a "grace period" for actions, ensuring users don't receive notifications for content that was quickly removed.

**How It Works:**

1.  **Buffering Events**: When an `EPISODE_PUBLISH` or `EPISODE_COMMENT` event is received, it is not handled instantly. Instead, it is added as a job to an in-memory buffer with a timestamp.
    *   New episodes are held for **5 minutes**.
    *   New comments are held for **60 seconds**.

2.  **Handling Deletions**: If a corresponding `EPISODE_DELETE` or `COMMENT_DELETE` event arrives while the job is still in the buffer, the job is removed, effectively cancelling the notification.

3.  **Processing Matured Jobs**: A background scheduler runs every 10 seconds to check the buffer. If a job's grace period has passed, the scheduler processes it, and the notification is generated and sent.

**Data Structure Choice:**

A JavaScript `Map` was chosen for the buffer due to its high performance for this specific task. It provides instant O(1) time complexity for adding, retrieving, and—most importantly—deleting jobs by their unique ID. This ensures that the cancellation process is fast and efficient, even under heavy load. 
