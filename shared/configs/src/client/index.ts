import { AxiosRequestConfig } from 'axios';
import { I_Config, request } from './request';

export class Client {
	prefixHeader: () => Record<string, any> = () => ({});
	constructor(private configs: I_Config = {}) {}
	private _request<T>(
		method: 'get' | 'post',
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
		}
	}
	get<T>(
		url: string,
		data: Record<string, any> = {},
		options: AxiosRequestConfig = {},
		config: I_Config = { ...this.configs }
	) {
		return this._request<T>(
			'get',
			url,
			data,
			{
				...options,
				headers: {
					...this.prefixHeader(),
					...(options.headers ?? {}),
				},
			},
			config
		);
	}
	post<T>(
		url: string,
		data: Record<string, any>,
		options: AxiosRequestConfig = {},
		config: I_Config = { ...this.configs }
	) {
		return this._request<T>(
			'post',
			url,
			data,
			{
				...options,
				headers: {
					...this.prefixHeader(),
					...(options.headers ?? {}),
				},
			},
			config
		);
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
}
