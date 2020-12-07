import { isObject } from '../../../js/helpers';

function applyReboxTheme(config, theme) {
    if (!isObject(config) || !isObject(theme)) {
        return;
    }
    Object.keys(config).forEach(k => {
        const v = config[k];
        if (isObject(v)) {
            applyReboxTheme(v, theme);
            return;
        }
        if (k === 'fontSize' && typeof v === 'number') {
            config[k] = `${theme.fontSizes[v]}px`;
            return;
        }
        if (
            ((typeof k === 'string' && k.toLowerCase().includes('color')) || k === 'bg')
            && theme.colors[v]
        ) {
            config[k] = theme.colors[v];
            return;
        }
        if (
            (
                k === 'p' || k === 'px' || k === 'py' || k === 'pt' || k === 'pr' || k === 'pb' || k === 'pl'
                || k === 'm' || k === 'mx' || k === 'my' || k === 'mt' || k === 'mr' || k === 'mb' || k === 'ml'
                || k === 'gap' || k === 'columnGap' || k === 'rowGap'
            )
            && typeof v === 'number'
        ) {
            config[k] = theme.space[v] === 0 ? 0 : `${theme.space[v]}px`;
            return;
        }
        if (
            (k === 'font')
            && theme.fonts[v]
        ) {
            config[k] = theme.fonts[v];
            return;
        }
        if (
            (k === 'fontWeight')
            && theme.fontWeights[v]
        ) {
            config[k] = theme.fontWeights[v];
            return;
        }
        if (
            (k === 'lineHeight')
            && theme.lineHeights[v]
        ) {
            config[k] = theme.lineHeights[v];
            return;
        }
        if (
            (k === 'shadow')
            && theme.shadows[v]
        ) {
            config[k] = theme.shadows[v];
            return;
        }
        if (k === 'variant') {
            let variants = theme.variants;
            if (
                config.component
                && (config.component === 'Text' || config.component === 'Heading')
            ) {
                variants = theme.text;
            }
            if (config.component && config.component === 'Button') {
                variants = theme.buttons;
            }
            Object.keys(variants).forEach(variant => {
                if (v === variant) {
                    Object.keys(variants[variant]).forEach(prop => {
                        if (config[prop]) {
                            return;
                        }
                        config[prop] = variants[variant][prop];
                    });
                }
            });
        }
    });
}

export default applyReboxTheme;