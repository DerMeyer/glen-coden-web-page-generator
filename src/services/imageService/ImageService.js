import shortid from 'shortid';
import { imageIdentifier, findImageIds, ImageState } from './lib/util';
import { getOptimalSrc } from './lib/optimalSource';

// optimal source:
// calc optimal source
//
// rest optimal source at smaller requests
// load biggest source of same image
// fallback to prior source if new fails to load
//
// set loading for parent pages

// how to deal with bg from css?

const clearCacheEntryAfter = 1000 * 60 * 60;

class ImageService {
    pages = [];
    images = {};
    cache = {};
    queue = [];
    queueIndex = 0;
    onInitialViewComplete = null;

    init() {
        return Promise.resolve();
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        const timeoutId = setTimeout(onInitialViewComplete, timeout * 1000);
        this.onInitialViewComplete = () => {
            clearTimeout(timeoutId);
            onInitialViewComplete();
            this.onInitialViewComplete = () => {};
        };
    }

    subscribePage(pageNode, onImagesComplete) {
        this.pages.push({
            imageIds: findImageIds(pageNode),
            onImagesComplete
        });
    }

    subscribeImage(awaitLoad, priority) {
        const id = imageIdentifier + shortid.generate();
        this.images[id] = {
            id,
            awaitLoad,
            priority,
            state: ImageState.NONE
        };
        return id;
    }

    unsubscribeImage(id) {
        delete this.images[id];
    }

    getImageUrl({ id, width, height, src, srcRatio }) {
        const img = { ...this.images[id], width, height, src, srcRatio };

        switch (img.state) {
            case ImageState.NONE:
                return this._initImage(img);
            case ImageState.INITIATED:
            case ImageState.LOADING:
                return img.promise;
            case ImageState.ERROR:
                return Promise.resolve('image service error loading src');
            case ImageState.SUCCESS:
                return this._cacheExists(img.src, img.size)
                    ? Promise.resolve(img.url)
                    : this._initImage(img);
            default:
                return Promise.resolve('image service failed to supply url');
        }
    }

    _initImage(img) {
        const { width, height, src, srcRatio } = img;
        const { size, url } = getOptimalSrc(width, height, src, srcRatio);

        let resolve;
        let reject;

        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        this.images[img.id] = {
            ...img,
            state: ImageState.INITIATED,
            promise,
            resolve,
            reject,
            size,
            url
        };

        if (!Object.values(this.images).find(img => img.state === ImageState.NONE)) {
            this._initQueue();
        }

        return promise;
    }

    _initQueue() {
        const awaitLoad = [];

        Object.values(this.images).forEach(img => {
            if (img.awaitLoad) {
                awaitLoad.push(img);
                return;
            }
            if (typeof img.priority !== 'undefined') {
                const i = Number(img.priority);
                if (!Array.isArray(this.queue[i])) {
                    this.queue[i] = [ img ];
                    return;
                }
                this.queue[i].push(img);
            }
        });

        Promise.all(awaitLoad.map(img => this._loadSource(img)))
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
        Promise.all(next.map(img => this._loadSource(img)))
            .then(() => {
                this.queueIndex++;
                this._loadNext();
            });
    }

    _loadSource(img) {
        const file = new Image();

        file.onerror = () => {
            console.log('LOADING ERROR ON JS IMAGE');// TODO remove dev code
            // look for alternative
            img.state = ImageState.ERROR;
            img.promise = null;
            img.reject();
        };

        file.onload = () => {
            img.state = ImageState.SUCCESS;
            img.promise = null;
            img.resolve(img.url);
        };

        file.src = img.url;

        img.state = ImageState.LOADING;

        return img.promise;
    }

    _createCacheEntry(src, size, file) {
        if (!this.cache[src]) {
            this.cache[src] = {};
        }
        if (!this.cache[src][size]) {
            const timeoutId = setTimeout(() => {
                this.cache[src][size] = null;
            }, clearCacheEntryAfter);
            this.cache[src][size] = {
                file,
                timeoutId
            };
        }
    }

    _cacheExists(src, size) {
        if (!this.cache[src] || !this.cache[src][size]) {
            return false;
        }
        clearTimeout(this.cache[src][size].timeoutId);
        this.cache[src][size].timeoutId = setTimeout(() => {
            this.cache[src][size] = null;
        }, clearCacheEntryAfter);
        return true;
    }
}

export default ImageService;