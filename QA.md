Q:  How can errors be handled in different ways?\
A:
- Typed error handling
- Task Retry Logic
- Event-based error notifications
- Dead letter queue for failed tasks
- Custom error handling callbacks

#. Typed error handling

```typescript
const errorHandler: ErrorHandler<number> = async (error, task) => {
    console.error(`Task ${task} failed:`, error.message);
    if (error.originalError) {
        console.error('Original error:', error.originalError);
    }
};

const queue = new Queue<number>(workerFunction, 3, errorHandler);

```

#. Task Retry Logic

```typescript
export class Queue<T> {
    private maxRetries = 3;
    private retryDelay = 1000; // ms

    private async processWithRetry(task: T, attempt = 1): Promise<void> {
        try {
            await this.workerFunction(task);
        } catch (error) {
            if (attempt < this.maxRetries) {
                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.processWithRetry(task, attempt + 1);
            }
            throw error;
        }
    }

    private async processNext(): Promise<void> {
        // ...existing code...
        try {
            await this.processWithRetry(task);
            callback?.();
        } catch (error) {
            // ...error handling...
        }
    }
}
```
#. Event-based error notifications

``` typescript
import { EventEmitter } from 'events';

export class Queue<T> extends EventEmitter {
    constructor(workerFunction: WorkerFunktion<T>, concurrency: number) {
        super();
        // ...existing code...
    }

    private async processNext(): Promise<void> {
        // ...existing code...
        try {
            await this.workerFunction(task);
            this.emit('taskComplete', task);
        } catch (error) {
            this.emit('taskError', new QueueError('Task failed', task, error as Error));
        }
    }
}

```

#. Dead letter queue for failed tasks

```typescript
interface FailedTask<T> {
    task: T;
    error: Error;
    timestamp: Date;
    attempts: number;
}

export class Queue<T> {
    private deadLetterQueue: FailedTask<T>[] = [];

    private async processNext(): Promise<void> {
        // ...existing code...
        try {
            await this.workerFunction(task);
        } catch (error) {
            if (error instanceof Error) {
                this.deadLetterQueue.push({
                    task,
                    error,
                    timestamp: new Date(),
                    attempts: 1
                });
            }
        }
    }

    getFailedTasks(): FailedTask<T>[] {
        return [...this.deadLetterQueue];
    }
}
```


Q: What other functionalities of the queue would be useful?

A: 
### Task prioritization

Add priority levels for tasks

Implement a pushWithPriority(task, priority) method

### Batch operations

pushBatch(tasks[]) to add multiple tasks at once

clear() to empty the queue

### Task cancellation

cancel(taskId) to remove specific tasks from the queue

cancelAll() to cancel all pending tasks

### Retry mechanism

Auto-retry failed tasks with configurable attempts

Implement exponential backoff

### Events and callbacks

Progress tracking and notifications

Task completion events

### Rate limiting

Limit tasks processed per time interval

### Task timeout handling

Set timeouts for individual tasks

Handle stalled tasks

### Statistics and monitoring

Track average processing time

Count successes/failures

Implement getStats() method


### Task filtering

Find or filter tasks based on criteria