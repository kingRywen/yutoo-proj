export function tabsDataFn(arr){
	let oldArr = arr.slice(0)
	for(var i of oldArr){
		i.name = i.name.replace(')','').split('(')
	}
	let newArr = oldArr.map(e=>{
		return {
			name:e.name[0],
			num:e.name[1]
		}
	})
	for(var i of newArr){
		i.name = i.name.replace(/\s/g,'')
		i.num = i.num.replace(/\s/g,'')
	}
	let sortArr = [
		newArr.find(e=>e.name === '正常').num,
		newArr.find(e=>e.name === '基本信息待编辑').num,
		newArr.find(e=>e.name === '基本信息待审核').num,
		newArr.find(e=>e.name === '采购信息待编辑').num,
		newArr.find(e=>e.name === '采购信息待审核').num,
		newArr.find(e=>e.name === '作废').num,
		newArr.find(e=>e.name === '锁定').num,
		newArr.find(e=>e.name === '所有').num,
	]
	return sortArr
}

export function getPeople(type,vm){
	let params = {}
	if(type === 'KF') params.types = ['Develop'] 
	if(type === 'CG') params.types = ['Purchase'] 
	return vm.$api['product/permissionUserList'](params).then((res)=>{
		if(type === 'KF'){
			let obj = res.rows.find(e=>e.type === 'Develop')
			let result1 = obj.users.map(e => {
				return {
					label:e.userName,
					value:e.userId
				}
			})
			return result1
		}
		if(type === 'CG'){
			let obj1 = res.rows.find(e=>e.type === 'Purchase')
			let result2 = obj1.users.map(e => {
				return {
					label:e.userName,
					value:e.userId
				}
			})
			return result2
		}
	})
}

export function topLeftBtnFn(vm,arr,selection){
	let params = {}
	params.productRepoIds = selection.map(e=>e.productRepoId)
	if(arr.length === 1){		
		switch(arr[0]){
			case '废除':
				params.cancelStatus = 1
				return vm.showConfirmGo('product/prProductRepoCancel',params,'废除')
			break;
			case '取消废除':
				params.cancelStatus = 2
				return vm.showConfirmGo('product/prProductRepoCancel',params,'取消废除')
			break;
			case '删除':
				return vm.showConfirmGo('product/prProductRepoDelete',params,'删除')
			break;
			case '锁定':
				params.lockStatus = 1
				return vm.showConfirmGo('product/prProductRepoLock',params,'锁定')
			break;
			case '取消锁定':
				params.lockStatus = 2
				return vm.showConfirmGo('product/prProductRepoLock',params,'取消锁定')
			break;
			case '自定义导出':
				return vm.showDialog('自定义导出','100%',{saveName:'44'}, () => import('@/views/modules/product/common/base/index/dialogs/warehouseExport.vue'), '确认', '取消')
			break;
		}
	}
	if(arr.length === 2){		
		if(arr[0] === '审核'){
			switch(arr[1]){
				case '基础信息审核通过':
					params.auditStatus = 1
					params.auditType = 1
					return vm.showConfirmGo('product/prProductRepoExamine',params,'基础信息审核通过')
				break;
				case '基础信息审核不通过':
					params.auditStatus = 0
					params.auditType = 1
					return vm.showConfirmGo('product/prProductRepoExamine',params,'基础信息审核不通过')
				break;
				case '采购信息审核通过':
					params.auditStatus = 1
					params.auditType = 2
					return vm.showConfirmGo('product/prProductRepoExamine',params,'采购信息审核通过')
				break;
				case '采购信息审核不通过':
					params.auditStatus = 0
					params.auditType = 2
					return vm.showConfirmGo('product/prProductRepoExamine',params,'采购信息审核不通过')
				break;
			}
		}
		if(arr[0] === '设置变体状态'){
			switch(arr[1]){
				case '正常':
					params.produceStatus = 0
					return vm.showConfirmGo('product/prProductRepoSetStatus',params,'设置变体状态为正常')
				break;
				case '缺货':
					params.produceStatus = 2
					return vm.showConfirmGo('product/prProductRepoSetStatus',params,'设置变体状态为缺货')
				break;
				case '停产':
					params.produceStatus = 1
					return vm.showConfirmGo('product/prProductRepoSetStatus',params,'设置变体状态为停产')
				break;
			}
		}
		if(arr[0] === '分配人员'){
			switch(arr[1]){
				case '分配开发人员':
					params.assignmentType = 1
					return vm.showConfirmGo('product/prProductRepoAssignment',params,'分配开发人员')
				break;
				case '分配采购人员':
					params.assignmentType = 2
					return vm.showConfirmGo('product/prProductRepoAssignment',params,'分配采购人员')
				break;
			}
		}
	}
}