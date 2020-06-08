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
import { LINE_WIDTH, HOLDER_COLOR, } from './base';
import { MIND_EDGE_STYLE, } from './edgeStyle';
export var MIND_HOLDER_EDGE_STYLE = __assign(__assign({}, MIND_EDGE_STYLE), { borderWidth: LINE_WIDTH + 1, borderColor: HOLDER_COLOR });
