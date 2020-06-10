import {
    GenMarkOptions,
    MarkBuilder,
    MarkElementBuilder,
    MarkShapeCfg,
    MindMarks,
}                                               from '../interface';
import {
    MARKS_STYLE,
}                                               from '../style';

export const markBuilder: MarkBuilder = {
    tag : (): MarkShapeCfg => {

        return {
            text : {
                cursor : 'pointer',
            },
        };

    },
    priority : (options: GenMarkOptions, markKey: string): MarkShapeCfg => {

        return {
            text : {
                attrs : {
                    fontSize : MARKS_STYLE[markKey].fontSize,
                    fill : MARKS_STYLE[markKey].fontColor,
                    textAlign : 'center',
                    textBaseline : 'middle',
                    fontWeight : MARKS_STYLE[markKey].fontWeight,
                    text : options.markName.replace('p', ''),
                    cursor : 'pointer',
                },
            },
        };

    },
    task : (options: GenMarkOptions, markKey: string): MarkShapeCfg => {

        return {
            text : {
                attrs : {
                    x : 2,
                    fontSize : MARKS_STYLE[markKey].fontSize,
                    fill : MARKS_STYLE[markKey].fontColor,
                    fontFamily : MARKS_STYLE[markKey].fontFamily,
                    textAlign : 'center',
                    textBaseline : 'middle',
                    text : String.fromCharCode(parseInt(MARKS_STYLE[markKey].text, 16)),
                    textOffsetY : MARKS_STYLE[markKey].textOffsetY,
                    cursor : 'pointer',
                },
            },
        };

    },
    star : (options: GenMarkOptions, markKey: string): MarkShapeCfg => {

        return {
            text : {
                attrs : {
                    x : 2,
                    fontSize : MARKS_STYLE[markKey].fontSize,
                    fill : MARKS_STYLE[markKey].fontColor,
                    fontFamily : MARKS_STYLE[markKey].fontFamily,
                    textAlign : 'center',
                    textBaseline : 'middle',
                    text : String.fromCharCode(parseInt(MARKS_STYLE[markKey].text, 16)),
                    textOffsetY : MARKS_STYLE[markKey].textOffsetY,
                    cursor : 'pointer',
                },
            },
        };

    },
    flag : (options: GenMarkOptions, markKey: string): MarkShapeCfg => markBuilder.star(options, markKey),
    person : (options: GenMarkOptions, markKey: string): MarkShapeCfg => markBuilder.star(options, markKey),
};

export const markElementBuilder: MarkElementBuilder = {
    tag : (marks) => {

        const $elements = [];

        for (const mark of Object.values(marks)) {

            const $li = document.createElement('li');
            const $icon = document.createElement('div');

            $li.classList.add('mark');
            $li.setAttribute('mark-value', mark);
            $icon.classList.add(`icon-tag-${mark}`, 'icon', 'icon-tag');
            $icon.setAttribute('mark-value', mark);
            $li.append($icon);
            $elements.push($li);

        }

        return $elements;

    },
    priority : (marks) => {

        const $elements = [];

        for (const mark of Object.values(marks)) {

            const $li = document.createElement('li');
            const $icon = document.createElement('div');

            $li.classList.add('mark');
            $li.setAttribute('mark-value', mark);
            $icon.classList.add(`icon-priority-${mark}`, 'icon', 'icon-priority');
            $icon.setAttribute('mark-value', mark);
            $icon.innerText = mark.replace('p', '');
            $li.append($icon);
            $elements.push($li);

        }

        return $elements;

    },
    task : (marks) => {

        const $elements = [];

        for (const mark of Object.values(marks)) {

            const $li = document.createElement('li');
            const $icon = document.createElement('div');
            const $iconfont = document.createElement('i');
            const markKey = `task:${mark}`;

            $li.classList.add('mark');
            $icon.classList.add(`icon-task-${mark}`, 'icon', 'icon-task');
            $iconfont.innerHTML = `&#x${MARKS_STYLE[markKey].text}`;
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
