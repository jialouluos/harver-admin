import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Antd from 'ant-design-vue';
import { setupRoute } from './router';
import 'ant-design-vue/dist/reset.css';
import Button from '@jialouluo/tools/src/components/vue/harver-ui/button/index.ts';
import Text from '@jialouluo/tools/src/components/vue/harver-ui/text/index.ts';
import Tag from '@jialouluo/tools/src/components/vue/harver-ui/tag/index.ts';
import Tags from '@jialouluo/tools/src/components/vue/harver-ui/tags/index.ts';
import VImageLazy from '@jialouluo/tools/src/components/vue/directives/vImgLazy.ts';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { insertGlobalStore } from './store';
// let app2: ReturnType<typeof createApp>;
// app2.config.globalProperties.useStore = useStore;
let app: any;
function render(props: any = {}) {
	const { container, useStore, useRouter } = props;
	app = createApp(App) as any;

	if (useStore) {
		insertGlobalStore(useStore());
		app.config.globalProperties.useStore = useStore;
		app.config.globalProperties.useRouter = useRouter;
	}
	setupRoute(app); //注入路由
	app.use(Antd);
	app.use(Button);
	app.use(Text);
	app.use(Tag);
	app.use(Tags);
	app.use(VImageLazy);
	app.mount(container ? container.querySelector('#harver-blog-admin-root') : '#harver-blog-admin-root');
}

const renderMicro = (render: (props: any) => any) => {
	if (qiankunWindow.__POWERED_BY_QIANKUN__) {
		renderWithQiankun({
			mount(props) {
				render(props);
				window.blogAdminWindow = new Function('return this')();
			},

			update() {
				console.log('update');
			},
			bootstrap() {
				console.log('bootstrap');
			},
			unmount() {
				console.warn('子应用卸载了');
				console.log(app?.unmount);
				app?.unmount();
				app = null;
			},
		});
	} else {
		render({});
	}
};
renderMicro(render);
