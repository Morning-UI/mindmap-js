import {
    MindShapeOptions,
    NodeStyle,
}                                               from '../interface';
import {
    MIND_HOLDER_EDGE_STYLE,
}                                               from '../style';

export const getMindHolderEdge = (): MindShapeOptions => ({
    getStyles (): NodeStyle {

        return {
            ...MIND_HOLDER_EDGE_STYLE,
        };

    },
});

