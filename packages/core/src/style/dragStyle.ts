import {
    NodeStyle,
}                                               from '../interface';
import {
    LINE_WIDTH,
    HOLDER_COLOR,
    DRAG_COLOR,
}                                               from './base';

export const DRAG_NODE_STYLE: NodeStyle = {
    bgColor : DRAG_COLOR,
    borderColor : HOLDER_COLOR,
    borderWidth : LINE_WIDTH + 1,
    borderDash : [5, 5],
};
