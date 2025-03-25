import { WorkerFunktion } from './types';

export class Queue<T> {
    private queue: { task: T; callback?: () => void }[] = [];
    private activeWorkers = 0;
    private waitingResolvers: (() => void)[] = [];
    private workerFunction: WorkerFunktion<T>;
    private maxConcurrency: number;
    private isPaused = false;

    constructor(workerFunction: WorkerFunktion<T>, concurrency: number) {
        if (concurrency < 1) {
            throw new Error('Concurrency must be at least 1');

        }
        this.workerFunction = workerFunction;
        this.maxConcurrency = concurrency;
    }

    push(task: T, callback?:()=>void): void {
        this.queue.push({task, callback});
        this.processNext();
    }

    async waitForAll(): Promise<void> {
        if (this.isEmpty() && this.activeWorkers === 0) {
            return; 
        }        
        return new Promise<void>((resolve) => {
            this.waitingResolvers.push(resolve);
        });
    }

    length(): number {
        return this.queue.length;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    pause(): void {
        this.isPaused = true;
    }

    resume(): void {
        if (this.isPaused) {
            this.isPaused = false;
            this.processNext();
        }
    }
    private async processNext(): Promise<void> {
        if (this.isPaused || this.activeWorkers >= this.maxConcurrency || this.isEmpty()) {
            return;
        }

        this.activeWorkers++;
        const { task, callback } = this.queue.shift()!;

        try {
            console.log('addedNewWorker #',this.activeWorkers, 'task #', task);
            await this.workerFunction(task);
            callback?.();
        } catch (error) {
            console.error('Worker function error:', error);
        } finally {
            this.activeWorkers--;
            this.processNext();
            
            if (this.isEmpty() && this.activeWorkers === 0) {
                this.resolveWaiters();
            }
        }
    }

    private resolveWaiters(): void {
        while (this.waitingResolvers.length > 0) {
            const resolver = this.waitingResolvers.shift();
            resolver?.();
        }
    }
}