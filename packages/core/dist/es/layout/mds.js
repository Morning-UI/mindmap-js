/**
 * @fileOverview MDS layout
 * @author shiwu.wyy@antfin.com
 */
import { __extends } from "tslib";
import Numeric from 'numericjs';
import { floydWarshall, getAdjMatrix, scaleMatrix } from '../util/math';
import { BaseLayout } from './layout';
/**
 * mds 布局
 */
var MDSLayout = 
/** @class */
function (_super) {
    __extends(MDSLayout, _super);
    function MDSLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 布局中心 */
        _this.center = [0, 0];
        /** 边长度 */
        _this.linkDistance = 50;
        _this.scaledDistances = null;
        return _this;
    }
    MDSLayout.prototype.getDefaultCfg = function () {
        return {
            center: [0, 0],
            linkDistance: 50
        };
    };
    /**
     * 执行布局
     */
    MDSLayout.prototype.execute = function () {
        var self = this;
        var nodes = self.nodes, _a = self.edges, edges = _a === void 0 ? [] : _a;
        var center = self.center;
        if (!nodes || nodes.length === 0) {
            return;
        }
        if (nodes.length === 1) {
            nodes[0].x = center[0];
            nodes[0].y = center[1];
            return;
        }
        var linkDistance = self.linkDistance; // the graph-theoretic distance (shortest path distance) matrix
        var adjMatrix = getAdjMatrix({
            nodes: nodes,
            edges: edges
        }, false);
        var distances = floydWarshall(adjMatrix);
        self.handleInfinity(distances); // scale the ideal edge length acoording to linkDistance
        var scaledD = scaleMatrix(distances, linkDistance);
        self.scaledDistances = scaledD; // get positions by MDS
        var positions = self.runMDS();
        self.positions = positions;
        positions.forEach(function (p, i) {
            nodes[i].x = p[0] + center[0];
            nodes[i].y = p[1] + center[1];
        });
    };
    /**
     * mds 算法
     * @return {array} positions 计算后的节点位置数组
     */
    MDSLayout.prototype.runMDS = function () {
        var self = this;
        var dimension = 2;
        var distances = self.scaledDistances; // square distances
        var M = Numeric.mul(-0.5, Numeric.pow(distances, 2)); // double centre the rows/columns
        function mean(A) {
            return Numeric.div(Numeric.add.apply(null, A), A.length);
        }
        var rowMeans = mean(M);
        var colMeans = mean(Numeric.transpose(M));
        var totalMean = mean(rowMeans);
        for (var i = 0; i < M.length; ++i) {
            for (var j = 0; j < M[0].length; ++j) {
                M[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        } // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = Numeric.svd(M);
        var eigenValues = Numeric.sqrt(ret.S);
        return ret.U.map(function (row) {
            return Numeric.mul(row, eigenValues).splice(0, dimension);
        });
    };
    MDSLayout.prototype.handleInfinity = function (distances) {
        var maxDistance = -999999;
        distances.forEach(function (row) {
            row.forEach(function (value) {
                if (value === Infinity) {
                    return;
                }
                if (maxDistance < value) {
                    maxDistance = value;
                }
            });
        });
        distances.forEach(function (row, i) {
            row.forEach(function (value, j) {
                if (value === Infinity) {
                    distances[i][j] = maxDistance;
                }
            });
        });
    };
    return MDSLayout;
}(BaseLayout);
export default MDSLayout;
