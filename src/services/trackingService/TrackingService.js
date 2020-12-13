class TrackingService {
    _initAt = Date.now();
    _callRenderAt = 0;
    _pageLoadedAt = 0;
    _processTimers = {};

    init() {
        console.log('TRACKING: Tracking service initiated.');
        return Promise.resolve();
    }

    callRender() {
        this._callRenderAt = Date.now();
    }

    pageLoaded() {
        if (this._pageLoadedAt) {
            return;
        }
        this._pageLoadedAt = Date.now();
        console.log(`TRACKING: Page rendered in ${(this._pageLoadedAt -this._callRenderAt) / 1000} seconds.`);
        console.log(`TRACKING: Page loaded in ${(this._pageLoadedAt - this._initAt) / 1000} seconds.`);
    }

    startProcessTimer(name) {
        this._processTimers[name] = Date.now();
    }

    stopProcessTimer(name) {
        if (!this._processTimers[name]) {
            console.log(`TRACKING: Can not stop the timer for unknown process ${name}.`);
            return;
        }
        console.log(`TRACKING: Process ${name} took ${(Date.now() - this._processTimers[name]) / 1000} seconds.`);
        delete this._processTimers[name];
    }
}

export default TrackingService;