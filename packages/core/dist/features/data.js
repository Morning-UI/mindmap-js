import { DataFeatures, } from '../interface';
import { traverseData, } from '../utils/traverseData';
export var readData = function (options) {
    var mindmap = options.mindmap, data = options.data;
    var originData = mindmap.data ? mindmap.getRootData() : null;
    console.log(originData);
    mindmap.data = traverseData(data);
    mindmap.graph.read(mindmap.data);
    setTimeout(function () {
        mindmap.graph.layout(true);
        mindmap._updateZoomValue();
    });
    return {
        note: '读取数据',
        undoCmd: {
            cmd: DataFeatures.Commands.ReadData,
            opts: {
                data: originData,
            },
        },
    };
};
