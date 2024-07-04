import { MediaEnum } from '@/enums/MediaEnum';
import { mediaList } from '@/setting/designSetting';
import { mediaWidthStringTransform } from '@/utils';
import { onUnmounted, reactive, ref, watch } from 'vue';

export interface MediaOptions {
	alias?: string;
	once?: boolean;
}

export const useMediaType = () => {
	const mediaState = ref<MediaEnum[]>([]);

	const mediaWidthList = mediaWidthStringTransform(mediaList);

	const phoneState = useMedia(mediaWidthList[MediaEnum.PHONE], { alias: MediaEnum.PHONE });

	const padState = useMedia(mediaWidthList[MediaEnum.PAD], { alias: MediaEnum.PAD });

	const commandState = useMedia(mediaWidthList[MediaEnum.COMMAND], { alias: MediaEnum.COMMAND });

	const notebookState = useMedia(mediaWidthList[MediaEnum.NOTEBOOK], { alias: MediaEnum.NOTEBOOK });

	const desktopState = useMedia(mediaWidthList[MediaEnum.DESKTOP], { alias: MediaEnum.DESKTOP });

	const tvState = useMedia(mediaWidthList[MediaEnum.TV], { alias: MediaEnum.TV });

	const stop = watch(
		[phoneState, padState, commandState, notebookState, desktopState, tvState],
		(cur, _) => {
			mediaState.value = cur.filter(item => item.hit).map(item => item.alias) as MediaEnum[];
		},
		{
			deep: true,
		}
	);

	return {
		stop,
		mediaState,
	};
};

export const useMedia = (query: string, options: MediaOptions = {}) => {
	const { alias = query, once = false } = options;

	const queryState = ref<MediaQueryList | null>(null);

	const isHit = reactive({
		hit: false,
		alias,
	});

	const handleChange = (e: MediaQueryListEvent) => {
		isHit.hit = e.matches;
	};
	queryState.value = matchMedia(query);

	isHit.hit = queryState.value.matches;

	!once && queryState.value?.addEventListener('change', handleChange);

	onUnmounted(() => {
		queryState.value?.removeEventListener('change', handleChange);
	});

	return isHit;
};
