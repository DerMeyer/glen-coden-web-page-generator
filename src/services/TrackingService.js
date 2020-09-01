class TrackingService {
    constructor() {
        this.initAt = Date.now();
        this.callRenderAt = 0;
        this.pageLoadedAt = 0;
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
}

export default TrackingService;