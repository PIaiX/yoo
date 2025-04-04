class RequestQueue {
      constructor() {
            this.queue = [];
            this.isProcessing = false;
      }

      add(requestFn) {
            return new Promise((resolve, reject) => {
                  this.queue.push({ requestFn, resolve, reject });
                  if (!this.isProcessing) {
                        this.processNext();
                  }
            });
      }

      async processNext() {
            if (this.queue.length === 0) {
                  this.isProcessing = false;
                  return;
            }

            this.isProcessing = true;
            const { requestFn, resolve, reject } = this.queue[0];

            try {
                  const result = await requestFn();
                  resolve(result);
            } catch (error) {
                  reject(error);
            } finally {
                  this.queue.shift();
                  this.processNext();
            }
      }
}

export const cartQueue = new RequestQueue();