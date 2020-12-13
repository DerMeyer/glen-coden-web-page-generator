import shortid from 'shortid';
import { ImageState, pageIdentifier, imageIdentifier, findImageIds } from './lib/util';
import { getOptimalSrc } from './lib/optimalSource';

import { trackingService } from '../../index';


// fallback to prior source if new fails to load

// how to deal with bg from css?


const maxNumCachedSrc = 3; // 100;
const clearCacheEntryAfter = 1000 * 60 * 60;

class ImageService {
    _pages = {};
    _images = {};
    _queue = [];
    _cache = {};
    _onInitialViewComplete = () => {};

    init() {
        return Promise.resolve();
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        const timeoutId = setTimeout(onInitialViewComplete, timeout * 1000);

        this._onInitialViewComplete = () => {
            trackingService.stopProcessTimer('IMAGE_SERVICE_INIT_TO_FIRST_VIEW');
            clearTimeout(timeoutId);
            onInitialViewComplete();
            this._onInitialViewComplete = () => {};
        };
    }

    subscribePage(pageNode, onImagesComplete) {
        const id = pageIdentifier + shortid.generate();
        const imageIds = findImageIds(pageNode);
        let awaitCount = 0;

        imageIds.forEach(imgId => {
            if (this._images[imgId].awaitLoad) {
                awaitCount++;
            }
            this._images[imgId].pageId = id;
        });
        if (!awaitCount) {
            onImagesComplete();
        }

        this._pages[id] = { id, awaitCount, onImagesComplete };

        return id;
    }

    subscribeImage(awaitLoad, priority) {
        if (!this._images.length) {
            trackingService.startProcessTimer('IMAGE_SERVICE_INIT_TO_LOAD');
            trackingService.startProcessTimer('IMAGE_SERVICE_INIT_TO_FIRST_VIEW');
        }
        const id = imageIdentifier + shortid.generate();
        this._images[id] = {
            id,
            pageId: '',
            awaitLoad,
            priority: awaitLoad ? 0 : priority,
            state: ImageState.FRESH
        };
        return id;
    }

    unsubscribeImage(id) {
        delete this._images[id];
    }

    getImageUrl({ id, width, height, src, srcRatio }) {
        const img = { ...this._images[id], width, height, src, srcRatio };

        switch (img.state) {
            case ImageState.FRESH:
                return this._initImage(img);
            case ImageState.STAGED:
            case ImageState.LOADING:
                return img.promise;
            case ImageState.ERROR:
                return Promise.resolve('image service error loading src');
            case ImageState.SUCCESS:
                const url = this._getCacheEntry(img.src, img.size);
                if (!url) {
                    return this._stageImage(img);
                }
                this._handleAwaitCount(img);
                return Promise.resolve(url);
            default:
                return Promise.resolve('image service failed to supply url');
        }
    }

    _initImage(img) {
        const { width, height, src, srcRatio } = img;
        const { size, url } = getOptimalSrc(width, height, src, srcRatio);

        const cacheUrl = this._getCacheEntry(src, size);
        if (cacheUrl) {
            return Promise.resolve(cacheUrl);
        }

        return this._stageImage({ ...img, size, url });
    }

    _stageImage(img) {
        let resolve;
        const promise = new Promise(res => {
            resolve = arg => {
                this._handleAwaitCount(img);
                res(arg);
            };
        });

        this._images[img.id] = {
            ...img,
            state: ImageState.STAGED,
            promise,
            resolve
        };

        if (!Object.values(this._images).find(img => img.state === ImageState.FRESH)) {
            this._bundleSources();
            this._initQueue();
        }

        return promise;
    }

    _handleAwaitCount(img) {
        if (img.awaitLoad) {
            const page = this._pages[img.pageId];
            if (!page.awaitCount) {
                return;
            }
            page.awaitCount--;
            if (!page.awaitCount) {
                page.onImagesComplete();
            }
            if (!Object.values(this._pages).find(page => page.awaitCount)) {
                this._onInitialViewComplete();
            }
        }
    }

    _bundleSources() {
        const images = Object.values(this._images);
        const sources = images.reduce((r, img) => {
            if (!r[img.src] || r[img.src].size < img.size) {
                r[img.src] = { size: img.size, url: img.url };
                return r;
            }
            return r;
        }, {});
        images.forEach(img => {
            img.url = sources[img.src].url;
        });
    }

    _initQueue() {
        Object.values(this._images).forEach(img => {
            if (img.state !== ImageState.STAGED) {
                return;
            }
            img.state = ImageState.QUEUED;
            if (typeof img.priority !== 'undefined') {
                const i = Number(img.priority);
                if (!Array.isArray(this._queue[i])) {
                    this._queue[i] = [ img ];
                    return;
                }
                this._queue[i].push(img);
            }
        });

        trackingService.stopProcessTimer('IMAGE_SERVICE_INIT_TO_LOAD');
        this._runQueue();
    }

    _runQueue() {
        const cur = this._queue.find(e => Array.isArray(e) && e.length);
        if (!cur) {
            return;
        }
        Promise.all(cur.map(img => this._loadSource(img)))
            .then(() => this._runQueue());
        this._queue.splice(this._queue.indexOf(cur), 1, []);
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
            this._setCacheEntry(img.src, img.size, img.url, file);
            img.state = ImageState.SUCCESS;
            img.promise = null;
            img.resolve(img.url);
        };

        file.src = img.url;
        img.state = ImageState.LOADING;

        return img.promise;
    }

    _setCacheEntry(src, size, url, file) {
        if (!this._cache[src]) {
            this._cache[src] = { updatedAt: Date.now() };
        }
        if (!this._cache[src][size]) {
            const timeoutId = setTimeout(() => {
                this._cache[src][size] = null;
            }, clearCacheEntryAfter);
            this._cache[src][size] = {
                url,
                file,
                timeoutId
            };
        }
        if (Object.keys(this._cache).length > maxNumCachedSrc) {
            delete this._cache.sort((a, b) => b.updatedAt - a.updatedAt).pop();
        }
    }

    _getCacheEntry(src, size) {
        if (!this._cache[src]) {
            return '';
        }
        if (!this._cache[src][size]) {
            size = Object.keys(this._cache[src]).find(e => Number(e) > size);
            if (!size) {
                return '';
            }
        }
        this._cache[src].updatedAt = Date.now();
        clearTimeout(this._cache[src][size].timeoutId);
        this._cache[src][size].timeoutId = setTimeout(() => {
            this._cache[src][size] = null;
        }, clearCacheEntryAfter);
        return this._cache[src][size].url;
    }
}

export default ImageService;