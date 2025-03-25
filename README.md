# In-Memory Async Queue

This project implements a local in-memory queue that is created with an asynchronous worker function and a maximum number of concurrent workers.

### Install the dependencies:

```bash
npm install
```

### To run the project in development mode:
```bash
npm start
```


### To compile TypeScript into JavaScript:
```bash
npm run build
```


### Queue Functionality


The queue is designed to process tasks asynchronously while respecting a maximum concurrency limit. It provides the following key methods:

1. **`push(task: T, callback?: () => void): void`**
   - Adds a task to the queue.
   - The worker function will process the task asynchronously.

2. **`waitForAll(): Promise<void>`**
   - Waits until all tasks in the queue are processed.

3. **`length(): number`**
   - Returns the number of tasks currently waiting in the queue.

4. **`totalTasks(): number`**
   - Returns the total number of tasks, including both waiting and currently processing tasks.


## Testing

Run unit tests using Jest:
```bash
npm test
```