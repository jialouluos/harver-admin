import Vue, { App, createVNode, render } from 'vue';
import TextComponent from '../harver-ui/text/index.vue';

export default {
	install(app: App): void {
		app.directive('tooltip', {
			mounted(el, bindings, vnode) {
				const needTooltip = (el: HTMLElement, vnode: Vue.VNode) => {
					if (vnode.props?.['__harver_init_v_tooltip__']) {
						return false;
					}
					return true;
				};

				if (needTooltip(el, vnode)) {
					const parentNode = el.parentNode;
					// const defaultRenderContent = el.textContent;

					// const slots = {
					// 	default: () => [
					// 		// 这里是默认插槽的内容，可以是一个或多个虚拟节点
					// 		cloneVNode(vnode, {
					// 			__harver_init_v_tooltip__: true,
					// 		}),
					// 	],
					// 	content: () => [
					// 		// 命名插槽的内容
					// 		//通过自定义指令的场景是没有content插槽的
					// 		createVNode(
					// 			bindings.value?.contentComponent ?? 'string',
					// 			null,
					// 			bindings.value?.contentSlots ?? bindings?.value.content ?? defaultRenderContent
					// 		),
					// 	],
					// };

					const tooltipNode: Vue.VNode | null = createVNode(TextComponent, bindings.value);
					// const div = document.createElement('div');
					render(tooltipNode, document.createElement('div'));

					parentNode.replaceChild(tooltipNode.el, el);
				}
			},
		});
	},
};
