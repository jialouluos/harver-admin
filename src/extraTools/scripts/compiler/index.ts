import { parse, compileScript, compileTemplate, compileStyle, type SFCDescriptor } from 'vue/compiler-sfc';
import fs from 'fs';
import { build } from 'esbuild';
import tamperMonkeyPlugin from '../../plugins/tamperMonkeyPlugin';

import path from 'path';
import { deepMkDir } from '@jialouluo/tools/node';
import { defaultImportMap } from '../../constant';

export class CompilerCore {
	author: string;
	uuid: string;
	scopeId: string;
	containerId: string;
	fileContent: string;
	descriptor: SFCDescriptor | null = null;
	scriptCode!: string;
	templateCode!: string;
	code: string = '';
	outPath: string = '';
	outTempPath: string = '';
	componentName: string = '';
	entryPath: string = '';
	importProps: string[] = [];
	scopeProps: string[] = [];
	constructor(
		private namespace: string,
		options: {
			componentName?: string;
			author?: string;
			entryPath?: string;
			outPath?: string;
			outTempPath?: string;
		} = {}
	) {
		const {
			author = 'harver',
			componentName = '__HARVER_COMPONENT__',
			entryPath = '',
			outTempPath = '../../dist/temp/last.temp.ts',
			outPath = '../../dist/index.js',
		} = options;
		this.componentName = componentName;
		this.outTempPath = outTempPath;
		this.author = author;
		this.entryPath = entryPath;
		this.outPath = outPath;
		this.uuid = `${this.author}_${Date.now().toString().slice(0, 5)}`;
		this.scopeId = `data-v-${this.uuid}`;
		this.containerId = `${this.author}_app_root_${this.scopeId}`;
		this.fileContent = '';
	}
	async writeFile(content: string, _path: string) {
		const prefixPath = path.resolve(__dirname, _path);

		await deepMkDir(path.dirname(prefixPath));
		fs.writeFileSync(prefixPath, content, {
			encoding: 'utf-8',
		});
	}
	globalRegister = (_Vue: any, component: string) => {
		_Vue.component(this.componentName, component);
	};
	async loadFile() {
		this.fileContent = fs.readFileSync(path.resolve(__dirname, this.entryPath), { encoding: 'utf-8' });
	}
	async parseFileContent() {
		if (!this.fileContent) return;
		const { descriptor, errors } = parse(this.fileContent);

		if (errors && errors.length) {
			throw errors;
		}

		this.descriptor = descriptor;
	}
	async compileScript() {
		if (!this.descriptor) return;

		const scriptStep1 = compileScript(this.descriptor, {
			id: this.scopeId,
		});

		// this.writeFile(scriptStep1.content, './temp/script-step-1.temp.ts');

		const scriptStep2 = scriptStep1.content.replace('export default', `window.${this.namespace} =`);

		// this.writeFile(scriptStep2, './temp/script-step-2.temp.ts');

		this.scriptCode = scriptStep2;
		this.code += this.scriptCode;
		this.code += `window.${this.namespace}.__scopeId = '${this.scopeId}';\n`;
	}

