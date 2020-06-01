import './index.less';

import component                                from './index.vue';
import {
    Mindmap,
}                                               from './interface';

const mindmap: Mindmap = {
    install : (Vue, options) => {

        const _options = {
            tag : 'mindmap',
            ...options,
        };

        Vue.component(_options.tag, component);

    },
};

export default mindmap;
