import {
    MindMarkTypes,
    MindMarks,
    XmindMarkerMethods,
}                                               from '../interface';

export const APPENDS_LIST = {
    link : {
        index : 0,
        state : 'link-hover',
    },
    note : {
        index : 2,
        state : 'note-hover',
    },
};

export const TAG = {
    state : 'tag-hover',
};

export const XMIND_MARKER_MAP: {
    [type in MindMarkTypes]?: {
        [value in MindMarks]?: {
            method: XmindMarkerMethods;
            name: string;
        }
    }
} = {
    tag : {
        red : {
            method : XmindMarkerMethods.Tag,
            name : 'red',
        },
        yellow : {
            method : XmindMarkerMethods.Tag,
            name : 'orange',
        },
        blue : {
            method : XmindMarkerMethods.Tag,
            name : 'dark-blue',
        },
        purple : {
            method : XmindMarkerMethods.Tag,
            name : 'dark-purple',
        },
        green : {
            method : XmindMarkerMethods.Tag,
            name : 'green',
        },
        cyan : {
            method : XmindMarkerMethods.Tag,
            name : 'blue',
        },
        gray : {
            method : XmindMarkerMethods.Tag,
            name : 'grey',
        },
    },
    priority : {
        p1 : {
            method : XmindMarkerMethods.Priority,
            name : '1',
        },
        p2 : {
            method : XmindMarkerMethods.Priority,
            name : '2',
        },
        p3 : {
            method : XmindMarkerMethods.Priority,
            name : '3',
        },
        p4 : {
            method : XmindMarkerMethods.Priority,
            name : '4',
        },
        p5 : {
            method : XmindMarkerMethods.Priority,
            name : '5',
        },
        p6 : {
            method : XmindMarkerMethods.Priority,
            name : '6',
        },
        p7 : {
            method : XmindMarkerMethods.Priority,
            name : '7',
        },
    },
    task : {
        task0 : {
            method : XmindMarkerMethods.Task,
            name : 'start',
        },
        task18 : {
            method : XmindMarkerMethods.Task,
            name : 'oct',
        },
        task14 : {
            method : XmindMarkerMethods.Task,
            name : 'quarter',
        },
        task38 : {
            method : XmindMarkerMethods.Task,
            name : '3oct',
        },
        task12 : {
            method : XmindMarkerMethods.Task,
            name : 'half',
        },
        task58 : {
            method : XmindMarkerMethods.Task,
            name : '5oct',
        },
        task34 : {
            method : XmindMarkerMethods.Task,
            name : '3quar',
        },
        task78 : {
            method : XmindMarkerMethods.Task,
            name : '7oct',
        },
        task1 : {
            method : XmindMarkerMethods.Task,
            name : 'done',
        },
    },
    flag : {
        flagRed : {
            method : XmindMarkerMethods.Flag,
            name : 'red',
        },
        flagYellow : {
            method : XmindMarkerMethods.Flag,
            name : 'orange',
        },
        flagBlue : {
            method : XmindMarkerMethods.Flag,
            name : 'dark-blue',
        },
        flagPurple : {
            method : XmindMarkerMethods.Flag,
            name : 'purple',
        },
        flagGreen : {
            method : XmindMarkerMethods.Flag,
            name : 'green',
        },
        flagCyan : {
            method : XmindMarkerMethods.Flag,
            name : 'blue',
        },
        flagGray : {
            method : XmindMarkerMethods.Flag,
            name : 'gray',
        },
    },
    star : {
        starRed : {
            method : XmindMarkerMethods.Star,
            name : 'red',
        },
        starYellow : {
            method : XmindMarkerMethods.Star,
            name : 'orange',
        },
        starBlue : {
            method : XmindMarkerMethods.Star,
            name : 'dark-blue',
        },
        starPurple : {
            method : XmindMarkerMethods.Star,
            name : 'purple',
        },
        starGreen : {
            method : XmindMarkerMethods.Star,
            name : 'green',
        },
        starCyan : {
            method : XmindMarkerMethods.Star,
            name : 'blue',
        },
        starGray : {
            method : XmindMarkerMethods.Star,
            name : 'gray',
        },
    },
    person : {
        personRed : {
            method : XmindMarkerMethods.Person,
            name : 'red',
        },
        personYellow : {
            method : XmindMarkerMethods.Person,
            name : 'orange',
        },
        personBlue : {
            method : XmindMarkerMethods.Person,
            name : 'dark-blue',
        },
        personPurple : {
            method : XmindMarkerMethods.Person,
            name : 'purple',
        },
        personGreen : {
            method : XmindMarkerMethods.Person,
            name : 'green',
        },
        personCyan : {
            method : XmindMarkerMethods.Person,
            name : 'blue',
        },
        personGray : {
            method : XmindMarkerMethods.Person,
            name : 'gray',
        },
    },
};