import {
    NodeStyle,
}                                               from '../interface';
import {
    MIND_NODE_STYLE,
}                                               from './nodeStyle';

export const ROOT_MIND_NODE_STYLE: NodeStyle = {
    // bgColor : '#e8e8e8',
    // fontColor : 'rgba(0, 0, 0, 1)',
    // fontSize : 16,
    // fontWeight : 400,
    // fontStyle : 'normal',
    // borderWidth : 1,
    // borderColor : LINE_COLOR,
    // outlineColor : '#8cdcf5',
    // outlineActiveColor : '#27befc',
    // _shapePresets : {
    //     'round-rect' : {
    //         radius : 6
    //     },
    //     rect : {
    //         radius : 0
    //     },
    //     line : {
    //         bgColor : 'transparent',
    //         borderColor : 'transparent',
    //         borderWidth : 0,
    //         bottomlineBg : LINE_COLOR,
    //         bottomlineHeight : 2
    //     }
    // }
    ...MIND_NODE_STYLE,
};
