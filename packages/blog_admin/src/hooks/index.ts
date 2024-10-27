import { useRouter as _useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';

export const useRouter = () => {
	const instance = getCurrentInstance();
	return instance?.appContext?.config?.globalProperties?.useRouter?.() ?? _useRouter();
};
