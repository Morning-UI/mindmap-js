import * as G6 from '@antv/g6';
import { MIND_HOLDER_NODE_STYLE, } from '../style';
export var getMindHolderNode = function () { return ({
    drawShape: function (cfg, group) {
        var styles = G6.Util.deepMix(MIND_HOLDER_NODE_STYLE, cfg.style);
        var keyShape = group.addShape('rect', {
            attrs: {
                fill: styles.bgColor,
                cursor: 'default',
                width: styles.width,
                height: styles.height,
                x: 0,
                y: 0,
                radius: styles.radius,
            },
        });
        return keyShape;
    },
}); };
