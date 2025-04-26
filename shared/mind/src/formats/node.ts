import { Node, NodeMetaData, NodeType } from '@mind/types/formats';
import { v4 as uuid } from 'uuid';
import { NodeCalculation } from './nodeCalculation';
import { globalState } from './globalState';
import { G, Text } from '@svgdotjs/svg.js';
export class MindNode implements Node {
	_id: string;
	domId: string;
	isRoot: boolean;
	type: NodeType;
	expand: boolean;
	data: NodeMetaData;
	parent: MindNode | null;
	nodeCalculationInfo: NodeCalculation;
	children: MindNode[];
	drawGroup: G;
	constructor(options: NodeMetaData) {
		const { id, root, useHtml, defaultExpand, children = [] } = options;
		this.data = options;
		this._id = uuid().slice(0.5);
		this.domId = id || this._id;
		this.isRoot = !!root;
		this.expand = defaultExpand ?? true;
		this.parent = null;
		this.nodeCalculationInfo = new NodeCalculation(this);
		this.drawGroup = new G();
		globalState.setMindNode(this.domId, this);
		if (useHtml) {
			this.type = NodeType.Custom;
		} else {
			this.type = NodeType.Text;
		}
		this.children = children.map(i => {
			const childrenNode = new MindNode(i);
			childrenNode.setParentNode(this);
			return childrenNode;
		});
	}

	setParentNode(node: Node['domId'] | MindNode) {
		if (node instanceof MindNode) {
			this.parent = node;
		} else {
			//通过map去查
			const parentNode = globalState.getMindNode(node);
			if (!parentNode) {
				console.info(`【id:${node}】MindNode is null ! `);
			}
			this.parent = parentNode!;
		}
	}
	/**@type NodeType.Text */
	createTextNode(content: string) {
		const node = new Text().text(content);
		this.nodeCalculationInfo.setNode(node);
		return node;
	}

	// 渲染节点
	render() {
		const nodeType = this.type;
		switch (nodeType) {
			case NodeType.Text: {
				const drawNode = this.createTextNode(this.data.content);
				const calcInfo = this.nodeCalculationInfo;
				// 文字节点相对于容器偏移内边距的大小
				drawNode.x(10).y(5);
				// 创建一个矩形来作为边框
				this.drawGroup.rect(calcInfo.width, calcInfo.height).x(0).y(0);
				// 文本节点添加到节点容器里
				this.drawGroup.add(drawNode);
				// 在画布上定位该节点
				this.drawGroup.translate(calcInfo.left, calcInfo.top);
				// 容器添加到画布上
				if (globalState.drawContainer) {
					globalState.drawContainer.add(this.drawGroup);
				}
			}
		}
	}
}
