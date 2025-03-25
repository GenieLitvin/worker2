import { Queue } from '../src/queue';

describe('Queue', () => {
    it('should process tasks with concurrency', async () => {
        const results: number[] = [];
        const workerFunction = async (value: number) => {
            results.push(value);
        };
        const queue = new Queue(workerFunction, 2);
        queue.push(1);
        queue.push(2);
        queue.push(3);
        await queue.waitForAll();
        expect(results).toEqual([1, 2, 3]);
    });

    it('should call the callback after task completion', async () => {
        const callbackMock = jest.fn();
        const workerFunction = async () => {};
        const queue = new Queue(workerFunction, 1);
        queue.push(1, callbackMock);
        await queue.waitForAll();
        expect(callbackMock).toHaveBeenCalledTimes(1);
    });

    it('should respect max concurrency', async () => {
        const activeWorkers: number[] = [];
        const workerFunction = async (value: number) => {
            activeWorkers.push(value);
            await new Promise((resolve) => setTimeout(resolve, 100));
            activeWorkers.pop();
        };

        const queue = new Queue(workerFunction, 2);

        queue.push(1);
        queue.push(2);
        queue.push(3);

        await queue.waitForAll();

        // Ensure no more than 2 workers were active at the same time
        expect(activeWorkers.length).toBeLessThanOrEqual(2);
    });

    it('should pause and resume processing', async () => {
        const results: number[] = [];
        const workerFunction = async (value: number) => {
            results.push(value);
        };

        const queue = new Queue(workerFunction, 1);

        queue.push(1);
        queue.pause();
        queue.push(2);
        queue.push(3);

        // Wait a bit to ensure tasks are not processed while paused
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(results).toEqual([1]);

        queue.resume();
        await queue.waitForAll();

        expect(results).toEqual([1, 2, 3]);
    });

    it('should resolve waitForAll when all tasks are complete', async () => {
        const workerFunction = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        };

        const queue = new Queue(workerFunction, 1);

        queue.push(1);
        queue.push(2);
        queue.push(3);

        const waitPromise = queue.waitForAll();

        // Ensure waitForAll does not resolve prematurely
        let resolved = false;
        waitPromise.then(() => {
            resolved = true;
        });

        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(resolved).toBe(false);

        await waitPromise;
        expect(resolved).toBe(true);
    });
});
