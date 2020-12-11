import shortid from 'shortid';
import { imageIdentifier, findImageIds } from './lib/util';

// caching
// cache clear timeout after last request for source

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
    cachedSources = {};

    init() {
        return Promise.resolve();
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        console.log('*** ALL COMPS INIT IN IMAGE SERVICE: ', this.pages);// TODO remove dev code

        onInitialViewComplete();
    }

    subscribePage(pageNode, onImagesComplete) {
        this.pages.push({
            imageIds: findImageIds(pageNode),
            onImagesComplete
        });
    }

    subscribeImage(props = {}) {
        // width, height, src, srcRatio, targetRatio, awaitLoad, priority
        const id = imageIdentifier + shortid.generate();
        console.log('*** SUBSCRIBE', id);// TODO remove dev code

        this.images[id] = {
            ...props
        };

        return id;
    }

    unsubscribeImage(id) {
        console.log('*** UNSUBSCRIBE', id);// TODO remove dev code
        delete this.images[id];
    }

    getImageUrl(id, props = {}) {
        console.log('*** GET URL', id);// TODO remove dev code
        return Promise.resolve(this.images[id].src);
    }
}

export default ImageService;