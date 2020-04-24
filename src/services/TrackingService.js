class TrackingService {
    constructor() {
        this.initAt = Date.now();
        this.callRenderAt = 0;
        this.pageLoadedAt = 0;
    }

    callRender() {
        this.callRenderAt = Date.now();
    }

    pageLoaded() {
        if (this.pageLoadedAt) {
            return;
        }
        this.pageLoadedAt = Date.now();
        console.log(`Page loaded in ${(this.pageLoadedAt - this.initAt) / 1000} seconds.`);
        console.log(`Page rendered in ${(this.pageLoadedAt -this.callRenderAt) / 1000} seconds.`);
    }
}

export default TrackingService;