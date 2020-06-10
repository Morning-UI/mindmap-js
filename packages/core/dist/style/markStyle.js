var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var RED = 'rgb(248, 72, 66)';
var YELLOW = 'rgb(255, 179, 50)';
var BLUE = 'rgb(19, 128, 243)';
var PURPLE = 'rgb(171, 99, 209)';
var GREEN = 'rgb(86, 206, 96)';
var CYAN = 'rgb(0, 177, 229)';
var GRAY = 'rgb(157, 157, 160)';
var tagCommonStyle = {
    borderWidth: 3,
    radius: 8,
};
var priorityCommonStyle = {
    borderWidth: 3,
    radius: 8,
    fontSize: 14,
    fontColor: 'rgb(255, 255, 255)',
    fontWeight: 700,
    bgColor: GRAY,
    borderColor: GRAY,
};
var taskCommonStyle = {
    bgColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(255, 255, 255)',
    borderWidth: 3,
    radius: 8,
    fontFamily: 'mindmap-icon',
    fontColor: 'rgb(86, 206, 96)',
    fontSize: 18,
    textOffsetY: 0,
};
var starCommonStyle = {
    bgColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(255, 255, 255)',
    borderWidth: 3,
    radius: 8,
    fontFamily: 'mindmap-icon',
    fontSize: 21,
    textOffsetY: 0,
    text: 'e6ca;',
};
var flagCommonStyle = {
    bgColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(255, 255, 255)',
    borderWidth: 3,
    radius: 8,
    fontFamily: 'mindmap-icon',
    fontSize: 21,
    textOffsetY: 0,
    text: 'e825;',
};
var personCommonStyle = {
    bgColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(255, 255, 255)',
    borderWidth: 3,
    radius: 8,
    fontFamily: 'mindmap-icon',
    fontSize: 18,
    textOffsetY: 0,
    text: 'e604;',
};
export var MARKS_STYLE = {
    'tag:red': __assign(__assign({}, tagCommonStyle), { bgColor: RED, borderColor: 'rgb(223, 65, 60)' }),
    'tag:yellow': __assign(__assign({}, tagCommonStyle), { bgColor: YELLOW, borderColor: 'rgb(230, 161, 44)' }),
    'tag:blue': __assign(__assign({}, tagCommonStyle), { bgColor: BLUE, borderColor: 'rgb(19, 114, 219)' }),
    'tag:purple': __assign(__assign({}, tagCommonStyle), { bgColor: PURPLE, borderColor: 'rgb(153, 89, 187)' }),
    'tag:green': __assign(__assign({}, tagCommonStyle), { bgColor: GREEN, borderColor: 'rgb(77, 185, 86)' }),
    'tag:cyan': __assign(__assign({}, tagCommonStyle), { bgColor: CYAN, borderColor: 'rgb(0, 159, 205)' }),
    'tag:gray': __assign(__assign({}, tagCommonStyle), { bgColor: GRAY, borderColor: 'rgb(141, 141, 144)' }),
    'priority:p1': __assign(__assign({}, priorityCommonStyle), { bgColor: RED, borderColor: RED }),
    'priority:p2': __assign(__assign({}, priorityCommonStyle), { bgColor: YELLOW, borderColor: YELLOW }),
    'priority:p3': __assign(__assign({}, priorityCommonStyle), { bgColor: BLUE, borderColor: BLUE }),
    'priority:p4': __assign({}, priorityCommonStyle),
    'priority:p5': __assign({}, priorityCommonStyle),
    'priority:p6': __assign({}, priorityCommonStyle),
    'priority:p7': __assign({}, priorityCommonStyle),
    'task:task0': __assign(__assign({}, taskCommonStyle), { text: 'e649;', textOffsetY: 1.5 }),
    'task:task18': __assign(__assign({}, taskCommonStyle), { text: 'e677;' }),
    'task:task14': __assign(__assign({}, taskCommonStyle), { text: 'e676;' }),
    'task:task38': __assign(__assign({}, taskCommonStyle), { text: 'e67a;' }),
    'task:task12': __assign(__assign({}, taskCommonStyle), { text: 'e67d;' }),
    'task:task58': __assign(__assign({}, taskCommonStyle), { text: 'e67e;' }),
    'task:task34': __assign(__assign({}, taskCommonStyle), { text: 'e679;' }),
    'task:task78': __assign(__assign({}, taskCommonStyle), { text: 'e67f;' }),
    'task:task1': __assign(__assign({}, taskCommonStyle), { text: 'e621;' }),
    'star:starRed': __assign(__assign({}, starCommonStyle), { fontColor: RED }),
    'star:starYellow': __assign(__assign({}, starCommonStyle), { fontColor: YELLOW }),
    'star:starBlue': __assign(__assign({}, starCommonStyle), { fontColor: BLUE }),
    'star:starPurple': __assign(__assign({}, starCommonStyle), { fontColor: PURPLE }),
    'star:starGreen': __assign(__assign({}, starCommonStyle), { fontColor: GREEN }),
    'star:starCyan': __assign(__assign({}, starCommonStyle), { fontColor: CYAN }),
    'star:flagGray': __assign(__assign({}, starCommonStyle), { fontColor: GRAY }),
    'flag:flagRed': __assign(__assign({}, flagCommonStyle), { fontColor: RED }),
    'flag:flagYellow': __assign(__assign({}, flagCommonStyle), { fontColor: YELLOW }),
    'flag:flagBlue': __assign(__assign({}, flagCommonStyle), { fontColor: BLUE }),
    'flag:flagPurple': __assign(__assign({}, flagCommonStyle), { fontColor: PURPLE }),
    'flag:flagGreen': __assign(__assign({}, flagCommonStyle), { fontColor: GREEN }),
    'flag:flagCyan': __assign(__assign({}, flagCommonStyle), { fontColor: CYAN }),
    'flag:flagGray': __assign(__assign({}, flagCommonStyle), { fontColor: GRAY }),
    'person:personRed': __assign(__assign({}, personCommonStyle), { fontColor: RED }),
    'person:personYellow': __assign(__assign({}, personCommonStyle), { fontColor: YELLOW }),
    'person:personBlue': __assign(__assign({}, personCommonStyle), { fontColor: BLUE }),
    'person:personPurple': __assign(__assign({}, personCommonStyle), { fontColor: PURPLE }),
    'person:personGreen': __assign(__assign({}, personCommonStyle), { fontColor: GREEN }),
    'person:personCyan': __assign(__assign({}, personCommonStyle), { fontColor: CYAN }),
    'person:personGray': __assign(__assign({}, personCommonStyle), { fontColor: GRAY }),
};
