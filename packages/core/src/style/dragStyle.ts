import {
    NodeStyle,
}                                               from '../interface';
import {
    LINE_WIDTH,
    HOLDER_COLOR,
}                                               from './base';

export const DRAG_NODE_STYLE: NodeStyle = {
    bgColor : 'rgba(149, 222, 253, 0.3)',
    borderColor : HOLDER_COLOR,
    borderWidth : LINE_WIDTH + 1,
    borderDash : [5, 5],
};
