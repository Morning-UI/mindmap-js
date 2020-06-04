export var getNodeDragBehavior = function (mindmap) { return ({
    getDefaultCfg: function () {
        return {
            targets: [],
        };
    },
    getEvents: function () {
        return {
            'node:dragstart': 'onDragStart',
            'node:drag': 'onDrag',
            'node:dragend': 'onDragEnd',
        };
    },
    onDragStart: function (evt) {
        if (!evt.item) {
            return;
        }
        var model = evt.item.getModel();
        // root节点不能被拖拽
        if (model._isRoot) {
            return;
        }
        this.dragOptions = {
            originX: evt.x,
            originY: evt.y,
            delegateShape: null,
        };
        // 获取所有选中的元素
        var nodes = mindmap.graph.findAllByState('node', 'selected');
        var targetNodeId = evt.item.get('id');
        // TODO
        // 当前拖动的节点是否是选中的节点
        var dragNodes = nodes.filter(function (node) { return (targetNodeId === node.get('id')); });
        if (dragNodes.length === 0) {
            // 只拖动当前节点
            var currentModel = evt.item.getModel();
            this.targets = [evt.item];
            this.dragOptions.type = 'unselect-single';
            this.point = {
                x: currentModel.x,
                y: currentModel.y,
            };
        }
        // else if (nodes.length === 1) {
        //     // 拖动选中节点
        //     this.targets.push(evt.item);
        //     this.dragOptions.type = 'select';
        // } else {
        //     let models = [];
        //     let getTopSelectedNodeModel = node => {
        //         let model = node.getModel();
        //         let parentNode = this.graph.findById(model.id).getInEdges()[0].getSource();
        //         if (parentNode.getStates().indexOf('selected') !== -1) {
        //             model = getTopSelectedNodeModel(parentNode);
        //         }
        //         return model;
        //     };
        //     // 拖动多个节点
        //     nodes.forEach(node => {
        //         let model = getTopSelectedNodeModel(node);
        //         // 仅计算top节点
        //         if (models.indexOf(model) === -1) {
        //             models.push(model);
        //             this.targets.push(node);
        //         }
        //     });
        //     this.dragOptions.type = 'select';
        // }
    },
}); };
