// declare module '*.vue' {
// 	import { DefineComponent } from 'vue';

import { HW } from '@/extraTools/hooks/useInjectGlobalState';

//   const Component: DefineComponent<{}, {}, any>;
// 	export default Component;
// }

declare interface Window {
	hw: HW;
	documentPictureInPicture: any;
}
