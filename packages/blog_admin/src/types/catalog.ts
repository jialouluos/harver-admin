export interface CatalogInfo {
	pid: number;
	name: string;
	id: number;
}
export interface CatalogFiled {
	pid: number;
	name: string;
	id?: number;
}
export type CatalogList = CatalogInfo[];
export interface TagInfo {
	_id: string;
	pid: number;
	name: string;
	id: number;
}
export type TagList = TagInfo[];
