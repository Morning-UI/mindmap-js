/* eslint-disable no-magic-numbers */
import {
    NodeStyle,
}                                               from '../interface';
import {
    LINE_WIDTH,
    HOLDER_COLOR,
}                                               from './base';
import {
    MIND_EDGE_STYLE,
}                                               from './edgeStyle';

export const MIND_HOLDER_EDGE_STYLE: NodeStyle = {
    ...MIND_EDGE_STYLE,
    borderWidth : LINE_WIDTH + 1,
    borderColor : HOLDER_COLOR,
};
