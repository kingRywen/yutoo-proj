const OPTIONS = {
	topLeftBtnOption:[
		{
			label: '审核',
			children: [
				{
					label: '基础信息审核通过'
				},
				{
					label: '基础信息审核不通过'
				},
				{
					label: '采购信息审核通过'
				},
				{
					label: '采购信息审核不通过'
				}
			]
		},
		{
			label: '废除'
		},
		{
			label: '取消废除'
		},
		{
			label: '删除'
		},
		{
			label: '锁定'
		},
		{
			label: '取消锁定'
		},
		{
			label: '设置变体状态',
			children: [
				{
					label: '正常'
				},
				{
					label: '缺货'
				},
				{
					label: '停产'
				}
			]
		},
		{
			label: '分配人员',
			children: [
				{
					label: '分配开发人员'
				},
				{
					label: '分配采购人员'
				}
			]
		},
		{
			label: '自定义导出'
		}
	]
}




export default { OPTIONS }