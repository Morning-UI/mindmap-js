import Numeric from 'numericjs';
var MDS = 
/** @class */
function () {
    function MDS(params) {
        this.distances = params.distances;
        this.dimension = params.dimension || 2;
        this.linkDistance = params.linkDistance;
    }
    MDS.prototype.layout = function () {
        var self = this;
        var dimension = self.dimension, distances = self.distances, linkDistance = self.linkDistance; // square distances
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
        var ret;
        var res = [];
        try {
            ret = Numeric.svd(M);
        }
        catch (e) {
            var length_1 = distances.length;
            for (var i = 0; i < length_1; i++) {
                var x = Math.random() * linkDistance;
                var y = Math.random() * linkDistance;
                res.push([x, y]);
            }
        }
        if (res.length === 0) {
            var eigenValues_1 = Numeric.sqrt(ret.S);
            res = ret.U.map(function (row) {
                return Numeric.mul(row, eigenValues_1).splice(0, dimension);
            });
        }
        return res;
    };
    return MDS;
}();
export default MDS;
