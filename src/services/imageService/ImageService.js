import shortid from 'shortid';
import { imageIdentifier, findImageIds, LoadingState } from './lib/util';
import { getOptimalSrc } from './lib/optimalSource';

// caching
// cache clear timeout after last request for source

// [srcName]: {
//      100: {
//          url: 'images/100px/my-image.jpeg',
//          file: new Image...
//          status:


// optimal source:
// calc optimal source
// rest optimal source at smaller requests
// rest optimal source if viewport size is steady
// load biggest source of same image
// fallback to prior source if new fails to load
// set loading for parent pages
// loading order, load for unrendered routes

// how to deal with bg from css?


class ImageService {
    pages = [];
    images = {};
    cache = {};
    queue = [];
    queueIndex = 0;
    onInitialViewComplete = () => {};
    timeoutId = 0;

    init() {
        return Promise.resolve();
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        console.log('*** ALL COMPS INIT IN IMAGE SERVICE: ', this.pages);// TODO remove dev code

        this.onInitialViewComplete = onInitialViewComplete;
        this.timeoutId = setTimeout(onInitialViewComplete, timeout * 1000);

        this._initQueue();
    }

    _initQueue() {
        const awaitLoad = [];

        Object.values(this.images).forEach(e => {
            if (e.awaitLoad) {
                awaitLoad.push(e);
                return;
            }
            if (typeof e.priority !== 'undefined') {
                const i = Number(e.priority);
                if (!Array.isArray(this.queue[i])) {
                    this.queue[i] = [ e ];
                    return;
                }
                this.queue[i].push(e);
            }
        });

        Promise.all(awaitLoad.map(e => this._loadSource(e)))
            .then(this.onInitialViewComplete);

        this._loadNext();
    }

    _loadNext() {
        if (this.queueIndex >= this.queue.length) {
            return;
        }
        const next = this.queue[this.queueIndex];
        if (!next) {
            this.queueIndex++;
            this._loadNext();
        }
        Promise.all(next.map(e => this._loadSource(e)))
            .then(() => {
                this.queueIndex++;
                this._loadNext();
            });
    }

    _loadSource(image) {
        let res;
        let rej;
        const srcPromise =  new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });
        const { src, size, url } = image;

        this._createCacheEntry(src, size, url);
        const cacheEntry =this.cache[src][size];

        const img = new window.Image();

        img.onerror = () => {
            console.log('LOADING ERROR ON JS IMAGE');// TODO remove dev code
            // look for alternative
            rej();
        };
        img.onload = () => {
            cacheEntry.file = img;
            cacheEntry.state = LoadingState.SUCCESS;
            res(url);
        };
        img.src = url;

        cacheEntry.file = srcPromise;
        cacheEntry.state = LoadingState.LOADING;

        return srcPromise;
    }

    _createCacheEntry(src, size, url) {
        if (!this.cache[src]) {
            this.cache[src] = {};
        }
        if (!this.cache[src][size]) {
            this.cache[src][size] = {
                url,
                file: null,
                state: LoadingState.NONE
            };
        }
    }

    subscribePage(pageNode, onImagesComplete) {
        this.pages.push({
            imageIds: findImageIds(pageNode),
            onImagesComplete
        });
    }

    subscribeImage({ width, height, src, srcRatio, awaitLoad, priority }) {
        const id = imageIdentifier + shortid.generate();
        console.log('*** SUBSCRIBE', id);// TODO remove dev code
        const { size, url } = getOptimalSrc(width, height, src, srcRatio);
        this.images[id] = { width, height, src, srcRatio, awaitLoad, priority, size, url };
        return id;
    }

    unsubscribeImage(id) {
        console.log('*** UNSUBSCRIBE', id);// TODO remove dev code
        delete this.images[id];
    }

    getImageUrl({ id, width, height, src, srcRatio }) {
        console.log('*** GET URL', id, width, height, src, srcRatio);// TODO remove dev code
        const image = this.images[id];
        if (image.width === width && image.height === height && image.src === src && image.srcRatio === srcRatio) {
            // do sth
        }

        return new Promise(resolve => {
            const cacheEntry = this.cache[image.src][image.size];
            if (cacheEntry.state === LoadingState.LOADING) {
                console.log('=== STILL LOADING');// TODO remove dev code
                return cacheEntry.file.then(url => resolve(url));
            }
            console.log('=== LOADED, HERE IT COMES');// TODO remove dev code
            resolve(cacheEntry.url);
        });
    }
}

export default ImageService;