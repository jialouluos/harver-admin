import Vue, { App } from 'vue';

export default {
	install(app: App): void {
		app.directive('tooltip', {
            mounted(el, bindings, vnode) {
                
            },
		});
	},
};
