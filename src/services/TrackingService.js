class TrackingService {
    constructor() {
        this.initAt = Date.now();
        this.callRenderAt = 0;
        this.pageLoadedAt = 0;
        this.processTimers = {};
    }

    init() {
        console.log('TRACKING: Tracking service initiated.');
        return Promise.resolve();
    }

    callRender() {
        this.callRenderAt = Date.now();
    }

    pageLoaded() {
        if (this.pageLoadedAt) {
            return;
        }
        this.pageLoadedAt = Date.now();
        console.log(`TRACKING: Page loaded in ${(this.pageLoadedAt - this.initAt) / 1000} seconds.`);
        console.log(`TRACKING: Page rendered in ${(this.pageLoadedAt -this.callRenderAt) / 1000} seconds.`);
    }

    startProcessTimer(name) {
        this.processTimers[name] = Date.now();
    }

    stopProcessTimer(name) {
        if (!this.processTimers[name]) {
            console.log(`TRACKING: Can not stop the timer for unknown process ${name}.`);
            return;
        }
        console.log(`TRACKING: Process ${name} took ${(Date.now() - this.processTimers[name]) / 1000} seconds.`);
        delete this.processTimers[name];
    }
}

export default TrackingService;