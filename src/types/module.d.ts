// declare module '*.vue' {
// 	import { DefineComponent } from 'vue';

import { HW } from '@/hooks/tamperMonkey/useInjectGlobalState';

//   const Component: DefineComponent<{}, {}, any>;
// 	export default Component;
// }

declare global {
	interface Window {
		hw: HW;
		documentPictureInPicture: any;
	}
}
