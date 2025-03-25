import { createAsyncWorkerQueue } from './types';
import { Queue } from './queue';

const workerFunction = async (value: number) => {
    const duration = Math.random() * 1000 * value;
    await new Promise((r) => setTimeout(r, duration));
    console.log(`${value} waited for ${duration} ms`);
};

async function main() {
    const CONCURRENCY = 3;
    // Create a queue for an async worker function with 3 concurrent workers
    const queue = createAsyncWorkerQueue<number>(
        Queue,
        workerFunction,
        CONCURRENCY,
    );
    // Add some data to the queue
    queue.push(10, () => console.log('10 done'));
    queue.push(9, () => console.log('9 done'));

    queue.push(8, () => console.log('8 done'));
    queue.push(7, () => console.log('7 done'));
    queue.push(6, () => console.log('6 done'));
    queue.push(5);
    queue.push(4);
    queue.push(3);
    queue.push(2);
    queue.push(1, () => console.log('1 done'));
    // Wait until all workers finished
    await queue.waitForAll();
    console.log('All done!');
}

main();
