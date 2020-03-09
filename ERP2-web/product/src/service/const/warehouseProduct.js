export default [
	{
		name: 'combinationProductFlag',
		desc: '产品单选',
		value: [{
				label: "所有产品",
				value: null
			},
			{
				label: "单件产品",
				value: 0
			},
			{
				label: "组合产品",
				value: 1
			}
		],
	},
	{
		name: 'productType',
		desc: '产品类型下拉选项',
		value: [{
				label: "普通产品",
				value: 0
			},
			{
				label: "原材料",
				value: 1
			}
		],
	},
	{
		name: 'sourceType',
		desc: '产品来源下拉选项',
		value: [{
				label: "自主创建",
				value: 1
			},
			{
				label: "销售提报",
				value: 2
			},
			{
				label: "平台采集",
				value: 3
			},
			{
				label: "供应商提报",
				value: 4
			},
		],
	},
	{
		name: 'presaleFlag',
		desc: '预售属性',
		value: [{
				label: "预售",
				value: 1
			},
			{
				label: "不预售",
				value: 0
			}
		],
	},
	{
		name: 'photoFlag',
		desc: '是否需要拍照',
		value: [{
				label: '需要',
				value: 1
			},
			{
				label: '不需要',
				value: 0
			}
		]
	},
	{
		name: 'auditStatus',
		desc: '审核状态',
		value: [{
				label: '未审核',
				value: 1
			},
			{
				label: '通过',
				value: 2
			},
			{
				label: '未通过',
				value: 3
			}
		]
	},
	{
		name: 'produceStatus',
		desc: '变体状态',
		value: [{
				label: '正常',
				value: 0
			},
			{
				label: '停产',
				value: 1
			},
			{
				label: '缺货',
				value: 2
			},
			{
				label: '清货',
				value: 3
			}
		]
	}
]