	async compilerTemplate() {
		if (!this.descriptor || !this.descriptor.template) return;

		const templateStep1 = compileTemplate({
			source: this.descriptor.template.content,
			filename: this.descriptor.filename, // 用于错误提示
			id: this.scopeId,
		});

		// this.writeFile(templateStep1.code, './temp/template-step-1.temp.ts');

		const templateStep2 = templateStep1.code.replace(
			'export function render',
			`window.${this.namespace}.render = function render`
		);

		// this.writeFile(templateStep2, './temp/template-step-2.temp.ts');

		this.templateCode = templateStep2;
		this.code += this.templateCode;
	}
	async compileStyles() {
		if (!this.descriptor) return;

		const styles = this.descriptor.styles;

		// const hasScoped = styles.some(item => item.scoped);

		const styleCodes = styles.map(style => {
			return compileStyle({
				source: style.content,
				id: this.scopeId,
				filename: this.descriptor!.filename,
				scoped: style.scoped,
			}).code;
		});
		styleCodes.forEach((code, index) => {
			this.writeFile(code, `../../dist/temp/style-slice-${index}.temp.ts`);

			const styleDOM = `\nconst el = document.createElement('style')
el.innerHTML =  \`${code}\`
document.body.append(el);`;
			this.code += styleDOM;
		});
	}
	async compiler() {
		await this.loadFile();
		await this.parseFileContent();
		await this.compileScript();
		await this.compilerTemplate();
		await this.compileStyles();
		this.insertRenderNode();
		await this.writeFile(this.code, this.outTempPath);
	}
	filterImportMap(importMap: { imports: Record<string, any>; scopes: Record<string, any> }, importProps: string[]) {
		return Object.keys(importMap['imports']).reduce((pre, cur) => {
			importProps.includes(cur) && (pre[cur] = importMap['imports'][cur]);
			return pre;
		}, <Record<string, any>>{});
	}
	filterScopeMap(importMap: { imports: Record<string, any>; scopes: Record<string, any> }, scopeProps: string[]) {
		return Object.keys(importMap['scopes']).reduce((pre, cur) => {
			scopeProps.includes(cur) && (pre[cur] = importMap['scopes'][cur]);
			return pre;
		}, <Record<string, any>>{});
	}
	generateImportMaps(imports: Record<string, any>, scopes: Record<string, any>) {
		const importScriptCode = `
var esModuleScript = document.createElement('script');
esModuleScript.async = true;
esModuleScript.src = 'https://cdn.jsdelivr.net/npm/es-module-shims@1.5.18/dist/es-module-shims.wasm.js';
document.head.append(esModuleScript);
const importMapScript = document.createElement('script');
importMapScript.type = 'importmap';
importMapScript.innerHTML = \`{
	"imports":${JSON.stringify(imports)},
	"scopes":${JSON.stringify(scopes)}
}\`
document.head.before(importMapScript);
`;
		return importScriptCode;
	}
	insertRenderNode() {
		const renderCode = `
		import {createApp} from 'vue';

		const hw_tools_div = document.createElement('div');
		hw_tools_div.id = '${this.containerId}';
		document.body.append(hw_tools_div)
		const app = createApp(window.${this.namespace});

		app.mount('#' + '${this.containerId}')`;
		this.code += renderCode;
	}
	tidyUpImportString(code: string, prefixCode: string = ''): [string, string[]] {
		const pattern = /(?<i>import.*?from.*?('|").*?('|");?)/gm;
		const importArray: string[] = [prefixCode];
		const _code = code.replace(pattern, str => {
			importArray.push(str);
			return '';
		});
		return [_code, importArray];
	}
	async build(
		options: {
			outPath?: string;
			importProps?: string[];
			scopeProps?: string[];
		} = {}
	) {
		const { importProps = [], scopeProps = [], outPath = this.outPath } = options;
		const prefixOutPath = path.resolve(__dirname, outPath);
		this.importProps = importProps;
		this.scopeProps = scopeProps;
		await build({
			entryPoints: [path.resolve(__dirname, this.outTempPath)], // 入口文件
			format: 'esm', // 打包成 esm
			outfile: prefixOutPath, // 设置打包文件的名字
			bundle: true, // bundle 为 true 才是打包模式
			external: this.importProps,
			plugins: [
				tamperMonkeyPlugin(prefixOutPath, _ => {
					const importMapCode = this.generateImportMaps(
						this.filterImportMap(defaultImportMap, importProps),
						this.filterScopeMap(defaultImportMap, scopeProps)
					);
					const [code, importArray] = this.tidyUpImportString(_);
					return [code, importMapCode, importArray];
				}),
			],
		});
	}
}

try {
	const compilerCore = new CompilerCore('__harver_APP__', {
		entryPath: '../../src/index.vue',
	});
	await compilerCore.compiler();
	await compilerCore.build({
		importProps: ['vue', 'ant-design-vue'],
	});
} catch (error: any) {
	if (Array.isArray(error)) {
		error.forEach(item => {
			console.log('error:', item.message);
		});
	} else {
		console.log('error:', error.message);
	}
}
