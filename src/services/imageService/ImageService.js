import shortid from 'shortid';
import { imageIdentifier, pageIdentifier, findImageIds } from './lib/util';

// caching

// optimal source:
// calc optimal source
// rest optimal source at smaller requests
// rest optimal source if viewport size is steady
// load biggest source of same image
// fallback to prior source if new fails to load
// set loading for parent pages
// loading order, load for unrendered routes


// LoadingService? Two Services?
class ImageService {
    images = {};
    pages = {};
    initialViewLoaded = false;

    init() {
        console.log('init ImageService');// TODO remove dev code
    }

    onAllCompsInitiated() {
        // get page nodes
        // start working!
    }

    subscribeImage(image) {
        const id = `${imageIdentifier}${shortid.generate()}`;

        this.images[id] = image;

        return id;
    }

    updateImage(id, props) {

    }

    subscribePage(pageNode) {
        const id = `${pageIdentifier}${shortid.generate()}`;

        this.pages[id] = {
            imageIds: findImageIds(pageNode)
        };

        return id;
    }
}

export default ImageService;