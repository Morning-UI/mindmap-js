export function getBBoxFromPoint(point: any): {
    x: any;
    y: any;
    centerX: any;
    centerY: any;
    minX: any;
    minY: any;
    maxX: any;
    maxY: any;
    height: number;
    width: number;
};
export function getBBoxFromPoints(points: any): {
    centerX: number;
    centerY: number;
    maxX: any;
    maxY: any;
    minX: any;
    minY: any;
    height: number;
    width: number;
};
export function isBBoxesOverlapping(b1: any, b2: any): boolean;
export function filterConnectPoints(points: any): any[];
export function simplifyPolyline(points: any): any;
export function getSimplePolyline(sPoint: any, tPoint: any): any[];
export function getExpandedBBox(bbox: any, offset: any): any;
export function isHorizontalPort(port: any, bbox: any): boolean;
export function getExpandedBBoxPoint(bbox: any, point: any): {
    x: any;
    y: any;
};
export function mergeBBox(b1: any, b2: any): {
    centerX: number;
    centerY: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    height: number;
    width: number;
};
export function getPointsFromBBox(bbox: any): {
    x: any;
    y: any;
}[];
export function isPointOutsideBBox(point: any, bbox: any): boolean;
export function getBBoxXCrossPoints(bbox: any, x: any): {
    x: any;
    y: any;
}[];
export function getBBoxYCrossPoints(bbox: any, y: any): {
    x: any;
    y: any;
}[];
export function getBBoxCrossPointsByPoint(bbox: any, point: any): {
    x: any;
    y: any;
}[];
export function distance(p1: any, p2: any): number;
export function _costByPoints(p: any, points: any): number;
export function heuristicCostEstimate(p: any, ps: any, pt: any, source: any, target: any): number;
export function reconstructPath(pathPoints: any, pointById: any, cameFrom: any, currentId: any, iterator: any): void;
export function removeFrom(arr: any, item: any): void;
export function isSegmentsIntersected(p0: any, p1: any, p2: any, p3: any): boolean;
export function isSegmentCrossingBBox(p1: any, p2: any, bbox: any): boolean;
export function getNeighborPoints(points: any, point: any, bbox1: any, bbox2: any): any[];
export function pathFinder(points: any, start: any, goal: any, sBBox: any, tBBox: any, os: any, ot: any): any[];
export function isBending(p0: any, p1: any, p2: any): boolean;
export function getBorderRadiusPoints(p0: any, p1: any, p2: any, r: any): {
    x: number;
    y: number;
}[];
export function getPathWithBorderRadiusByPolyline(points: any, borderRadius: any): string;
export function getPolylinePoints(start: any, end: any, sNode: any, tNode: any, offset: any): any;
