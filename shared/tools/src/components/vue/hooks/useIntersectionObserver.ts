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
	const handleDispose = () => {
		onDisposeCallback && onDisposeCallback();
		io.disconnect();
	};
	const io = new IntersectionObserver((entries, _) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				onShowCallback(entry);
				once && handleDispose();
			} else {
				onHiddenCallback && onHiddenCallback(entry);
			}
		});
	});

	io.observe(observeTarget);
	return handleDispose;
};
