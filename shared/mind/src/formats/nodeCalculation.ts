import { NodeCalculationInfo, NodeType } from '@mind/types/formats';
import { Text } from '@svgdotjs/svg.js';
import { MindNode } from './node';
export class NodeCalculation implements NodeCalculationInfo {
	layerIndex: number; // 节点层级
	width: number; //节点计算宽度
	height: number; //节点计算高度
	left: number; //左边距
	top: number; //上边距
	node: Text | null = null;
	matchMindNode: MindNode;
	constructor(node: MindNode) {
		this.layerIndex = 0;
		this.width = 0;
		this.height = 0;
		this.left = 0;
		this.top = 0;
		this.matchMindNode = node;
	}
	setNode(node: NodeCalculationInfo['node']) {
		this.node = node;
		this.compute();
	}
	compute() {
		if (!this.node) return;
		const nodeType = this.matchMindNode.type;
		switch (nodeType) {
			case NodeType.Text: {
				const { width, height } = this.node.bbox(); // 获取文本节点的宽高
				this.width = width;
				this.height = height;
				break;
			}
			default: {
				break;
			}
		}
	}
}
