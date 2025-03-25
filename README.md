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


### Queue Functionality


The queue is designed to process tasks asynchronously while respecting a maximum concurrency limit. It provides the following key methods:

1. **`push(task: T, callback?: () => void): void`**
   - Adds a task to the queue
   - The worker function will process the task asynchronously
   - Optional callback is called when task completes successfully

2. **`waitForAll(): Promise<void>`**
   - Returns a promise that resolves when all tasks in the queue are processed

3. **`length(): number`**
   - Returns the total number of tasks, including both queued and currently processing tasks

4. **`isEmpty(): boolean`**
   - Returns true when no tasks are queued or processing

5. **`pause(): void`** and **`resume(): void`**
   - Control task processing


## Testing

Run unit tests using Jest:
```bash
npm test
```