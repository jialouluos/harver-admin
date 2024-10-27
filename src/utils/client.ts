import { useStore } from '@/store';
import { Client } from '@jialouluo/configs';
import { message } from 'ant-design-vue';

export class MainClient extends Client {
	constructor() {
		super({
			baseURL: import.meta.env.VITE_DOMAIN,
			enableCancel: true,
			timeout: 100000,
		});
	}
	prefixHeader = () => {
		const store = useStore();
		// config.headers ??= {};
		// config.headers['blog-user'] = 'harver';
		// config.headers['x-real-ip'] = '8.217.49.181';
		// config.headers['Authorization'] = store.blogAdminStore.token;
		// config.headers['origin'] = 'https://harver.cn';
		// config.headers['X-Forwarded-For'] = '123.123.123.123';
		return {
			'blog-user': import.meta.env.VITE_AUTH,
			'x-real-ip': '8.217.49.181',
			Authorization: store.blogAdminStore.token,
		};
	};
	/**@用户登录 */
	async loginUser(params: { username: string; password: string }) {
		return client
			.post<{
				Token: string;
				username: string;
			}>(`/api/blog/user/back/login`, params)
			.catch(err => {
				message.error(err);
			});
	}
	/**@用户token失活验证 */
	async check() {
		return client.get(`/api/blog/user/back/check`).catch(err => {
			message.error(err);
		});
	}
}
export const client = new MainClient();
