import { AxiosRequestConfig } from 'axios';
import { I_Config, request } from './request';
import { message } from 'ant-design-vue';
import { CatalogFiled, CatalogInfo, CatalogList, TagList } from '@blog_admin/types';
import { IArticleCard } from '../parseMarkdown';

export class Client {
	constructor() {}
	private _request<T>(
		method: 'get' | 'post' | 'delete',
		url: string,
		data: Record<string, any>,
		options: AxiosRequestConfig,
		config: I_Config = {}
	) {
		/^http/.test(url) && (config.baseURL = '');
		switch (method) {
			case 'get':
				return new Promise<T>((_res, _rej) => {
					request<T>(
						{
							method: 'get',
							url: url + this.objectToQuery(data, ''),
							...options,
						},
						config
					)
						.then(res => {
							if (typeof res === 'string' || typeof res.data === 'undefined') return _res(res as never);
							if (res.status !== 200) {
								return _rej(res.reason);
							} else {
								_res(res.data);
							}
						})
						.catch((err: Error) => {
							_rej(err);
						});
				});
			case 'post':
				return new Promise<T>((_res, _rej) => {
					request<T>({ method: 'post', url, data, ...options }, config)
						.then(res => {
							if (typeof res === 'string') return _res(res);
							if (res.status !== 200) {
								return _rej(res.reason);
							} else {
								_res(res.data);
							}
						})
						.catch((err: Error) => {
							_rej(err);
						});
				});
			case 'delete':
				return new Promise<T>((_res, _rej) => {
					request<T>({ method: 'delete', url, data, ...options }, config)
						.then(res => {
							if (typeof res === 'string') return _res(res);
							if (res.status !== 200) {
								return _rej(res.reason);
							} else {
								_res(res.data);
							}
						})
						.catch((err: Error) => {
							_rej(err);
						});
				});
		}
	}
	get<T>(url: string, data: Record<string, any> = {}, options: AxiosRequestConfig = {}, config: I_Config = {}) {
		return this.handleSuccess(this._request<T>('get', url, data, options, config));
	}
	post<T>(url: string, data: Record<string, any>, options: AxiosRequestConfig = {}, config: I_Config = {}) {
		return this.handleSuccess(this._request<T>('post', url, data, options, config));
	}
	delete<T>(url: string, data: Record<string, any> = {}, options: AxiosRequestConfig = {}, config: I_Config = {}) {
		return this.handleSuccess(this._request<T>('delete', url, data, options, config));
	}
	async handleSuccess<T>(promise: Promise<T>) {
		return promise.catch(err => {
			if (typeof window !== 'undefined') message.error(err);
			else console.log(err);
		});
	}
	private objectToQuery(obj: Record<string, any>, prefix: string) {
		if (typeof obj !== 'object') return '';
		const attrs = Object.keys(obj);
		return attrs.reduce((query, attr, index) => {
			// 判断是否是第一层第一个循环
			if (index === 0 && !prefix) query += '?';
			if (typeof obj[attr] === 'object') {
				const subPrefix = prefix ? `${prefix}.${attr}` : attr;
				query += this.objectToQuery(obj[attr], subPrefix);
			} else {
				if (prefix) {
					query += `${prefix}.${attr}=${obj[attr]}`;
				} else {
					query += `${attr}=${obj[attr]}`;
				}
			}
			// 判断是否是第一层最后一个循环
			if (index !== attrs.length - 1) query += '&';
			return query;
		}, '');
	}

	// /**@获取demo目录 */
	// async getDemoGroup() {
	// 	return client.get<DemoRawInfoArray>('https://api.harver.cn/notes/code/iframe.json');
	// }
	/**@用户登录 */
	async loginUser(params: { username: string; password: string }) {
		return this.post<{
			Token: string;
			username: string;
		}>(`/api/blog/user/back/login`, params).catch(err => {
			message.error(err);
		});
	}
	/**@获取目录列表 */
	async getCatalogAllList() {
		return this.get<CatalogList>(`/api/blog/catalog/front/list`).catch(err => {
			message.error(err);
		});
	}
	/**@获取标签列表 */
	async getTagAllList() {
		return this.get<{
			catalog: string[];
			id: number[];
			tags: string[];
		}>(`/api/blog/article/back/tags`).catch(err => {
			message.error(err);
		});
	}
	/**@提交文章信息 */
	async putArticle(data: IArticleCard) {
		return this.post<IArticleCard[]>(`/api/blog/article/back/append`, data).catch(err => {
			message.error(err);
		});
	}
	/**@获取文章列表 */
	async getArticleList(filter: {
		limit?: number;
		offset?: number;
		catalog?: string;
		id?: string;
		is_reverse?: number;
	}) {
		return this.get<{
			count: number;
			list: IArticleCard[];
		}>(`/api/blog/article/back/list`, {
			...filter,
		});
	}
	/**@更新文章 */
	async updateArticle(data: IArticleCard) {
		return this.post(`/api/blog/article/back/update`, data).catch(err => {
			message.error(err);
		});
	}
	/**@更新文章SEO */
	async updateArticlesSEO(data: { host: string; key: string; keyLocation: string; urlList: string[] }) {
		return this.post(`/api/blog/article/back/seo_bing`, data).catch(err => {
			message.error(err);
		});
	}
	/**@删除文章 */
	async deleteArticle(id: number) {
		return this.delete(`/api/blog/article/back/del/${id}`).catch(err => {
			message.error(err);
		});
	}
	/**@获取目录列表 */
	async getCatalogList({ limit, offset }: { limit?: number; offset?: number }) {
		return this.get<{
			count: number;
			list: CatalogInfo[];
			all: CatalogInfo[];
		}>(`/api/blog/catalog/back/list?limit=${limit}&offset=${offset}`).catch(err => {
			message.error(err);
		});
	}
	/**@更新目录 */
	async updateCatalog(data: CatalogFiled) {
		return this.post(`/api/blog/catalog/back/update`, data).catch(err => {
			message.error(err);
		});
	}
	/**@新增目录 */
	async addCatalog(data: CatalogFiled) {
		return this.post(`/api/blog/catalog/back/append`, data).catch(err => {
			message.error(err);
		});
	}
	/**@删除目录 */
	async deleteCatalog(id: number) {
		return this.delete(`/api/blog/catalog/back/del/${id}`).catch(err => {
			message.error(err);
		});
	}
}
export const client = new Client();
