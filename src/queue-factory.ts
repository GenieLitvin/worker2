import { AsyncWorkerQueue, AsyncWorkerQueueConstructor, WorkerFunktion } from './types';

export function createAsyncWorkerQueue<T>(
    ctor: AsyncWorkerQueueConstructor<T>,
    workerFunction: WorkerFunktion<T>,
    concurrency: number
): AsyncWorkerQueue<T> {
    return new ctor(workerFunction, concurrency);
}
