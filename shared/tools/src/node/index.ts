import fs from 'fs';
import path from 'path';

function getStat(path: string) {
	return new Promise(resolve => {
		fs.stat(path, (err, stats) => {
			if (err) {
				resolve(false);
			} else {
				resolve(stats);
			}
		});
	});
}

export async function deepMkDir(dir: string) {
	const isExists = await getStat(dir);

	//如果该路径且不是文件，返回true
	if (isExists && (isExists as fs.Stats).isDirectory()) {
		return true;
	} else if (isExists) return false;
	//如果该路径不存在，拿到上级路径
	const parentDir = path.parse(dir).dir;
	//递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
	const status = await deepMkDir(parentDir);

	if (status) {
		return await mkdir(dir);
	}
}
/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir: string) {
	return new Promise(resolve => {
		fs.mkdir(dir, err => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}
