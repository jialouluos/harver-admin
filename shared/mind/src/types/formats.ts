import { StyleValue } from 'vue';
import { G, Text } from '@svgdotjs/svg.js';
export enum NodeType {
	UnKnown = 0, //未知节点
	Text = 1, //标准节点
	Container = 2, //容器节点 用于渲染 存在标签的文本节点，或者有提示的文本节点
	Summary = 3, //概要节点
	Custom = 4, //html渲染
}
export interface NodeMetaData {
	root?: boolean; //根节点
	content: string; // 节点展示文本
	useHtml?: boolean; //使用html渲染
	show?: boolean; //节点是否展示
	defaultExpand?: boolean; //节点是否默认展开
	lock?: boolean; //节点是否锁定
	style?: StyleValue; //节点样式
	extraData?: Record<string, any>; //一些扩展数据
	children?: NodeMetaData[];
	id?: string; //最终会作为Node的domId
}
export interface NodeCalculationInfo {
	layerIndex: number; // 节点层级
	width: number; //节点计算宽度
	height: number; //节点计算高度
	left: number; //左边距
	top: number; //上边距
	node: Text | null;
}
export interface Node {
	_id: string; //节点ID for 内部使用
	domId: string; //for 外部使用
	isRoot: boolean; //是否根节点
	type: NodeType; //节点类型
	expand: boolean; //节点是否展开
	data: NodeMetaData; //节点元信息
	parent: Node | null; //父节点
	nodeCalculationInfo: NodeCalculationInfo; //节点计算信息
	drawGroup: G;
	children: Node[];
}
