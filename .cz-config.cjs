module.exports = {
	// 可选类型
	types: [
		{ value: 'feat', name: `${'feat'.padEnd(10)}新功能` },
		{ value: 'fix', name: `${'fix'.padEnd(10)}修复` },
		{ value: 'docs', name: `${'docs'.padEnd(10)}文档变更` },
		{ value: 'style', name: `${'style'.padEnd(10)}代码格式(不影响代码运行的变动)` },
		{ value: 'refactor', name: `${'refactor'.padEnd(10)}重构(既不是增加feature，也不是修复bug)` },
		{ value: 'perf', name: `${'perf'.padEnd(10)}性能优化` },
		{ value: 'test', name: `${'test'.padEnd(10)}增加测试` },
		{ value: 'chore', name: `${'chore'.padEnd(10)}构建过程或辅助工具的变动` },
		{ value: 'revert', name: `${'revert'.padEnd(10)}回退` },
		{ value: 'build', name: `${'build'.padEnd(10)}打包` },
	],
	// scope 类型（定义之后，可通过上下键选择）
	// scopes: [
	// 	['components', '组件相关'],
	// 	['hooks', 'hook 相关'],
	// 	['utils', 'utils 相关'],
	// 	['styles', '样式相关'],
	// 	['deps', '项目依赖'],
	// 	['auth', '对 auth 修改'],
	// 	['other', '其他修改'],
	// ].map(([value, description]) => {
	// 	return {
	// 		value,
	// 		name: `${value.padEnd(10)} (${description})`,
	// 	};
	// }),

	// scopeOverrides: {
	// 	fix: [{ name: 'feat' }, { name: 'style' }, { name: 'docs' }, { name: 'hooks' }],
	// },
	// 消息步骤
	messages: {
		type: '请选择提交类型:',
		// scope: '选择一个 scope (可选)',
		customScope: '请输入修改范围(可选):',
		subject: '请简要描述提交(必填):',
		body: '请输入详细描述(可选):',
		footer: '请输入要关闭的issue(可选):',
		confirmCommit: '确认使用以上信息提交？(y/n/e/h)',
	},

	skipQuestions: ['body', 'footer', 'scope'],
	// subject文字长度默认是72
	subjectLimit: 72,
};
