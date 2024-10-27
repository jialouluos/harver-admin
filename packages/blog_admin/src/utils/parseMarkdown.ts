import { ArticleMeta } from '@jialouluo/tools';
export type PickerArticleFiled = TArticleFiled | 'pv' | 'body' | 'create_time';
export type TArticleFiled =
	| 'auth'
	| 'description'
	| 'tags'
	| 'order'
	| 'pre_img'
	| 'publish'
	| 'questions'
	| 'is_lock'
	| 'title'
	| 'catalog'
	| 'keywords';
export interface IArticleMeta {
	auth: string;
	description: string;
	tags: string[];
	order: number;
	pre_img: string;
	publish: boolean;
	questions: { q: string; a: string }[];
	is_lock: boolean;
	title: string;
	catalog: string;
	keywords: string;
}
export interface IArticleCard extends IArticleMeta {
	pv: number;
	body: string;
	create_time: number;
	update_time?: number;
	id?: number;
}
export const parseMap: Record<
	TArticleFiled,
	{
		_filed: string;
		defaultFn: (item: any, context: string, meta: ArticleMeta) => any;
		generateFn: (item: any, context: string, meta: ArticleMeta) => any;
	}
> = {
	auth: {
		_filed: 'auth', //不做任何用处
		defaultFn: () => import.meta.env.VITE_AUTH,
		generateFn: item => item,
	},
	description: {
		_filed: 'description', //不做任何用处
		defaultFn: (_, context) => {
			const res = context.match(/(.*?)([\。|\?|\!|])(.*)$/s);
			return res ? RegExp.$1 : context.slice(0, 40);
		},
		generateFn: item => item,
	},
	tags: {
		_filed: 'tags', //不做任何用处
		defaultFn: () => [],
		generateFn: item => item,
	},
	order: {
		_filed: 'order', //不做任何用处
		defaultFn: _ => 0,
		generateFn: item => item,
	},
	pre_img: {
		_filed: 'pre_img', //不做任何用处
		defaultFn: _ => '',
		generateFn: item => item,
	},
	publish: {
		_filed: 'publish', //不做任何用处
		defaultFn: _ => true,
		generateFn: item => item,
	},
	questions: {
		_filed: 'questions', //不做任何用处
		defaultFn: _ => [],
		generateFn: item => item,
	},
	is_lock: {
		_filed: 'lock', //不做任何用处
		defaultFn: (_, __, meta) => meta?.lock ?? false,
		generateFn: item => item,
	},
	title: {
		_filed: 'title', //不做任何用处
		defaultFn: (_, __, meta) => meta?.name ?? '',
		generateFn: item => item,
	},
	catalog: {
		_filed: 'catalog', //不做任何用处
		defaultFn: (_, __, meta) => meta?.parentDir ?? '',
		generateFn: item => item,
	},
	keywords: {
		_filed: 'keywords', //不做任何用处[传字符串用,分割]
		defaultFn: () => '',
		generateFn: item => item,
	},
};

export const parseMarkDown = (context: string, meta: ArticleMeta): Record<TArticleFiled, any> => {
	return Object.keys(parseMap).reduce((pre, key) => {
		const value = parseMap[key as keyof typeof parseMap];
		pre[key as TArticleFiled] = value.generateFn(meta[key], context, meta) || value.defaultFn(meta[key], context, meta);
		return pre;
	}, {} as Record<TArticleFiled, any>);
};
