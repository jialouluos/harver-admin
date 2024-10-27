export const useResizeObserver = (
	observeTarget: HTMLElement,
	onSizeChangeCallback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
	options: {
		onDisposeCallback?: () => void;
		once?: boolean;
	} = {}
) => {
	const { once, onDisposeCallback } = options;
	const handleDispose = () => {
		onDisposeCallback && onDisposeCallback();
		ro.disconnect();
	};
	const ro = new ResizeObserver((entries, _) => {
		onSizeChangeCallback(entries, _);
		once && handleDispose();
	});

	ro.observe(observeTarget);
	return handleDispose;
};
