import { App, reactive } from 'vue';
export const DEFAULT_LOADING = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const DEFAULT_ERROR = '';
export default {
	install(app: App): void {
		app.directive('lazy', {
			beforeMount(el) {
				el['data-src'] = el.src;
				el.src = DEFAULT_LOADING;
			},
			mounted(el) {
				const state = reactive<{
					timerId: ReturnType<typeof setTimeout> | null;
					loaded: boolean;
					delayLoad: number;
				}>({
					loaded: false,
					delayLoad: 300,
					timerId: null,
				});
				const handleLoadImage = (el: HTMLImageElement, observer: IntersectionObserver, url: string) => {
					state.timerId = setTimeout(() => {
						//TODO 如果当前并没有图片在进行请求，则后台默默请求
						observer.unobserve(el);
						state.timerId = null;
						el.src = url;
						el.addEventListener('load', _ => {
							state.loaded = true;
						});
					}, state.delayLoad);
				};

				const io = new IntersectionObserver((entries, observer) => {
					entries.forEach(entry => {
						!state.timerId && handleLoadImage(el, observer, el['data-src']);
						if (!entry.isIntersecting) {
							state.timerId && clearTimeout(state.timerId);
							state.timerId = null;
						}
					});
				});
				io.observe(el);
			},
		});
	},
};
