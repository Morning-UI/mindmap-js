export var __esModule: boolean;
export var shapeBase: {
    options: {};
    itemType: string;
    /**
     * 形状的类型，例如 circle，ellipse，polyline...
     */
    type: string;
    /**
     * 绘制节点/边，包含文本
     * @override
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 节点的容器
     * @return {IShape} 绘制的图形
     */
    draw: (cfg: Object, group: any) => any;
    /**
     * 绘制完成后的操作，便于用户继承现有的节点、边
     * @param cfg
     * @param group
     * @param keyShape
     */
    afterDraw: (cfg: any, group: any, keyShape: any) => void;
    drawShape: (cfg: any, group: any) => any;
    drawLabel: (cfg: any, group: any) => any;
    drawLabelBg: (cfg: any, group: any, label: any) => any;
    getLabelStyleByPosition: (cfg: any, labelCfg: any, group: any) => {
        text: any;
    };
    getLabelBgStyleByPosition: (label: any, cfg: any, labelCfg: any, group: any) => {};
    /**
     * 获取文本的配置项
     * @param cfg 节点的配置项
     * @param labelCfg 文本的配置项
     * @param group 父容器，label 的定位可能与图形相关
     */
    getLabelStyle: (cfg: any, labelCfg: any, group: any) => any;
    /**
     * 获取图形的配置项
     * @param cfg
     */
    getShapeStyle: (cfg: any) => any;
    /**
     * 更新节点，包含文本
     * @override
     * @param  {Object} cfg 节点/边的配置项
     * @param  {G6.Item} item 节点/边
     */
    update: (cfg: Object, item: any) => void;
    updateShapeStyle: (cfg: any, item: any) => void;
    updateLabel: (cfg: any, item: any) => void;
    afterUpdate: (cfg: any, item: any) => void;
    /**
     * 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现
     * 单图形的节点仅考虑 selected、active 状态，有其他状态需求的用户自己复写这个方法
     * @override
     * @param  {String} name 状态名称
     * @param  {String | Boolean} value 状态值
     * @param  {G6.Item} item 节点
     */
    setState: (name: string, value: string | boolean, item: any) => void;
    /**
     * 获取不同状态下的样式
     *
     * @param {string} name 状态名称
     * @param {boolean} value 是否启用该状态
     * @param {Item} item Node或Edge的实例
     * @return {object} 样式
     */
    getStateStyle: (name: string, value: boolean, item: any) => object;
    /**
     * 获取控制点
     * @param  {Object} cfg 节点、边的配置项
     * @return {Array|null} 控制点的数组,如果为 null，则没有控制点
     */
    getControlPoints: (cfg: Object) => Array | null;
    /**
     * 获取控制点
     * @param  {Object} cfg 节点、边的配置项
     * @return {Array|null} 锚点的数组,如果为 null，则没有锚点
     */
    getAnchorPoints: (cfg: Object) => Array | null;
};
export var CLS_LABEL_BG_SUFFIX: string;
