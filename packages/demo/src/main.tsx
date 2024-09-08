import React from 'react';
import ReactDOM from 'react-dom/client';
import MyRouter from './router/index.tsx';

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const render = (container?: HTMLElement) => {
	const app = ReactDOM.createRoot(container ? container : document.getElementById('root')!);
	app.render(
		<React.StrictMode>
			<MyRouter />
		</React.StrictMode>
	);
	return app;
};
const renderMicro = (render: (container?: HTMLElement) => ReactDOM.Root) => {
	let app: ReactDOM.Root;
	if (qiankunWindow.__POWERED_BY_QIANKUN__) {
		renderWithQiankun({
			mount(props) {
				const { container } = props;
				app = render(container);
				window.demoWindow = new Function('return this')();
			},

			update() {},
			bootstrap() {},
			unmount() {
				app.unmount();
			},
		});
	} else {
		render();
	}
};
renderMicro(render);
