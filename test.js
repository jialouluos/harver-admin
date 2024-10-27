const filterTree = (rootNode, prop, filterFn) => {
	const resultArray = [];

	const handleArray = Array.isArray(rootNode) ? rootNode : rootNode[prop];

	for (const object of handleArray) {
		if (filterFn(object)) {
			resultArray.push(filterTree(object, prop, filterFn));
		} else {
			resultArray.push(...filterTree(object[prop], prop, filterFn));
		}
	}

	if (Array.isArray(rootNode)) {
		return resultArray;
	} else {
		return filterFn(rootNode)
			? {
					...rootNode,
					[prop]: resultArray,
			}
			: resultArray;
	}
};
const testObj = {
	layer: 1,
	value: true,
	children: [
		{
			layer: 2,
			value: true,
			children: [
				{
					layer: 3,
					value: true,
					children: [],
				},
				{
					layer: 3,
					value: false,
					children: [
						{
							layer: 4,
							value: true,
							children: [],
						},
						{
							layer: 4,
							value: true,
							children: [],
						},
					],
				},
			],
		},
		{
			layer: 2,
			value: false,
			children: [
				{
					layer: 3,
					value: false,
					children: [
						{
							layer: 4,
							value: true,
							children: [],
						},
						{
							layer: 4,
							value: true,
							children: [],
						},
					],
				},
			],
		},
		{
			layer: 2,
			value: true,
			children: [
				{
					layer: 3,
					value: false,
					children: [
						{
							layer: 4,
							value: true,
							children: [],
						},
						{
							layer: 4,
							value: true,
							children: [],
						},
					],
				},
			],
		},
	],
};
const testObj2 = [
	{
		layer: 1,
		value: true,
		children: [
			{
				layer: 2,
				value: true,
				children: [
					{
						layer: 3,
						value: true,
						children: [],
					},
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
			{
				layer: 2,
				value: false,
				children: [
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
			{
				layer: 2,
				value: true,
				children: [
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
		],
	},
	{
		layer: 1,
		value: false,
		children: [
			{
				layer: 2,
				value: true,
				children: [
					{
						layer: 3,
						value: true,
						children: [],
					},
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
			{
				layer: 2,
				value: false,
				children: [
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
			{
				layer: 2,
				value: true,
				children: [
					{
						layer: 3,
						value: false,
						children: [
							{
								layer: 4,
								value: true,
								children: [],
							},
							{
								layer: 4,
								value: true,
								children: [],
							},
						],
					},
				],
			},
		],
	},
];
console.log('-------分割线 testObj↓----------');
console.log(JSON.stringify(filterTree(testObj, 'children', obj => obj.value)));
console.log('-------分割线 testObj↑----------');
console.log('-------分割线 testObj2↓----------');
console.log(JSON.stringify(filterTree(testObj2, 'children', obj => obj.value)));
console.log('-------分割线 testObj2↑----------');
