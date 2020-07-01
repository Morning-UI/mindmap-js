var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ZoomFeatures, } from '../interface';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (function (Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.zoom = function (zoom) {
            this.commander.addExec({
                cmd: ZoomFeatures.Commands.Zoom,
                opts: {
                    zoom: zoom,
                },
            });
            return this;
        };
        class_1.prototype.getZoom = function () {
            return this.graph.getZoom();
        };
        class_1.prototype.fitZoom = function () {
            this.commander.addExec({
                cmd: ZoomFeatures.Commands.FitZoom,
            });
            return this;
        };
        class_1.prototype.fitCenter = function () {
            this.commander.addExec({
                cmd: ZoomFeatures.Commands.FitCenter,
            });
            return this;
        };
        class_1.prototype.moveCanvas = function (x, y) {
            this.commander.addExec({
                cmd: ZoomFeatures.Commands.MoveCanvas,
                opts: {
                    x: x,
                    y: y,
                },
            });
            return this;
        };
        class_1.prototype.getCanvasPos = function () {
            var canvasBBox = this.graph.get('group').getCanvasBBox();
            return {
                x: canvasBBox.x,
                y: canvasBBox.y,
            };
        };
        class_1.prototype._updateZoomValue = function () {
            var _this = this;
            setTimeout(function () {
                var $zoomSlider = _this._options.$zoomSlider;
                var $value = $zoomSlider.querySelector('.zoom-value');
                var $track = $zoomSlider.querySelector('.zoom-track');
                var $slider = $zoomSlider.querySelector('.zoom-slider');
                var $line = $zoomSlider.querySelector('.zoom-line');
                var totalWidth = $track.clientWidth;
                var value = _this.getZoom();
                var zoomRange = _this._options.maxZoom - _this._options.minZoom;
                var zoomPercentage = (value - _this._options.minZoom) / zoomRange;
                var currentWidth = zoomPercentage * totalWidth;
                $line.style.width = currentWidth + "px";
                $slider.style.left = currentWidth - ($slider.clientWidth / 2) + "px";
                $value.innerHTML = Math.floor(value * 100) + "%";
                _this.zoomValue = value;
            });
            return this;
        };
        return class_1;
    }(Base));
});
