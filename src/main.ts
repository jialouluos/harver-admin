import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import Antd from 'ant-design-vue';
import { setupRoute } from './router';
import 'ant-design-vue/dist/reset.css';
import { setupMicroApps } from './microApp';
import imgLazy from './directives/imgLazy';
import vTooltip from '@jialouluo/tools/src/components/vue/directives/vTooltip';
import Button from '@jialouluo/tools/src/components/vue/harver-ui/button/index.ts';
import BlockQuote from '@jialouluo/tools/src/components/vue/harver-ui/blockquote/index.ts';
import InlineCode from '@jialouluo/tools/src/components/vue/harver-ui/inlinecode/index.ts';
import Divider from '@jialouluo/tools/src/components/vue/harver-ui/divider/index.ts';
import BlockCode from '@jialouluo/tools/src/components/vue/harver-ui/blockcode/index.ts';
import MarkDown from '@jialouluo/tools/src/components/vue/harver-ui/markdown/index.ts';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'highlight.js/styles/atom-one-dark.css'; // 样式
// import 'highlight.js/styles/agate.css'; // 样式
import 'highlight.js/lib/common'; // 依赖包
import hljsVuePlugin from '@highlightjs/vue-plugin'; // 支持vue3的组件
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
// console.log(import.meta.env);
setupRoute(app); //注入路由
app.use(Antd);
app.use(Button);
app.use(BlockQuote);
app.use(InlineCode);
app.use(BlockCode);
app.use(Divider);
app.use(MarkDown);
app.use(imgLazy);

app.use(vTooltip);
app.use(pinia);
app.use(hljsVuePlugin); // 引入代码高亮，并进行全局注册
app.mount('#app');
setupMicroApps(); //microApps
