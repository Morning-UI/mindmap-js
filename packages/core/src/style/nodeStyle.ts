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
    FOLD_BTN_STYLE,
}                                               from './base';

export const MIND_NODE_STYLE: NodeStyle = {
    bgColor : 'rgba(219, 226, 227, 1)',
    fontColor : 'rgba(0, 0, 0, 1)',
    fontSize : FONT_SIZE,
    fontWeight : 400,
    fontStyle : 'normal',
    borderWidth : 1,
    borderColor : LINE_COLOR,
    outlineColor : OUTLINE_COLOR,
    outlineColorActive : OUTLINE_COLOR_ACTIVE,
    outlineRadius : ITEM_RADIUS * 2,
    outlinePadding : 4,
    radius : ITEM_RADIUS,
    paddingX : FONT_SIZE * 1.5,
    paddingY : FONT_SIZE * 0.75,
    // 每一项附加内容的内边距
    appendsPaddingX : 8,
    appendsPaddingY : 4,
    // 每一项附加内容的左边距(附加内容之间的间距)
    appendsMarginLeft : 0,
    tagBgColor : 'rgba(0,0,0,0)',
    tagFontColor : 'rgba(67, 75, 83, 1)',
    tagFontSize : FONT_SIZE,
    tagBorderWidth : 1,
    tagBorderColor : 'rgba(229, 229, 229, 1)',
    tagBorderColorHover : 'rgba(178, 178, 178, 1)',
    tagBorderRadius : ITEM_RADIUS,
    tagPaddingX : 8,
    tagPaddingY : 4,
    tagMarginLeft : 6,
    tagMarginTop : 6,
    markConPadding : 2,
    // 每一个mark之间的间隔
    markConMarginRight : 0,
    // 整个mark内容和右侧文本的距离
    markConGroupMarginRight : 6,
    markConBgColor : 'transparent',
    markConBgColorHover : 'rgba(38, 190, 252, 0.3)',
    markConBorderColor : 'transparent',
    markConBorderColorHover : OUTLINE_COLOR_ACTIVE,
    markConRadius : ITEM_RADIUS,
    markMarginRight : 2,
    markIconBorder : 1,
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
    FOLD_BTN_STYLE,
};
