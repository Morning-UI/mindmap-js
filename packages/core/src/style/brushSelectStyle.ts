import {
    NodeStyle,
}                                               from '../interface';
import {
    LINE_WIDTH,
    HOLDER_COLOR,
    DRAG_COLOR,
}                                               from './base';

export const BRUSH_SELECT_STYLE: NodeStyle = {
    bgColor : DRAG_COLOR,
    borderColor : HOLDER_COLOR,
    borderWidth : LINE_WIDTH,
    borderDash : [5, 5],
};
