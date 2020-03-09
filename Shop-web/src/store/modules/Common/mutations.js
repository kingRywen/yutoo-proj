export default {
    sellerData(state, arg) {
        state.sellerData = arg
    },
    clearCate(state, arg) {
        state.clearCate = arg
    },
    siteId__(state, arg) {
        state.siteId__ = arg
    },
    select_parentSku(state, arg) {
        state.select_parentSku = arg
    },
	select_parentSkuMain(state, arg) {
	    state.select_parentSkuMain = arg
	},
	select_childSku(state, arg) {
	    state.select_childSku = arg
	},
    stateData(state, arg) {
        state.stateData = arg
    },
    seller_Name(state, arg) {
        state.seller_Name = arg
    },
	seller_Img(state, arg) {
	    state.seller_Img = arg
	},
    parentSkus(state, arg) {
        state.parentSkus = arg
    },
    // 已选父
    selectParentSkus(state, arg) {
        state.selectParentSkus = arg
    },
    // 已选子
    selectChildSkus(state, arg) {
        state.selectChildSkus = arg
    },
    childSkus(state, arg) {
        state.childSkus = arg
    },
    childSkus_1(state, arg) {
        state.childSkus_1 = arg
    },
    isChildSku(state, arg) {
        state.isChildSku = arg
    },
    // 告诉父组件请求列表
    afterDelGetList(state, arg) {
        state.afterDelGetList = arg
    },
	routerType(state,arg){
		state.routerType = arg
	},
	
	parentSkusAll(state,arg){
		state.parentSkusAll = arg
	},
	childSkusAll(state,arg){
		state.childSkusAll = arg
	}
}
