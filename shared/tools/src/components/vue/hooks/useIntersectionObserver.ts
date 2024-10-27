import { ref } from 'vue';

export const useIntersectionObserver = (
	observeTarget: HTMLElement,
	onShowCallback: (entry: IntersectionObserverEntry) => void,
	options: {
		onHiddenCallback?: (entry: IntersectionObserverEntry) => void;
		onDisposeCallback?: () => void;
		once?: boolean;
	} = {}
) => {
	const { once, onHiddenCallback, onDisposeCallback } = options;
	const showState = ref(false);
	const handleDispose = () => {
		onDisposeCallback && onDisposeCallback();
		io.disconnect();
	};
	const io = new IntersectionObserver((entries, _) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {

				if (showState.value) return;
				onShowCallback(entry);

				once && handleDispose();
				showState.value = true;
			} else {
				if (!showState.value) return;
				onHiddenCallback && onHiddenCallback(entry);
				showState.value = false;
			}
		});
	});

	io.observe(observeTarget);
	return handleDispose;
};
