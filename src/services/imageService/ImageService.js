import shortid from 'shortid';
import { ImageState, pageIdentifier, imageIdentifier, findImageIds } from './lib/util';
import { getOptimalSrc } from './lib/optimalSource';

// optimal source:
// calc optimal source
//
// rest optimal source at smaller requests
// load biggest source of same image
// fallback to prior source if new fails to load

// how to deal with bg from css?


const maxNumCachedSrc = 3; // 100;
const clearCacheEntryAfter = 1000 * 60 * 60;

class ImageService {
    pages = {};
    images = {};
    queue = [];
    cache = {};
    onInitialViewComplete = () => {};

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
        const id = pageIdentifier + shortid.generate();
        const imageIds = findImageIds(pageNode);
        let awaitCount = 0;

        imageIds.forEach(imgId => {
            if (this.images[imgId].awaitLoad) {
                awaitCount++;
                this.images[imgId].pageId = id;
            }
        });
        if (!awaitCount) {
            onImagesComplete();
        }

        this.pages[id] = { id, awaitCount, onImagesComplete };

        return id;
    }

    subscribeImage(awaitLoad, priority) {
        const id = imageIdentifier + shortid.generate();
        this.images[id] = {
            id,
            pageId: '',
            awaitLoad,
            priority: awaitLoad ? 0 : priority,
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
            case ImageState.READY:
            case ImageState.LOADING:
                return img.promise;
            case ImageState.ERROR:
                return Promise.resolve('image service error loading src');
            case ImageState.SUCCESS:
                return this._cacheExists(img.src, img.size)
                    ? this._resolveImage(img)
                    : this._initImage(img);
            default:
                return Promise.resolve('image service failed to supply url');
        }
    }

    _resolveImage(img) {
        this._handleAwaitCount(img);
        return Promise.resolve(img.url);
    }

    _initImage(img) {
        const { width, height, src, srcRatio } = img;
        const { size, url } = getOptimalSrc(width, height, src, srcRatio);

        if (this._cacheExists(src, size)) {
            return Promise.resolve(url);
        }

        let resolve;
        const promise = new Promise(res => {
            resolve = arg => {
                this._handleAwaitCount(img);
                res(arg);
            };
        });

        this.images[img.id] = {
            ...img,
            state: ImageState.READY,
            promise,
            resolve,
            size,
            url
        };

        if (!Object.values(this.images).find(img => img.state === ImageState.NONE)) {
            this._initQueue();
        }

        return promise;
    }

    _handleAwaitCount(img) {
        if (img.pageId) {
            const page = this.pages[img.pageId];
            page.awaitCount--;
            if (!page.awaitCount) {
                page.onImagesComplete();
            }
            if (!Object.values(this.pages).find(page => page.awaitCount)) {
                this.onInitialViewComplete();
            }
        }
    }

    _initQueue() {
        Object.values(this.images).forEach(img => {
            if (img.state !== ImageState.READY) {
                return;
            }
            img.state = ImageState.QUEUED;
            if (typeof img.priority !== 'undefined') {
                const i = Number(img.priority);
                if (!Array.isArray(this.queue[i])) {
                    this.queue[i] = [ img ];
                    return;
                }
                this.queue[i].push(img);
            }
        });

        this._runQueue();
    }

    _runQueue() {
        const cur = this.queue.find(e => Array.isArray(e) && e.length);
        if (!cur) {
            return;
        }
        Promise.all(cur.map(img => this._loadSource(img)))
            .then(() => this._runQueue());
        this.queue.splice(this.queue.indexOf(cur), 1, []);
    }

    _loadSource(img) {
        const file = new Image();

        file.onerror = () => {
            console.warn('image service loading error');// TODO remove dev code
            // look for alternative
            img.state = ImageState.ERROR;
            img.promise = null;
            img.resolve(img.src);
        };

        file.onload = () => {
            this._createCacheEntry(img.src, img.size, file);
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
            this.cache[src] = { updatedAt: Date.now() };
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
        if (Object.keys(this.cache).length > maxNumCachedSrc) {
            delete this.cache.sort((a, b) => b.updatedAt - a.updatedAt).pop();
        }
    }

    _cacheExists(src, size) {
        if (!this.cache[src] || !this.cache[src][size]) {
            return false;
        }
        this.cache[src].updatedAt = Date();
        clearTimeout(this.cache[src][size].timeoutId);
        this.cache[src][size].timeoutId = setTimeout(() => {
            this.cache[src][size] = null;
        }, clearCacheEntryAfter);
        console.log('##### CACHE EXISTS');// TODO remove dev code
        return true;
    }
}

export default ImageService;