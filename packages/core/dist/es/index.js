import { version } from '../package.json';
import Behaviors from './behavior';
import Graph from './graph/graph';
import TreeGraph from './graph/tree-graph';
import Shape from './shape';
import Layout from './layout';
import Global from './global';
import Util from './util';
import Plugins from './plugins';
var registerNode = Shape.registerNode;
var registerEdge = Shape.registerEdge;
var registerBehavior = Behaviors.registerBehavior;
var registerLayout = Layout.registerLayout;
var Minimap = Plugins.Minimap;
var Grid = Plugins.Grid;
var Bundling = Plugins.Bundling;
var Menu = Plugins.Menu;
export { registerNode, Graph, TreeGraph, Util, registerEdge, Layout, Global, registerLayout, Minimap, Grid, Bundling, Menu, registerBehavior };
export default {
    version: version,
    Graph: Graph,
    TreeGraph: TreeGraph,
    Util: Util,
    registerNode: Shape.registerNode,
    registerEdge: Shape.registerEdge,
    registerBehavior: Behaviors.registerBehavior,
    registerLayout: Layout.registerLayout,
    Layout: Layout,
    Global: Global,
    Minimap: Plugins.Minimap,
    Grid: Plugins.Grid,
    Bundling: Plugins.Bundling,
    Menu: Plugins.Menu
};
