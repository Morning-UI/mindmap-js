import { __extends } from "tslib";
import createDOM from '@antv/dom-util/lib/create-dom';
import modifyCSS from '@antv/dom-util/lib/modify-css';
import Base from '../base';
import { mat3 } from '@antv/matrix-util'; // 网格背景图片
var GRID_PNG = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)';
var Grid = 
/** @class */
function (_super) {
    __extends(Grid, _super);
    function Grid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Grid.prototype.getDefaultCfgs = function () {
        return {
            img: GRID_PNG
        };
    };
    Grid.prototype.init = function () {
        var graph = this.get('graph');
        var minZoom = graph.get('minZoom');
        var graphContainer = graph.get('container');
        var canvas = graph.get('canvas').get('el');
        var width = graph.get('width');
        var height = graph.get('height');
        var img = this.get('img') || GRID_PNG;
        var container = createDOM("<div style=\"position: absolute; left:0;top:0;right:0;bottom:0;overflow: hidden;z-index: -1;\"></div>");
        var gridContainer = createDOM("<div \n        class='g6-grid' \n        style='position:absolute;\n        transform-origin: 0% 0% 0px;\n        background-image: " + img + "\n        '></div>");
        container.appendChild(gridContainer);
        modifyCSS(container, {
            width: width + "px",
            height: height + "px"
        });
        modifyCSS(gridContainer, {
            width: width / minZoom + "px",
            height: height / minZoom + "px",
            left: 0,
            top: 0
        });
        graphContainer.insertBefore(container, canvas);
        this.set('container', container);
        this.set('gridContainer', gridContainer);
    }; // class-methods-use-this
    Grid.prototype.getEvents = function () {
        return {
            viewportchange: 'updateGrid'
        };
    };
    /**
     * viewport change 事件的响应函数
     * @param param
     */
    Grid.prototype.updateGrid = function (param) {
        var gridContainer = this.get('gridContainer');
        var matrix = param.matrix;
        if (!matrix)
            matrix = mat3.create();
        var transform = "matrix(" + matrix[0] + ", " + matrix[1] + ", " + matrix[3] + ", " + matrix[4] + ", 0, 0)";
        modifyCSS(gridContainer, {
            transform: transform
        });
    };
    Grid.prototype.getContainer = function () {
        return this.get('container');
    };
    Grid.prototype.destroy = function () {
        var graph = this.get('graph');
        var graphContainer = graph.get('container');
        var container = this.get('container');
        graphContainer.removeChild(container);
    };
    return Grid;
}(Base);
export default Grid;
