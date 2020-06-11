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
    _isFolded: function (model) { return model._isFolded; },
    _foldedChildren: function (model, callback, getter, mindmap) {
        if (model._foldedChildren) {
            return callback(model._foldedChildren, getter, mindmap);
        }
        return undefined;
    },
};
export var nodeItemGetter = __assign(__assign({}, dataItemGetter), { id: function (model) { return model.id; }, anchorPoints: function (model) { return model.anchorPoints; }, style: function (model) { return model.style; }, type: function (model) { return model.type; }, children: function (model, callback, getter, mindmap) {
        if (model.children) {
            return callback(model.children, getter, mindmap);
        }
        return undefined;
    }, _foldedChildren: function (model, callback, getter, mindmap) {
        if (model._foldedChildren) {
            return callback(model._foldedChildren, getter, mindmap);
        }
        return undefined;
    }, _isRoot: function (model) { return model._isRoot; }, _isNode: function (model) { return model._isNode; } });
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
