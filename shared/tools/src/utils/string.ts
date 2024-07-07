export const mergeRoutePath = (pre: string = '', suf: string = '') => {
	if (pre.at(-1) === '/' && suf.at(0) === '/') {
		return pre + suf.slice(1);
	}
	if (pre.at(-1) !== '/' && suf.at(0) !== '/') {
		return pre + '/' + suf;
	}
	return pre + suf;
};
