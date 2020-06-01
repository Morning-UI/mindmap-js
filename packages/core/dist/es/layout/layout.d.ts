export default Layout;
/**
 * 基础布局，将被自定义布局所继承
 */
export var BaseLayout: any;
declare namespace Layout {
    export function registerLayout(type: string, layout: object, layoutCons: any): void;
}
