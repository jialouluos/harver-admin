// scripts/dev.js
import chalk from 'chalk';
import enquirer from 'enquirer';
import { execa } from 'execa';

import detect from 'detect-port';

import { PACKAGE_ENUM, packagesConfig } from '@jialouluo/configs/src/configs/packages.js';

// 已占用端口列表
type PortInfo = {
	package: PACKAGE_ENUM;
	isOccupied: boolean;
};
const portMap = new Map<PACKAGE_ENUM, boolean>(); //<packageName,isRun>

const checkPorts = (Object.keys(packagesConfig) as PACKAGE_ENUM[]).map(
	key =>
		new Promise<PortInfo>(resolve => {
			(detect(packagesConfig[key].port) as Promise<number>).then(port => {
				resolve({
					package: key,
					isOccupied: port !== packagesConfig[key].port,
				});
			});
		})
);

// 运行选择命令
function runInquirerCommand() {
	enquirer
		.prompt<{ value: string }>([
			{
				name: 'value', // 在最后获取到的answers回答对象中，作为当前这个问题的键
				type: 'autocomplete',
				message: '请选择要启动的子应用', // 打印出来的问题标题
				choices: Object.keys(packagesConfig) // 给出一个选择的列表，
					.filter(item => item !== 'base')
					.map(key => {
						const { name, alias, port } = packagesConfig[key];
						return {
							name: `${name}(${alias})[port:${port}]`,
							value: key,
							disabled: !!portMap.get(key as PACKAGE_ENUM) ? '已启动' : false,
						};
					}),
			},
		])
		.then(async answers => {
			await execa('pnpm', ['run', 'dev'], {
				cwd: `./packages/${answers.value}`,
				stdio: 'inherit',
			});
		})
		.catch(err => {
			console.log(`选择被取消(${err.message})`);
		});
}

Promise.all(checkPorts).then(async ports => {
	let isBreak = true;
	for (const portInfo of ports) {
		portMap.set(portInfo.package, portInfo.isOccupied);
		isBreak = portInfo.isOccupied && isBreak;
	}
	if (isBreak) {
		console.log(chalk.yellowBright.bold('---- 子应用已全部启动 ----'));
		console.table(
			Array.from(portMap.keys()).map(key => {
				return { key, port: packagesConfig[key].port, alias: packagesConfig[key].alias };
			})
		);
		return;
	}
	if (portMap)
		if (!portMap.get(PACKAGE_ENUM.BASE)) {
			await execa('pnpm', ['run', 'dev'], {
				cwd: '.',
				stdio: 'inherit',
			});
		} else {
			runInquirerCommand();
		}
});
