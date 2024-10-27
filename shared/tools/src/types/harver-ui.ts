import { CSSProperties, StyleValue } from 'vue';

export interface ITooltipProps {
	trigger?: 'hover' | 'click';
	placement?: 'top' | 'left' | 'right' | 'bottom';
	width?: number;
	space?: number;
	disabled?: boolean;
	content?: string;
}
export interface IMeasureProps<T extends Record<string, any>[] | string = string> {
	rows?: number;
	content: T;
	suffix?: string;
	lazy?: boolean;
	supperLazy?: boolean;
	disabled?: boolean;
	contentStyle?: StyleValue;
	maxLength?: number;
	performance?: 'high' | 'low';
}
export interface ITextProps {
	content?: string;
	contentStyle?: CSSProperties;
	width?: string | number; //文本宽度
	maxWidth?: string | number; //文本宽度
	ellipsis?: Pick<IMeasureProps, 'rows'> & {
		expandable?: boolean; //ellipsis时是否展示展开按钮
		expandText?: string; //展开文案
		foldText?: string; //闭合文案
		suffix?: string; //省略文案
		copy?: boolean;
	};
	tooltip?: ITooltipProps & { enable?: boolean };
	measure?: Pick<IMeasureProps, 'lazy' | 'supperLazy' | 'maxLength' | 'performance'>;
}
export interface ITagProps {
	content?: string;
	rows?: number;
	width?: string | number; //文本宽度
	maxWidth?: string | number; //文本宽度
	containerStyle?: CSSProperties;
	maxLength?: number;
	type?: 'primary' | 'sub' | 'grey';
	tooltip?: ITooltipProps & { enable?: boolean };
}
export interface ITagsProps {
	content: ITagProps[];
	ellipsisStyle?: CSSProperties;
	ellipsis?: Pick<IMeasureProps, 'rows'> & {
		expandText?: string;
		foldText?: string;
		type?: '+n' | 'expand' | 'clip';
	};
	width?: string | number; //文本宽度
	maxWidth?: string | number; //文本宽度
	tooltip?: ITooltipProps & { enable?: boolean };
	measure?: Pick<IMeasureProps, 'lazy' | 'supperLazy' | 'maxLength'>;
}
