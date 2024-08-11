import fs from 'fs';

const prefixCode = (code: string = '', importCode: string = '', importMapCode: string = '') => {
	return `// ==UserScript==
    // @name         harverTools
    // @version      0.8.2
    // @description  浩文自用
    // @author       harver
    // @match        https://www.bilibili.com/video/*
    // @grant        none
    // @run-at document-idle
    // ==/UserScript==
    "use strict";
	${importMapCode}
	var moduleScript = document.createElement('script');
	moduleScript.async = true;
	moduleScript.type = 'module';
	moduleScript.defer = true;
	function runCodeFn(){
		console.log('【harver tools】开始执行')
		${code}
	}
	moduleScript.innerHTML=\`${importCode}\n
	const runCodeFn = \${runCodeFn};
	runCodeFn();\`
	document.body.append(moduleScript);
    `;
};
export default (_path: string, importHandle?: (code: string) => [string, string, string[]]) => {
	// const filePath = path.resolve(__dirname, _path);
	const tidyUpImportString = importHandle
		? importHandle
		: (code: string): [string, string, string[]] => {
				const pattern = /(?<i>import.*?from.*?('|").*?('|");?)/gm;
				const importArray: string[] = [];
				code = code.replace(pattern, str => {
					importArray.push(str);
					return '';
				});
				const importMapCode = '';
				return [code, importMapCode, importArray];
		  };
	return {
		name: 'tamperMonkey',
		setup(build: any) {
			build.onEnd(({ errors }: any) => {
				errors.length && console.log(errors);
				if (!errors.length) {
					let data = fs.readFileSync(_path, { encoding: 'utf-8' });
					const [code, importMapCode, importArray] = tidyUpImportString(data);
					fs.writeFileSync(_path, prefixCode(code, importArray.join('\n'), importMapCode), {
						encoding: 'utf-8',
					});
				}
			});
		},
	};
};
