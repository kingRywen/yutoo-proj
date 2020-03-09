export function seriesMethod(vm,arr,selection,dialogParams){
	let params = {...vm.storeIds}
	let data = selection.map((e)=>{return e.objectId})
	if(selection && selection.length === 0) return vm.$message.warning('请选择至少一项')
	if(arr[0] === '调整预算' || arr[0] === '调整出价'){
		switch(arr[1]){
			case '新增':
				return vm.showDialogGlobal(`新增定时${arr[0]}策略`, '1010px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/addBudget.vue'), '确认', '取消','10vh')
			break;
			case '编辑':
				dialogParams.edit = true
				return vm.showDialogGlobal(`编辑定时${arr[0]}策略`, '1010px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/addBudget.vue'), '确认', '取消','10vh')
			break;
			case '关闭':
				params.strategyType = vm.strategyType
				params.status = 0
				params.objectIds = data
				return vm.showConfirmGlobal('adManualUpdateStrategyStatus',params,`关闭定时${arr[0]}策略`)
			break;
			case '开启':
				params.strategyType = vm.strategyType
				params.status = 1
				params.objectIds = data
				return vm.showConfirmGlobal('adManualUpdateStrategyStatus',params,`开启定时${arr[0]}策略`)
			break;
			case '删除':
				params.strategyType = vm.strategyType
				params.objectIds = data
				params.url = 'adManualRemoveStrategy'
				return vm.showDialogGlobal('提示', '500px', params, () => import('Views/SuDemo/manual/dialogs/main/new/strategyDel.vue'), '确认', '取消')
			break;		
		}
	} else if(arr[0] === '否定词'){
		switch(arr[1]){
			case '新增':
				return vm.showDialogGlobal('新增否定词策略', '1120px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/noWord.vue'), '确认', '取消','10vh')
			break;
			case '编辑':
				dialogParams.edit = true
				return vm.showDialogGlobal('编辑否定词策略', '1120px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/noWord.vue'), '确认', '取消','10vh')
			break;
			case '关闭':
				params.strategyType = vm.strategyType
				params.status = 0
				params.objectIds = data
				return vm.showConfirmGlobal('adManualNtUpdateStatus',params,'关闭否定词策略')
			break;
			case '开启':
				params.strategyType = vm.strategyType
				params.status = 1
				params.objectIds = data
				return vm.showConfirmGlobal('adManualNtUpdateStatus',params,'开启否定词策略')
			break;
			case '删除':
				params.strategyType = vm.strategyType
				params.objectIds = data
				params.url = 'adManualNtRemove'
				return vm.showDialogGlobal('提示', '500px', params, () => import('Views/SuDemo/manual/dialogs/main/new/strategyDel.vue'), '确认', '取消')
			break;
		}
	} else if(arr[0] === '调价策略'){
		switch(arr[1]){
			case '新增':
				
			break;
			case '编辑':
				
			break;
			case '关闭':
				
			break;
			case '开启':
				
			break;
		}
	} else if(arr[0] === '降CPC'){
		switch(arr[1]){
			case '新增':
				
			break;
			case '编辑':
				
			break;
			case '关闭':
				
			break;
			case '开启':
				
			break;
		}
	} else if(arr[0] === '广告产品暂停'){
		switch(arr[1]){
			case '新增':
				return vm.showDialogGlobal('新增广告产品暂停策略', '1120px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/adStop.vue'), '确认', '取消','10vh')
			break;
			case '编辑':
				dialogParams.edit = true
				return vm.showDialogGlobal('编辑广告产品暂停策略', '1120px', dialogParams, () => import('Views/SuDemo/manual/dialogs/main/strategy/adStop.vue'), '确认', '取消','10vh')
			break;
			case '关闭':
				params.strategyType = vm.strategyType
				params.status = 0
				params.objectIds = data
				return vm.showConfirmGlobal('adManualPausedUpdateStatus',params,'关闭广告产品暂停策略')
			break;
			case '开启':
				params.strategyType = vm.strategyType
				params.status = 1
				params.objectIds = data
				return vm.showConfirmGlobal('adManualPausedUpdateStatus',params,'开启广告产品暂停策略')
			break;
			case '删除':
				params.strategyType = vm.strategyType
				params.objectIds = data
				params.url = 'adManualPausedRemove'
				return vm.showDialogGlobal('提示', '500px', params, () => import('Views/SuDemo/manual/dialogs/main/new/strategyDel.vue'), '确认', '取消')
			break;
		}
	} else if(arr[0] === '广告排名策略'){
		switch(arr[1]){
			case '新增':
				
			break;
			case '编辑':
			
			break;
			case '关闭':
			
			break;
			case '开启':

			break;
		}
	}
}


