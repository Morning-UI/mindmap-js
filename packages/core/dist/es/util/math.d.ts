export function getRectIntersectByPoint(rect: any, point: any): any;
export function getCircleIntersectByPoint(circle: any, point: any): any;
export function getEllipseIntersectByPoint(ellipse: Object, point: Object): object;
export function applyMatrix(point: number, matrix: any, tag: number): any;
export function invertMatrix(point: number, matrix: number, tag: number): object;
export function getCircleCenterByPoints(p1: any, p2: any, p3: any): {
    x: number;
    y: number;
};
export function distance(p1: any, p2: any): number;
export function scaleMatrix(matrix: any, ratio: any): any[];
export function floydWarshall(adjMatrix: any): any;
export function getAdjMatrix(data: any, directed: any): any[];
export function translate(group: any, vec: any): void;
export function move(group: any, point: any): void;
export function scale(group: any, ratio: any): void;
export function rotate(group: any, angle: any): void;
export function getDegree(n: any, nodeIdxMap: any, edges: any): number[];
