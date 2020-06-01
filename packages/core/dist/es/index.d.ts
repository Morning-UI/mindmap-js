declare namespace _default {
    export { version };
    export { Graph };
    export { TreeGraph };
    export { Util };
    export const registerNode: typeof Shape.registerNode;
    export const registerEdge: typeof Shape.registerEdge;
    export const registerBehavior: typeof Behaviors.registerBehavior;
    export const registerLayout: <Cfg>(type: string, layout: Partial<import("@antv/g6/es/interface/layout").ILayout<Cfg>>, layoutCons?: new () => import("@antv/g6/es/layout/layout").BaseLayout<Cfg>) => void;
    export { Layout };
    export { Global };
    export const Minimap: typeof import("@antv/g6/es/plugins/minimap").default;
    export const Grid: typeof import("@antv/g6/es/plugins/grid").default;
    export const Bundling: typeof import("@antv/g6/es/plugins/bundling").default;
    export const Menu: typeof import("@antv/g6/es/plugins/menu").default;
}
export default _default;
export var registerNode: typeof Shape.registerNode;
import Graph from "@antv/g6/es/graph/graph";
import TreeGraph from "@antv/g6/es/graph/tree-graph";
import Util from "@antv/g6/es/util";
export var registerEdge: typeof Shape.registerEdge;
import Layout from "@antv/g6/es/layout";
import Global from "@antv/g6/es/global";
export var registerLayout: <Cfg>(type: string, layout: Partial<import("@antv/g6/es/interface/layout").ILayout<Cfg>>, layoutCons?: new () => import("@antv/g6/es/layout/layout").BaseLayout<Cfg>) => void;
export var Minimap: typeof import("@antv/g6/es/plugins/minimap").default;
export var Grid: typeof import("@antv/g6/es/plugins/grid").default;
export var Bundling: typeof import("@antv/g6/es/plugins/bundling").default;
export var Menu: typeof import("@antv/g6/es/plugins/menu").default;
export var registerBehavior: typeof Behaviors.registerBehavior;
import Shape from "@antv/g6/es/shape";
import Behaviors from "@antv/g6/es/behavior";
export { Graph, TreeGraph, Util, Layout, Global };
