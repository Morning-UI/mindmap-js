/* eslint-disable no-magic-numbers */
import {
    NodeStyle,
}                                               from '../interface';
import {
    LINE_COLOR,
    FONT_SIZE,
    ITEM_RADIUS,
    OUTLINE_COLOR,
    OUTLINE_COLOR_ACTIVE,
    HOLDER_COLOR,
}                                               from './base';
import {
    MIND_NODE_STYLE,
}                                               from './nodeStyle';

export const MIND_HOLDER_NODE_STYLE: NodeStyle = {
    ...MIND_NODE_STYLE,
    bgColor : HOLDER_COLOR,
    fontColor : 'rgba(255, 255, 255, 0)',
    width : 80,
    height : 28,
};
