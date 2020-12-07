import shortid from 'shortid';
import { imageIdentifier, findImageIds } from './lib/util';

// caching

// optimal source:
// calc optimal source
// rest optimal source at smaller requests
// rest optimal source if viewport size is steady
// load biggest source of same image
// fallback to prior source if new fails to load
// set loading for parent pages
// loading order, load for unrendered routes


// width, height, src, srcRatio, targetRatio, awaitLoad, priority


// LoadingService? Two Services?
class ImageService {
    pages = [];
    images = {};
    cachedSources = {};

    init() {
        console.log('init ImageService');// TODO remove dev code
    }

    onAllCompsInitiated(onInitialViewComplete, timeout) {
        console.log('ALL COMPS INIT IN IMAGE SERVICE: ', this.pages);// TODO remove dev code

        onInitialViewComplete();
    }

    subscribePage(pageNode, onImagesComplete) {
        this.pages.push({
            imageIds: findImageIds(pageNode),
            onImagesComplete
        });
    }

    subscribeImage(props) {
        const id = imageIdentifier + shortid.generate();

        this.images[id] = {
            ...props
        };

        return id;
    }

    updateImage(id, props) {

    }
}

export default ImageService;