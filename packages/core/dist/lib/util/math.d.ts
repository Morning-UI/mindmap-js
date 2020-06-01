export var __esModule: boolean;
export function getDegree(n: any, nodeIdxMap: any, edges: any): number[];
export function rotate(group: any, angle: any): void;
export function scale(group: any, ratio: any): void;
export function move(group: any, point: any): void;
export function translate(group: any, vec: any): void;
export function getAdjMatrix(data: any, directed: any): any[];
export function floydWarshall(adjMatrix: any): any[][];
export function scaleMatrix(matrix: any, ratio: any): any[];
export function distance(p1: any, p2: any): number;
export function getCircleCenterByPoints(p1: any, p2: any, p3: any): {
    x: number;
    y: number;
};
export function invertMatrix(point: any, matrix: any, tag: any): {
    x: any;
    y: any;
};
export function applyMatrix(point: any, matrix: any, tag: any): {
    x: any;
    y: any;
};
export function getEllipseIntersectByPoint(ellipse: any, point: any): {
    x: any;
    y: any;
};
export function getCircleIntersectByPoint(circle: any, point: any): {
    x: any;
    y: any;
};
/**
 * point and rectangular intersection point
 * @param  {IRect} rect  rect
 * @param  {Point} point point
 * @return {PointPoint} rst;
 */
export function getRectIntersectByPoint(rect: any, point: any): any;
