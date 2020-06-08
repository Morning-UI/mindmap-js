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
import { HOLDER_COLOR, } from './base';
import { MIND_NODE_STYLE, } from './nodeStyle';
export var MIND_HOLDER_NODE_STYLE = __assign(__assign({}, MIND_NODE_STYLE), { bgColor: HOLDER_COLOR, fontColor: 'rgba(255, 255, 255, 0)', width: 80, height: 28 });
