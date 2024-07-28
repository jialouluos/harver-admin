import fs from 'fs';
const prefixCode = (code: string = '') => {
	return `
    // ==UserScript==
    // @name         harverTools
    // @version      0.8.2
    // @description  浩文自用
    // @author       harver
    // @match        https://www.bilibili.com/video/*
    // @grant        none
    // @run-at document-start
    // ==/UserScript==
    "use strict";
    (function () {
    })();
    ${code}
    `;
};
export default () => {
	return {
		name: 'tamperMonkey',
		setup(build: any) {
			build.onEnd(({ errors }: any) => {
				console.log(errors);
				if (!errors.length) {
					let data = fs.readFileSync('./src/hooks/tamperMonkey/tools/dist/bundle.js', { encoding: 'utf-8' });
					fs.writeFileSync('./src/hooks/tamperMonkey/tools/dist/bundle.js', prefixCode(data), {
						encoding: 'utf-8',
					});
				}
			});
		},
	};
};
