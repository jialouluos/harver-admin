declare module 'webpack-parallel-uglify-plugin' {
	export default any;
}

declare interface Window {
	showDirectoryPicker: (...args: any[]) => Promise<any>;
	showOpenFilePicker: (...args: any[]) => Promise<any>;
}

