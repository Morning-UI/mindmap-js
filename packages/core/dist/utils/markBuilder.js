import { MARKS_STYLE, } from '../style';
export var markBuilder = {
    tag: function () {
        return {
            text: {
                cursor: 'pointer',
            },
        };
    },
    priority: function (options, markKey) {
        return {
            text: {
                attrs: {
                    fontSize: MARKS_STYLE[markKey].fontSize,
                    fill: MARKS_STYLE[markKey].fontColor,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontWeight: MARKS_STYLE[markKey].fontWeight,
                    text: options.markName.replace('p', ''),
                    cursor: 'pointer',
                },
            },
        };
    },
    task: function (options, markKey) {
        return {
            text: {
                attrs: {
                    x: 2,
                    fontSize: MARKS_STYLE[markKey].fontSize,
                    fill: MARKS_STYLE[markKey].fontColor,
                    fontFamily: MARKS_STYLE[markKey].fontFamily,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: String.fromCharCode(parseInt(MARKS_STYLE[markKey].text, 16)),
                    textOffsetY: MARKS_STYLE[markKey].textOffsetY,
                    cursor: 'pointer',
                },
            },
        };
    },
    star: function (options, markKey) {
        return {
            text: {
                attrs: {
                    x: 2,
                    fontSize: MARKS_STYLE[markKey].fontSize,
                    fill: MARKS_STYLE[markKey].fontColor,
                    fontFamily: MARKS_STYLE[markKey].fontFamily,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: String.fromCharCode(parseInt(MARKS_STYLE[markKey].text, 16)),
                    textOffsetY: MARKS_STYLE[markKey].textOffsetY,
                    cursor: 'pointer',
                },
            },
        };
    },
    flag: function (options, markKey) { return markBuilder.star(options, markKey); },
    person: function (options, markKey) { return markBuilder.star(options, markKey); },
};
export var markElementBuilder = {
    tag: function (marks) {
        var $elements = [];
        for (var _i = 0, _a = Object.values(marks); _i < _a.length; _i++) {
            var mark = _a[_i];
            var $li = document.createElement('li');
            var $icon = document.createElement('div');
            $li.classList.add('mark');
            $li.setAttribute('mark-value', mark);
            $icon.classList.add("icon-tag-" + mark, 'icon', 'icon-tag');
            $icon.setAttribute('mark-value', mark);
            $li.append($icon);
            $elements.push($li);
        }
        return $elements;
    },
    priority: function (marks) {
        var $elements = [];
        for (var _i = 0, _a = Object.values(marks); _i < _a.length; _i++) {
            var mark = _a[_i];
            var $li = document.createElement('li');
            var $icon = document.createElement('div');
            $li.classList.add('mark');
            $li.setAttribute('mark-value', mark);
            $icon.classList.add("icon-priority-" + mark, 'icon', 'icon-priority');
            $icon.setAttribute('mark-value', mark);
            $icon.innerText = mark.replace('p', '');
            $li.append($icon);
            $elements.push($li);
        }
        return $elements;
    },
    task: function (marks) {
        var $elements = [];
        for (var _i = 0, _a = Object.values(marks); _i < _a.length; _i++) {
            var mark = _a[_i];
            var $li = document.createElement('li');
            var $icon = document.createElement('div');
            var $iconfont = document.createElement('i');
            var markKey = "task:" + mark;
            $li.classList.add('mark');
            $icon.classList.add("icon-task-" + mark, 'icon', 'icon-task');
            $iconfont.innerHTML = "&#x" + MARKS_STYLE[markKey].text;
            $li.setAttribute('mark-value', mark);
            $icon.setAttribute('mark-value', mark);
            $iconfont.setAttribute('mark-value', mark);
            $icon.append($iconfont);
            $li.append($icon);
            $elements.push($li);
        }
        return $elements;
    },
};
