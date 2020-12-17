import shortid from 'shortid';
import { ImageState, pageIdentifier, imageIdentifier, findImageIds } from './lib/util';
import { getOptimalSrc } from './lib/optimalSource';

const maxNumCachedSrc = 100;
const clearCacheEntryAfter = 1000 * 60 * 60;

// v1.1.1

class ImageService {
    _pages = {};
    _images = {};
    _queue = [];
    _cache = {};
    _onInitialViewComplete = () => {};
    _timeout = 0;

    init() {
        return Promise.resolve();
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        this._timeout = timeout;
        const timeoutId = setTimeout(onInitialViewComplete, timeout * 1000);

        this._onInitialViewComplete = () => {
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
        const timeoutId = setTimeout(onImagesComplete, this._timeout * 1000);
        const onComplete = () => {
            clearTimeout(timeoutId);
            onImagesComplete();
        };
        if (!awaitCount) {
            onComplete();
        }
        this._pages[id] = { id, awaitCount, onComplete };
        return id;
    }

    unsubscribePage(id) {
        delete this._pages[id];
    }

    subscribeImage(awaitLoad, priority) {
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
        let img = this._images[id];

        if (img.width !== width || img.height !== height || img.src !== src || img.srcRatio !== srcRatio) {
            img.state = ImageState.FRESH;
        }
        img.width = width;
        img.height = height;
        img.src = src;
        img.srcRatio = srcRatio;

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
            img.state = ImageState.SUCCESS;
            this._checkAllStaged();
            this._handleAwaitCount(img);
            return Promise.resolve(cacheUrl);
        }

        return this._stageImage({ ...img, size, url });
    }

    _stageImage(img) {
        let promise = img.promise;
        let resolve = img.resolve;

        if (!promise) {
            promise = new Promise(res => {
                resolve = arg => {
                    this._handleAwaitCount(img);
                    res(arg);
                };
            });
        }

        this._images[img.id] = {
            ...img,
            state: ImageState.STAGED,
            promise,
            resolve
        };

        this._checkAllStaged();

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
                page.onComplete();
            }
            if (!Object.values(this._pages).find(page => page.awaitCount)) {
                this._onInitialViewComplete();
            }
        }
    }

    _checkAllStaged() {
        if (!Object.values(this._images).find(img => img.state === ImageState.FRESH)) {
            this._bundleSources();
            this._initQueue();
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
            const fallbackUrl = this._getCacheEntry(img.src, img.size, true);
            if (!fallbackUrl) {
                console.warn('image service loading error: return initial src.');
                img.state = ImageState.ERROR;
                img.promise = null;
                img.resolve(img.src);
                return;
            }
            console.warn('image service loading error: try fallback.');
            img.url = fallbackUrl;
            this._stageImage(img);
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

    _getCacheEntry(src, size, error = false) {
        if (!this._cache[src]) {
            return '';
        }
        if (!this._cache[src][size]) {
            size = Object.keys(this._cache[src]).find(e => e > size);
            if (!size && error) {
                size = Object.keys(this._cache[src]).sort((a, b) => b - a)[0];
            }
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
