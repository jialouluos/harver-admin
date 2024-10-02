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
const app = createApp(App);
setupRoute(app); //注入路由
app.use(Antd);
app.use(Button);
app.use(imgLazy);
app.use(vTooltip);
app.mount('#app');
setupMicroApps(); //microApps
