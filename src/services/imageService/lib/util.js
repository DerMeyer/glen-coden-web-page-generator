export const ImageState = {
    FRESH: 'fresh',
    STAGED: 'staged',
    QUEUED: 'queued',
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success'
};

export const pageIdentifier = 'page-subscription-';
export const imageIdentifier = 'image-subscription-';

export function findImageIds(node) {
    return Array
        .from(node.childNodes)
        .reduce((r, e) => {
            if (typeof e.id === 'string' && e.id.startsWith(imageIdentifier)) {
                return [ ...r, e.id ];
            }
            if (e.childNodes.length) {
                return [ ...r, ...findImageIds(e) ];
            }
            return r;
        }, []);
}