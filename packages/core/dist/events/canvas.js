export default {
    focus: function (evt, options) {
        if (options.mindmap.focus === false) {
            options.mindmap.focus = true;
        }
    },
    blur: function (evt, options) {
        if (options.mindmap.focus === true) {
            options.mindmap.focus = false;
        }
    },
};
