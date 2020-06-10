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
export var EventNames;
(function (EventNames) {
    EventNames[EventNames["EditContentChange"] = 0] = "EditContentChange";
    EventNames[EventNames["ZoomChange"] = 1] = "ZoomChange";
})(EventNames || (EventNames = {}));
export var ContextMenuTypes;
(function (ContextMenuTypes) {
    ContextMenuTypes[ContextMenuTypes["Link"] = 0] = "Link";
    ContextMenuTypes[ContextMenuTypes["Note"] = 1] = "Note";
    ContextMenuTypes[ContextMenuTypes["Tag"] = 2] = "Tag";
})(ContextMenuTypes || (ContextMenuTypes = {}));
export var MindMarksTag;
(function (MindMarksTag) {
    MindMarksTag["Red"] = "red";
    MindMarksTag["Yellow"] = "yellow";
    MindMarksTag["Blue"] = "blue";
    MindMarksTag["Purple"] = "purple";
    MindMarksTag["Green"] = "green";
    MindMarksTag["Cyan"] = "cyan";
    MindMarksTag["Gray"] = "gray";
})(MindMarksTag || (MindMarksTag = {}));
export var MindMarksPriority;
(function (MindMarksPriority) {
    MindMarksPriority["P1"] = "p1";
    MindMarksPriority["P2"] = "p2";
    MindMarksPriority["P3"] = "p3";
    MindMarksPriority["P4"] = "p4";
    MindMarksPriority["P5"] = "p5";
    MindMarksPriority["P6"] = "p6";
    MindMarksPriority["P7"] = "p7";
})(MindMarksPriority || (MindMarksPriority = {}));
export var MindMarksTask;
(function (MindMarksTask) {
    MindMarksTask["Task0"] = "task0";
    MindMarksTask["Task18"] = "task18";
    MindMarksTask["Task14"] = "task14";
    MindMarksTask["Task38"] = "task38";
    MindMarksTask["Task12"] = "task12";
    MindMarksTask["Task58"] = "task58";
    MindMarksTask["Task34"] = "task34";
    MindMarksTask["Task78"] = "task78";
    MindMarksTask["Task1"] = "task1";
})(MindMarksTask || (MindMarksTask = {}));
export var MindMarksStar;
(function (MindMarksStar) {
    MindMarksStar["StarRed"] = "starRed";
    MindMarksStar["StarYellow"] = "starYellow";
    MindMarksStar["StarBlue"] = "starBlue";
    MindMarksStar["StarPurple"] = "starPurple";
    MindMarksStar["StarGreen"] = "starGreen";
    MindMarksStar["StarCyan"] = "starCyan";
    MindMarksStar["StarGray"] = "starGray";
})(MindMarksStar || (MindMarksStar = {}));
export var MindMarksFlag;
(function (MindMarksFlag) {
    MindMarksFlag["FlagRed"] = "flagRed";
    MindMarksFlag["FlagYellow"] = "flagYellow";
    MindMarksFlag["FlagBlue"] = "flagBlue";
    MindMarksFlag["FlagPurple"] = "flagPurple";
    MindMarksFlag["FlagGreen"] = "flagGreen";
    MindMarksFlag["FlagCyan"] = "flagCyan";
    MindMarksFlag["FlagGray"] = "flagGray";
})(MindMarksFlag || (MindMarksFlag = {}));
export var MindMarksPerson;
(function (MindMarksPerson) {
    MindMarksPerson["PersonRed"] = "personRed";
    MindMarksPerson["PersonYellow"] = "personYellow";
    MindMarksPerson["PersonBlue"] = "personBlue";
    MindMarksPerson["PersonPurple"] = "personPurple";
    MindMarksPerson["PersonGreen"] = "personGreen";
    MindMarksPerson["PersonCyan"] = "personCyan";
    MindMarksPerson["PersonGray"] = "personGray";
})(MindMarksPerson || (MindMarksPerson = {}));
export var MindMarks = __assign(__assign(__assign(__assign(__assign(__assign({}, MindMarksTag), MindMarksPriority), MindMarksTask), MindMarksStar), MindMarksFlag), MindMarksPerson);
export var MindMarkTypes;
(function (MindMarkTypes) {
    MindMarkTypes["Tag"] = "tag";
    MindMarkTypes["Priority"] = "priority";
    MindMarkTypes["Task"] = "task";
    MindMarkTypes["Star"] = "star";
    MindMarkTypes["Flag"] = "flag";
    MindMarkTypes["Person"] = "person";
})(MindMarkTypes || (MindMarkTypes = {}));
;
