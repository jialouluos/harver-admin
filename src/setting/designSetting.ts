import { MediaEnum } from '@/enums/MediaEnum';

export const prefixCls = 'harver';
export const mediaList: Record<MediaEnum, [number, number] | number> = {
	[MediaEnum.PHONE]: [0, 375],
	[MediaEnum.PAD]: [376, 768],
	[MediaEnum.COMMAND]: [769, 960],
	[MediaEnum.NOTEBOOK]: [961, 1200],
	[MediaEnum.DESKTOP]: [1201, 1600],
	[MediaEnum.TV]: 1601,
};
