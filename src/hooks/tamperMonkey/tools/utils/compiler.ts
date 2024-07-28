const { parse, compileScript, compileTemplate, rewriteDefault, compileStyle } = require('@vue/compiler-sfc');
import fs from 'fs';
import { build } from 'esbuild';
import addRemoteScriptPlugin from './addRemoteScriptPlugin';
import tamperMonkeyPlugin from './tamperMonkeyPlugin';
import { externalGlobalPlugin } from 'esbuild-plugin-external-global';

const file = await fs.readFileSync('./src/hooks/tamperMonkey/tools/src/index.vue', {
	encoding: 'utf-8',
});
try {
	const codeList = [];
	const id = Date.now().toString(); // 这个 id 是 scopeId，用于 css scope，保证唯一即可
	const scopeId = `data-v-${id}`;
	const containerID = 'hw_tools_app_' + scopeId;

	const { descriptor, error } = parse(file);
	if (error) {
		throw error;
	}

	// 编译 script，因为可能有 script setup，还要进行 css 变量注入
	const script = compileScript(descriptor, { id: scopeId });
	// console.log(script);

	codeList.push(rewriteDefault(script.content, '__sfc_main__'));
	codeList.push(`__sfc_main__.__scopeId='${scopeId}'`);

	const template = compileTemplate({
		source: descriptor.template.content,
		filename: 'index.vue', // 用于错误提示
		id: scopeId,
	});

	codeList.push(template.code);
	codeList.push(`__sfc_main__.render=render`);
	for (const styleBlock of descriptor.styles) {
		const styleCode = compileStyle({
			source: styleBlock.content,
			id: scopeId, // style 的 scope id，
			filename: 'index.vue',
			scoped: styleBlock.scoped,
		});
		const styleDOM = `
const el = document.createElement('style')
el.innerHTML =  \`${styleCode.code}\`
document.body.append(el);
`;
		codeList.push(styleDOM);
	}

	const code = codeList.join('\n');

	await fs.writeFile('./src/hooks/tamperMonkey/tools/dist/build.temp.js', code, err => {
		console.log(err);
	});

	await build({
		entryPoints: ['./src/hooks/tamperMonkey/tools/dist/build.temp.js'], // 入口文件
		format: 'esm', // 打包成 esm
		outfile: './src/hooks/tamperMonkey/tools/dist/bundle.js', // 设置打包文件的名字
		bundle: true, // bundle 为 true 才是打包模式
		external: ['vue'],
		plugins: [
			externalGlobalPlugin({
				vue: 'window.Vue', // 将 import vue 模块，替换成 window.Vue
			}) as any,
			addRemoteScriptPlugin(containerID),
			tamperMonkeyPlugin(),
		],
	});
} catch (error: any) {
	console.log('error:', error.message);
}
