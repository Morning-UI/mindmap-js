import {
    NodeStyle,
}                                               from '../interface';

const RED = 'rgb(248, 72, 66)';
const YELLOW = 'rgb(255, 179, 50)';
const BLUE = 'rgb(19, 128, 243)';
const PURPLE = 'rgb(171, 99, 209)';
const GREEN = 'rgb(86, 206, 96)';
const CYAN = 'rgb(0, 177, 229)';
const GRAY = 'rgb(157, 157, 160)';

const tagCommonStyle: NodeStyle = {
    borderWidth : 3,
    radius : 8,
};

const priorityCommonStyle: NodeStyle = {
    borderWidth : 3,
    radius : 8,
    fontSize : 14,
    fontColor : 'rgb(255, 255, 255)',
    fontWeight : 700,
    bgColor : GRAY,
    borderColor : GRAY,
};

const taskCommonStyle: NodeStyle = {
    bgColor : 'rgba(255, 255, 255)',
    borderColor : 'rgba(255, 255, 255)',
    borderWidth : 3,
    radius : 8,
    fontFamily : 'mindmap-icon',
    fontColor : 'rgb(86, 206, 96)',
    fontSize : 18,
    textOffsetY : 0,
};

const starCommonStyle: NodeStyle = {
    bgColor : 'rgba(255, 255, 255)',
    borderColor : 'rgba(255, 255, 255)',
    borderWidth : 3,
    radius : 8,
    fontFamily : 'mindmap-icon',
    fontSize : 21,
    textOffsetY : 0,
    text : 'e6ca;',
};

const flagCommonStyle: NodeStyle = {
    bgColor : 'rgba(255, 255, 255)',
    borderColor : 'rgba(255, 255, 255)',
    borderWidth : 3,
    radius : 8,
    fontFamily : 'mindmap-icon',
    fontSize : 21,
    textOffsetY : 0,
    text : 'e825;',
};

const personCommonStyle: NodeStyle = {
    bgColor : 'rgba(255, 255, 255)',
    borderColor : 'rgba(255, 255, 255)',
    borderWidth : 3,
    radius : 8,
    fontFamily : 'mindmap-icon',
    fontSize : 18,
    textOffsetY : 0,
    text : 'e604;',
};

export const MARKS_STYLE: {
    [key: string]: NodeStyle;
} = {
    'tag:red' : {
        ...tagCommonStyle,
        bgColor : RED,
        borderColor : 'rgb(223, 65, 60)',
    },
    'tag:yellow' : {
        ...tagCommonStyle,
        bgColor : YELLOW,
        borderColor : 'rgb(230, 161, 44)',
    },
    'tag:blue' : {
        ...tagCommonStyle,
        bgColor : BLUE,
        borderColor : 'rgb(19, 114, 219)',
    },
    'tag:purple' : {
        ...tagCommonStyle,
        bgColor : PURPLE,
        borderColor : 'rgb(153, 89, 187)',
    },
    'tag:green' : {
        ...tagCommonStyle,
        bgColor : GREEN,
        borderColor : 'rgb(77, 185, 86)',
    },
    'tag:cyan' : {
        ...tagCommonStyle,
        bgColor : CYAN,
        borderColor : 'rgb(0, 159, 205)',
    },
    'tag:gray' : {
        ...tagCommonStyle,
        bgColor : GRAY,
        borderColor : 'rgb(141, 141, 144)',
    },
    'priority:p1' : {
        ...priorityCommonStyle,
        bgColor : RED,
        borderColor : RED,
    },
    'priority:p2' : {
        ...priorityCommonStyle,
        bgColor : YELLOW,
        borderColor : YELLOW,
    },
    'priority:p3' : {
        ...priorityCommonStyle,
        bgColor : BLUE,
        borderColor : BLUE,
    },
    'priority:p4' : {
        ...priorityCommonStyle,
    },
    'priority:p5' : {
        ...priorityCommonStyle,
    },
    'priority:p6' : {
        ...priorityCommonStyle,
    },
    'priority:p7' : {
        ...priorityCommonStyle,
    },
    'task:task0' : {
        ...taskCommonStyle,
        text : 'e649;',
        textOffsetY : 1.5,
    },
    'task:task18' : {
        ...taskCommonStyle,
        text : 'e677;',
    },
    'task:task14' : {
        ...taskCommonStyle,
        text : 'e676;',
    },
    'task:task38' : {
        ...taskCommonStyle,
        text : 'e67a;',
    },
    'task:task12' : {
        ...taskCommonStyle,
        text : 'e67d;',
    },
    'task:task58' : {
        ...taskCommonStyle,
        text : 'e67e;',
    },
    'task:task34' : {
        ...taskCommonStyle,
        text : 'e679;',
    },
    'task:task78' : {
        ...taskCommonStyle,
        text : 'e67f;',
    },
    'task:task1' : {
        ...taskCommonStyle,
        text : 'e621;',
    },
    'star:starRed' : {
        ...starCommonStyle,
        fontColor : RED,
    },
    'star:starYellow' : {
        ...starCommonStyle,
        fontColor : YELLOW,
    },
    'star:starBlue' : {
        ...starCommonStyle,
        fontColor : BLUE,
    },
    'star:starPurple' : {
        ...starCommonStyle,
        fontColor : PURPLE,
    },
    'star:starGreen' : {
        ...starCommonStyle,
        fontColor : GREEN,
    },
    'star:starCyan' : {
        ...starCommonStyle,
        fontColor : CYAN,
    },
    'star:starGray' : {
        ...starCommonStyle,
        fontColor : GRAY,
    },
    'flag:flagRed' : {
        ...flagCommonStyle,
        fontColor : RED,
    },
    'flag:flagYellow' : {
        ...flagCommonStyle,
        fontColor : YELLOW,
    },
    'flag:flagBlue' : {
        ...flagCommonStyle,
        fontColor : BLUE,
    },
    'flag:flagPurple' : {
        ...flagCommonStyle,
        fontColor : PURPLE,
    },
    'flag:flagGreen' : {
        ...flagCommonStyle,
        fontColor : GREEN,
    },
    'flag:flagCyan' : {
        ...flagCommonStyle,
        fontColor : CYAN,
    },
    'flag:flagGray' : {
        ...flagCommonStyle,
        fontColor : GRAY,
    },
    'person:personRed' : {
        ...personCommonStyle,
        fontColor : RED,
    },
    'person:personYellow' : {
        ...personCommonStyle,
        fontColor : YELLOW,
    },
    'person:personBlue' : {
        ...personCommonStyle,
        fontColor : BLUE,
    },
    'person:personPurple' : {
        ...personCommonStyle,
        fontColor : PURPLE,
    },
    'person:personGreen' : {
        ...personCommonStyle,
        fontColor : GREEN,
    },
    'person:personCyan' : {
        ...personCommonStyle,
        fontColor : CYAN,
    },
    'person:personGray' : {
        ...personCommonStyle,
        fontColor : GRAY,
    },
};