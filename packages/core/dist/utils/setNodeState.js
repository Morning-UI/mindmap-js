export var setItemState = function (graph, itemId, state, value) {
    // cause setItemState not work in g6@3.5.3
    // use setState for now
    // issue : https://github.com/antvis/G6/issues/1661
    graph.findById(itemId).setState(state, value);
};
