<template>
  <div ref="seeksRelationGraph" :style="{width: '100%',height : '100%'}" style="box-sizing:border-box;">
    <template v-if="relationGraph && relationGraph.options">
      <GraphDebugPanel v-if="relationGraph.options.showDebugPanel" :relation-graph="relationGraph" />
      <slot v-if="relationGraph.options.allowShowMiniToolBar===true" name="miniToolBar" :relation-graph="relationGraph">
        <GraphMiniToolBar :relation-graph="relationGraph" />
      </slot>
      <slot v-if="relationGraph.options.allowShowMiniView===true" name="miniViewPanel" :relation-graph="relationGraph">
        <GraphMiniView :relation-graph="relationGraph" />
      </slot>
      <slot name="graph-plug" :relation-graph="relationGraph" />
      <RGCanvas :relation-graph="relationGraph">
        <template slot="node" slot-scope="{node}">
          <slot :node="node" :relation-graph="relationGraph" name="node" />
        </template>
        <template slot="line" slot-scope="{line, link}">
          <slot :line="line" :link="link" :relation-graph="relationGraph" name="line" />
        </template>
        <template slot="canvas-plug">
          <slot :relation-graph="relationGraph" name="canvas-plug" />
        </template>
      </RGCanvas>
    </template>
  </div>
</template>

<script>
import { version } from '../../package.json';
import '../utils/RGGraphIconfont';
import Vue from 'vue';
import screenfull from 'screenfull';
import RGCanvas from './RGCanvas';
import GraphDebugPanel from './widgets/GraphDebugPanel';
import GraphMiniView from './widgets/GraphMiniView';
import GraphMiniToolBar from './widgets/GraphMiniToolBar';
import { devLog } from '../utils/RGCommon';
import { RelationGraphFinal } from '../models/RelationGraphFinal';
import html2canvas from 'html2canvas';

export default {
  name: 'SeeksRelationGraph',
  components: { GraphMiniToolBar, GraphMiniView, RGCanvas, GraphDebugPanel },
  props: {
    options: {
      mustUseProp: false,
      default: () => { return {}; },
      type: Object
    },
    relationGraphCore: {
      mustUseProp: false,
      default: null,
      type: Function
    },
    onNodeClick: {
      mustUseProp: false,
      default: () => { return () => {}; },
      type: Function
    },
    onNodeExpand: {
      mustUseProp: false,
      default: () => { return () => {}; },
      type: Function
    },
    onNodeCollapse: {
      mustUseProp: false,
      default: () => { return () => {}; },
      type: Function
    },
    onLineClick: {
      mustUseProp: false,
      default: () => { return () => {}; },
      type: Function
    },
    onDownloadExcel: {
      mustUseProp: false,
      default: null,
      type: Function
    },
    onImageDownload: {
      mustUseProp: false,
      default: null,
      type: Function
    }
  },
  data() {
    // this.relationGraph = null;
    return {
      relationGraph: null,
      graphSetting: null
    };
  },
  created() {
    if (window) window.relationGraphDebug = this.options.debug;
    devLog('---------------------------graph created---------------------------', this);
    console.log(
      `%c relation-graph %c Version v${version} %c More info: https://github.com/seeksdream/relation-graph %c`,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:#fff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #41b883',
      'background:transparent'
    );
    let slotAlert = false;
    if (Vue.version.substring(0, 4) === '2.5.') slotAlert = true;
    if (Vue.version.substring(0, 4) === '2.6.' && parseInt(Vue.version.split('.')[2]) <= 12) slotAlert = true;
    if (slotAlert) {
      console.error('您的Vue版本：' + Vue.version + '注意：当你使用的vue版本等于低于2.6.12时，你只能通过插槽slot[node]来显示节点和线条，示例请参考：http://relation-graph.com/#/demo/adv-slot');
    }
    if (!screenfull) {
      console.error('[relation-graph]Please introduce component screenfull, for example:https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/5.1.0/screenfull.min.js');
    }
    if (!html2canvas) {
      console.error('[relation-graph]Please introduce component html2canvas, for example:https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
  },
  mounted() {
    devLog('---------------------------graph mounted---------------------------');
    const listeners = {
      onNodeClick: this.onNodeClick,
      onNodeExpand: this.onNodeExpand,
      onNodeCollapse: this.onNodeCollapse,
      onLineClick: this.onLineClick,
      onDownloadExcel: this.onDownloadExcel,
      onImageDownload: this.onImageDownload
    };
    // devLog(this.relationGraphCore);
    // const rgClass = this.relationGraphCore || RelationGraphFinal;
    // const newRGCoreInstance = Object.create(rgClass.prototype);
    // const relationGraph = rgClass.apply(newRGCoreInstance, [this.options, listeners]);
    const relationGraph = this.relationGraphCore || new RelationGraphFinal(this.options, listeners);
    relationGraph.setDom(this.$refs.seeksRelationGraph);
    relationGraph.ready();
    // if (this.jsonData) relationGraph.setJsonData(this.jsonData);
    this.relationGraph = relationGraph;
    this.graphSetting = this.relationGraph.options;
    screenfull.on('change', this.onFullscreen);
  },
  beforeDestroy() {
    devLog('---------------------------graph beforeDestroy---------------------------');
    screenfull.off('change', this.onFullscreen);
    const elx = this.$refs.seeksRelationGraph;
    elx.remove();
  },
  updated() {
    devLog('---------------------------graph updated---------------------------');
    // if (this.jsonData) this.relationGraph.setJsonData(this.jsonData);
    // if (this.jsonData) this.relationGraph.setJsonData(this.jsonData);
  },
  methods: {
    onFullscreen() {
      this.relationGraph.fullscreen(screenfull.isFullscreen);
    },
    getInstance(options, callback) {
      return this.relationGraph;
    },
    setOptions(options, callback) {
      this.relationGraph.setOptions(options, callback);
    },
    setJsonData(jsonData, callback) {
      this.relationGraph.setJsonData(jsonData, (instance) => {
        this.$nextTick(() => {
          this.relationGraph.playShowEffect(() => {
            if (callback) callback(instance);
          });
        });
      });
    },
    appendJsonData(jsonData, isRelayout, callback) {
      this.relationGraph.appendJsonData(jsonData, isRelayout, callback);
    },
    setLayouter(layouterInstance) {
      this.relationGraph.setLayouter(layouterInstance);
    },
    onGraphResize(jsonData, callback) {
      this.relationGraph.refreshNVAnalysisInfo();
    },
    refresh() {
      this.relationGraph.refresh();
    },
    focusRootNode() {
      this.relationGraph.focusRootNode();
    },
    focusNodeById(nodeId) {
      return this.relationGraph.focusNodeById(nodeId);
    },
    getNodeById(nodeId) {
      return this.relationGraph.getNodeById(nodeId);
    },
    removeNodeById(nodeId) {
      return this.relationGraph.removeNodeById(nodeId);
    },
    getNodes() {
      return this.relationGraph.getNodes();
    },
    getLinks() {
      return this.relationGraph.getLinks();
    },
    getGraphJsonData() {
      return this.relationGraph.getGraphJsonData();
    },
    getGraphJsonOptions() {
      return this.relationGraph.getGraphJsonOptions();
    }
  }
};
</script>
<style scoped>
</style>
