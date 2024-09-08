import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import Antd from 'ant-design-vue';
import { setupRoute } from './router';
import 'ant-design-vue/dist/reset.css';
import { setupMicroApps } from './microApp';
import imgLazy from './directives/imgLazy';

const app = createApp(App);
setupRoute(app); //注入路由
app.use(Antd);
app.use(imgLazy);
app.mount('#app');
setupMicroApps(); //microApps
