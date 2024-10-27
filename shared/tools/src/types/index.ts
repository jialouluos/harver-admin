export * from './harver-ui';
export interface FileInfo {
	context: string;
	name: string;
	lastModified: number;
	parentDir: string;
}
export interface FileHandleInfo {
	parentDir: string;
	handle: any;
}
export enum NAME_INFO_ENUM {
	TEXT = 'text',
	CODE = 'code',
}
/**@从一种类型中筛选出满足另一种类型的元素 */
export type PickTypeFilter<T extends object, F> = {
	[U in keyof T as T[U] extends Function | F ? (T[U] extends F ? U : never) : never]-?: T[U];
};
/**@找到树中的链接字段，例如children */
export type TreeNodeType<T extends object> = {
	[U in keyof T as T[U] extends T[] ? U : never]: T[U];
};
/**@将一个数组字段，加到另一个树类型的每一个节点上 */
export type DeepType<T extends object, K extends Extract<keyof T, string>, R extends object> =
	| {
			[U in keyof T as U extends K ? U : never]: (DeepType<T, K, R> & R)[];
	  } & R;
/**@将一个数组字段，加到另一个树类型的每一个节点上并且Required */
export type DeepTypeRequired<T extends object, K extends Extract<keyof T, string>, R extends object> =
	| {
			[U in keyof T as U extends K ? U : never]-?: (DeepType<T, K, R> & R)[];
	  } & R;
/**@将一个数组字段，加到另一个树类型的每一个节点上并且Required */
export type DeepObjectTypeRequired<T extends object, K extends Extract<keyof T, string>, R extends object> =
	| {
			[U in keyof T as U extends K ? U : never]-?: (DeepType<T, K, R> & R)[];
	  } & R;
/**@将所有字段改为必须 */
export type DeepArrayTreeRequired<T extends object> = {
	[U in keyof T]-?: NonNullable<T[U]> extends Array<any>
		? DeepTypeRequired<DeepArrayTreeRequired<T>, Extract<U, string>, Omit<DeepArrayTreeRequired<T>, U>>[]
		: NonNullable<T[U]> extends object
		? DeepArrayTreeRequired<NonNullable<T[U]>>
		: NonNullable<T[U]>;
};

export type FiledToString<T extends object> = {
	[U in keyof T as U extends string ? U : never]: T[U];
};
