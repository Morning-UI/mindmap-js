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
import { XMIND_MARKER_MAP, } from '../base/const';
export var dataItemGetter = {
    text: function (model) { return model.text; },
    link: function (model) { return model.link; },
    mark: function (model) { return model.mark; },
    note: function (model) { return model.note; },
    tag: function (model) { return model.tag; },
    children: function (model, callback, getter, mindmap) {
        if (model.children) {
            return callback(model.children, getter, mindmap);
        }
        return undefined;
    },
    folded: function (model) { return model.folded; },
};
export var nodeItemGetter = __assign(__assign({}, dataItemGetter), { id: function (model) { return model.id; }, type: function (model) { return model.type; }, anchorPoints: function (model) { return model.anchorPoints; }, children: function (model, callback, getter, mindmap) {
        if (model.children) {
            return callback(model.children, getter, mindmap);
        }
        return undefined;
    }, style: function (model) { return model.style; } });
export var xmindItemGetter = {
    title: function (model) { return model.text; },
    note: function (model) { return model.note; },
    href: function (model) { return model.link; },
    labels: function (model) { return model.tag; },
    branch: function (model) { return (model.folded ? 'folded' : undefined); },
    marker: function (model) {
        var markTypes = Object.keys(model.mark || {});
        if (markTypes.length === 0) {
            return {};
        }
        var marker = {};
        for (var _i = 0, markTypes_1 = markTypes; _i < markTypes_1.length; _i++) {
            var mark = markTypes_1[_i];
            var item = XMIND_MARKER_MAP[mark][model.mark[mark]];
            marker[item.method] = item.name;
        }
        return marker;
    },
    children: function (model, callback, getter, mindmap) {
        var children = model.folded ? model._foldedChildren : model.children;
        if (children) {
            return callback(children, getter, mindmap);
        }
        return undefined;
    },
};
export var pluckDataFromModels = function (models, getter, mindmap) {
    var targetData = [];
    var _models = models;
    if (!Array.isArray(_models)) {
        _models = [_models];
    }
    for (var _i = 0, _models_1 = _models; _i < _models_1.length; _i++) {
        var model = _models_1[_i];
        var targetItem = {};
        for (var key in getter) {
            var getterFn = getter[key];
            var val = getterFn(model, pluckDataFromModels, getter, mindmap);
            targetItem[key] = val;
        }
        targetData.push(targetItem);
    }
    return targetData;
};
