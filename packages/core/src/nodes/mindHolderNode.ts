import * as G6                                  from '@antv/g6';
import {
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    MIND_HOLDER_NODE_STYLE,
}                                               from '../style';
import {
    MindShapeOptions,
    MindmapNodeItem,
}                                               from '../interface';

export const getMindHolderNode = (): MindShapeOptions => ({
    drawShape : (cfg: MindmapNodeItem, group): IShape => {

        const styles = G6.Util.deepMix(MIND_HOLDER_NODE_STYLE, cfg.style);
        const keyShape = group.addShape('rect', {
            attrs : {
                fill : styles.bgColor,
                cursor : 'default',
                width : styles.width,
                height : styles.height,
                x : 0,
                y : 0,
                radius : styles.radius,
            },
        });

        return keyShape;

    },
});
