import { Node } from '@mind/types/formats';
import { MindNode } from './node';
import { SVG, Svg } from '@svgdotjs/svg.js';
class GlobalState {
	static instance: GlobalState | null = null;
	mindNodeCache!: Map<string, MindNode>;
	drawContainer?: Svg;
	constructor() {
		if (GlobalState.instance) return GlobalState.instance;
		GlobalState.instance = this;
		this.mindNodeCache = new Map<string, MindNode>();
	}
	initDrawContainer(el: string) {
		this.drawContainer = SVG().addTo(el);
	}
	setMindNode(id: Node['domId'], node: MindNode) {
		return this.mindNodeCache.set(id, node);
	}
	getMindNode(id: Node['domId']) {
		if (this.mindNodeCache.has(id)) {
			return this.mindNodeCache.get(id);
		} else {
			return null;
		}
	}
}
export const globalState = new GlobalState();
