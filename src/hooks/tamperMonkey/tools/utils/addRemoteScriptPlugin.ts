import fs from 'fs';
const prefixCode = (containerID: string, code: string = '') => {
	return `
	 async function loadScript(src) {
		return new Promise(resolve => {
			let tag = document.createElement('script');
			tag.async = true;
			tag.src = src;
			tag.defer = 'defer';
			document.head.appendChild(tag);
			tag.addEventListener('load', function () {
				resolve(1);
			});
		});
	};
    loadScript('https://unpkg.com/vue').then(_=>{
	 ${code}
		const hw_tools_div = document.createElement('div');
		hw_tools_div.id = '${containerID}';
		document.body.append(hw_tools_div)
		Vue.createApp(__sfc_main__).mount('#' + '${containerID}')
	})
	`;
};
export default (containerID: string) => {
	return {
		name: 'addRemoteScript',
		setup(build: any) {
			build.onLoad({ filter: /.*\.js$/ }, async (args: any) => {
				const source = await fs.promises.readFile(args.path, 'utf8');
				const contents = source.toString();
				// console.log('文件内容:', contents);
				return {
					contents: contents,
				};
			});
			build.onEnd(({ errors }: any) => {
				console.log(errors);
				if (!errors.length) {
					let data = fs.readFileSync('./src/hooks/tamperMonkey/tools/dist/bundle.js', { encoding: 'utf-8' });
					data = data.replace(/^export.*?{.*?}.*?;/gms, e => {
						console.log(e);
						return '';
					});
					fs.writeFileSync('./src/hooks/tamperMonkey/tools/dist/bundle.js', prefixCode(containerID, data), {
						encoding: 'utf-8',
					});
				}
			});
		},
	};
};
