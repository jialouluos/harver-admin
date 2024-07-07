module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-standard-vue'],

	plugins: ['stylelint-order'],
	// // 不同格式的文件指定自定义语法
	overrides: [
		// {
		// 	files: ['**/*.(less|css|html|vue)'],
		// 	customSyntax: 'postcss-less',
		// },
		// {
		// 	files: ['**/*.{scss,css,sass}'], // css 相关文件由 postcss-scss 处理
		// 	customSyntax: 'postcss-scss',
		// },
		// {
		// 	files: ['**/*.(html|vue)'],
		// 	customSyntax: 'postcss-html',
		// },
		// {
		// 	files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
		// 	rules: {
		// 		'keyframes-name-pattern': null,
		// 		'selector-pseudo-class-no-unknown': [
		// 			true,
		// 			{
		// 				ignorePseudoClasses: ['deep', 'global'],
		// 			},
		// 		],
		// 		'selector-pseudo-element-no-unknown': [
		// 			true,
		// 			{
		// 				ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
		// 			},
		// 		],
		// 	},
		// },
	],
	ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md', '**/*.yaml'],
	rules: {
		'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
		'no-invalid-double-slash-comments': true, //禁止 CSS 不支持并可能导致意外结果的双斜杠注释（//...）
		// 'scss/dollar-variable-pattern': /[a-z][a-zA-Z]+/,
		'scss/dollar-variable-pattern': /^[a-z][a-zA-Z]+$/, //变量名规范
		// // mixin变量名支持全部字符
		'scss/at-mixin-pattern': /^[a-z]+(_[a-z0-9]+)*$/, //mixin变量名规范
		'scss/operator-no-unspaced': true, //  /前的空格校验
		'block-no-empty': true, // 禁止空块

		'selector-class-pattern': '.', // 类选择器的命名规则
		'scss/no-global-function-names': null, //禁止scss全局函数直接使用
		'scss/at-function-pattern': /^[a-z][a-zA-Z]+$/, //@function命名规则
		'function-name-case': [
			//指定函数名的大小写。
			'lower',
			{
				ignoreFunctions: [/^[a-z][a-zA-Z]+$/],
			},
		],
		'length-zero-no-unit': true, //0值不用单位
		'at-rule-no-unknown': [
			//禁止未知的 at 规则。
			true,
			{
				ignoreAtRules: [
					// additional scss at-rules:
					'content',
					'each',
					'else',
					'error',
					'extend',
					'for',
					'function',
					'if',
					'include',
					'mixin',
					'return',
				],
			},
		],
		'function-no-unknown': null,
		'import-notation': null, //指定@import规则的字符串或 URL 表示法。
		// 指定样式的排序
		'order/properties-order': [
			'position',
			'top',
			'right',
			'bottom',
			'left',
			'z-index',
			'display',
			'justify-content',
			'align-items',
			'float',
			'clear',
			'overflow',
			'overflow-x',
			'overflow-y',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'width',
			'min-width',
			'max-width',
			'height',
			'min-height',
			'max-height',
			'font-size',
			'font-family',
			'text-align',
			'text-justify',
			'text-indent',
			'text-overflow',
			'text-decoration',
			'white-space',
			'color',
			'background',
			'background-position',
			'background-repeat',
			'background-size',
			'background-color',
			'background-clip',
			'border',
			'border-style',
			'border-width',
			'border-color',
			'border-top-style',
			'border-top-width',
			'border-top-color',
			'border-right-style',
			'border-right-width',
			'border-right-color',
			'border-bottom-style',
			'border-bottom-width',
			'border-bottom-color',
			'border-left-style',
			'border-left-width',
			'border-left-color',
			'border-radius',
			'opacity',
			'filter',
			'list-style',
			'outline',
			'visibility',
			'box-shadow',
			'text-shadow',
			'resize',
			'transition',
		],
	},
};
