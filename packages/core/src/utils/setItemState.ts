import * as G6                                  from '@antv/g6';

export const setItemState = (graph: G6.TreeGraph, itemId: string, state: string, value: boolean): void => {

    // cause setItemState not work in g6@3.5.3
    // use setState for now
    // issue : https://github.com/antvis/G6/issues/1661
    graph.findById(itemId).setState(state, value);

};
