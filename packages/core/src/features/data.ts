import {
    GraphData,
}                                               from '@antv/g6/lib/types';
import {
    DataFeatures,
    Command,
}                                               from '../interface';
import {
    traverseData,
}                                               from '../utils/traverseData';

export const readData: DataFeatures.ReadData = (options) => {

    const {
        mindmap,
        data,
    } = options;
    const originData = mindmap.data ? mindmap.getRootData() : null;

    console.log(originData);

    mindmap.data = traverseData(data);
    mindmap.graph.read(mindmap.data as GraphData);

    setTimeout(() => {

        mindmap.graph.layout(true);
        mindmap._updateZoomValue();

    });

    return {
        note : '读取数据',
        undoCmd : {
            cmd : DataFeatures.Commands.ReadData,
            opts : {
                data : originData,
            },
        } as Command<DataFeatures.Commands.ReadData>,
    };

};
