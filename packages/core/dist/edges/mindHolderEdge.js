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
import { MIND_HOLDER_EDGE_STYLE, } from '../style';
export var getMindHolderEdge = function () { return ({
    getStyles: function () {
        return __assign({}, MIND_HOLDER_EDGE_STYLE);
    },
}); };
