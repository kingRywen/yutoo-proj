import { getProductAnalysisList, getShopAnalysisList } from '../../../api/myApi'

export default {
  // 竞品分析列表/ProductAnalysis/list
  async actionGetProductAnalysisList(
    { commit },
    params
  ) {
    try {
      // console.log("list发送的参数：", params.params)
      let data = await getProductAnalysisList(params.params)
      // alert(params._this)
      if (params._this) {
        params._this.page.total = data.data.total
        params._this.page.pageNo = data.data.pageNo
        params._this.page.totalPages = data.data.totalPages
      }
      // commit('setTotal', data.data.total)
      if (data && data.status === 200) { // 如果抓取不到数据，则改变数据显示字样
        // console.log("list响应的数据：", data)
        let list = data.data.rows
        list.forEach((v, i) => {
          v.buttonText = true
          if (v.status != 2) {
            v.buttonText = false
          }
          // if (v.category && v.category != "") {
          //   v.category = v.category.replace(/:/g, ">>")
          // }
          // if (v.monitorFlag != 1) { // 未处于监控状态的把起始时间设置为空
          //   v.monitorFrom = ""
          // }
          // if (v.status == 0 || v.status == 1) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sku' && k != 'taskId' && k != 'status' && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '系统正在努力抓取中...' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
          // if (v.status == 3) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sku' && k != 'taskId' && k != 'status' && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '抓取失败' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
        });
        let listData = data.data
        listData.rows = list
        commit('ProductAnalysisList', listData)
        params._this.tableHandle.tableType = "-1";
        params._this.inputText = ""
        setTimeout(() => {
          commit('tableLoading', false) // 去掉tableloading
        }, 200)
        return
      } else {
        // console.log("/ProductAnalysis/list状态码非200")
      }
    }
    catch (err) {
      console.log('/ProductAnalysis/list接口错误' + err)
      // commit('tableLoading', false) // 去掉tableloading
    }
  },
  // 模糊搜索/ProductAnalysis/list
  async actionSearchProductAnalysisList(
    { commit },
    params
  ) {
    try {
      // console.log("list发送的参数：", params.params)
      let data = await getProductAnalysisList(params.params)
      // alert(params._this)
      if (params._this) {
        // 
        params._this.page.total = data.data.total
        params._this.page.pageNo = data.data.pageNo
        params._this.page.totalPages = data.data.totalPages
      }
      // commit('setTotal', data.data.total)
      if (data && data.status === 200) { // 如果抓取不到数据，则改变数据显示字样
        // console.log("list响应的数据：", data)
        let list = data.data.rows
        list.forEach((v, i) => {
          v.buttonText = true
          if (v.status != 2) {
            v.buttonText = false
          }
          // if (v.category && v.category != "") {
          //   v.category = v.category.replace(/:/g, ">>")
          // }
          // v.buttonText = true
          // if (v.monitorFlag != 1) { // 未处于监控状态的把起始时间设置为空
          //   v.monitorFrom = ""
          // }
          // if (v.status == 0 || v.status == 1) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sku' && k != 'taskId' && k != 'status' && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '系统正在努力抓取中...' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
          // if (v.status == 3) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sku' && k != 'taskId' && k != 'status' && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '抓取失败' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
        });
        let listData = data.data
        listData.rows = list
        commit('ProductAnalysisList', listData)
        params._this.tableHandle.tableType = "1";// 对应wacth中的对inputText的监控，搜索返回数据之后切换成1
        setTimeout(() => {
          commit('tableLoading', false) // 去掉tableloading
        }, 200)
        return
      } else {
        // console.log("/ProductAnalysis/list状态码非200")
      }
    }
    catch (err) {
      // console.log('/ProductAnalysis/list接口错误' + err)
    }
  },
  // 店铺分析列表/shopAnalysis/list
  async actionGetShopAnalysisList(
    { commit },
    params
  ) {
    try {
      // console.log("list发送的参数：", params.params)
      let data = await getShopAnalysisList(params.params)
      // alert(params._this)
      if (params._this) {
        params._this.page.total = data.data.total
        params._this.page.pageNo = data.data.pageNo
        params._this.page.totalPages = data.data.totalPages
      }
      // commit('setTotal', data.data.total)
      if (data && data.status === 200) { // 如果抓取不到数据，则改变数据显示字样
        // console.log("list响应的数据：", data)
        let list = data.data.rows
        list.forEach((v, i) => {
          v.buttonText = true
          if (v.status != 2) {
            v.buttonText = false
          }
          // v.buttonText = true
          // if (v.monitorFlag != 1) { // 未处于监控状态的把起始时间设置为空
          //   v.monitorFrom = ""
          // }
          // if (v.status == 1 || v.status == 0) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sellerId' && k != 'taskId' && k != "status" && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '系统正在努力抓取中...' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
          // if (v.status == 3) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sellerId' && k != 'taskId' && k != "status" && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '抓取失败' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
        });
        let listData = data.data
        listData.rows = list
        commit('saveShopAnalysisList', listData)
        params._this.tableHandle.tableType = "-1";
        params._this.inputText = ""
        setTimeout(() => {
          commit('shopTableLoading', false) // 去掉tableloading
        }, 200)
        return
      } else {
        // console.log("/shopAnalysis/list状态码非200")
      }
    }
    catch (err) {
      // console.log('/shopAnalysis/list接口错误' + err)
      // commit('tableLoading', false) // 去掉tableloading
    }
  },
  // 模糊搜索/shopAnalysis/list
  async actionSearchShopAnalysisList(
    { commit },
    params
  ) {
    try {
      // console.log("list发送的参数：", params.params)
      let data = await getShopAnalysisList(params.params)
      // alert(params._this)
      if (params._this) {
        // 
        params._this.page.total = data.data.total
        params._this.page.pageNo = data.data.pageNo
        params._this.page.totalPages = data.data.totalPages
      }
      // commit('setTotal', data.data.total)
      if (data && data.status === 200) { // 如果抓取不到数据，则改变数据显示字样
        // console.log("list响应的数据：", data)
        let list = data.data.rows
        list.forEach((v, i) => {
          v.buttonText = true
          if (v.status != 2) {
            v.buttonText = false
          }
          // v.buttonText = true
          // if (v.monitorFlag != 1) { // 未处于监控状态的把起始时间设置为空
          //   v.monitorFrom = ""
          // }
          // if (v.status == 1 || v.status == 0) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sellerId' && k != 'taskId' && k != "status" && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '系统正在努力抓取中...' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
          // if (v.status == 3 && v.monitorFlag == 0) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sellerId' && k != 'taskId' && k != "status" && k != 'monitorFlag') {
          //       v[k] = ""
          //       v['sellerName'] = '抓取失败' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
          // if (v.status == 3 && v.monitorFlag == 1) { // 状态,0:待处理；1:处理中；2:处理成功；3:处理失败
          //   for (let k in v) {
          //     if (k != 'sellerId' && k != 'taskId' && k != "status" && k != 'monitorFlag' && k != 'monitorFrom' && k != 'monitorTo') {
          //       v[k] = ""
          //       v['sellerName'] = '抓取失败' // 未处理成功（！=2）显示抓取中
          //       v.buttonText = false
          //     }
          //   }
          // }
        });
        let listData = data.data
        listData.rows = list
        commit('saveShopAnalysisList', listData)
        params._this.tableHandle.tableType = "1";// 对应wacth中的对inputText的监控，搜索返回数据之后切换成1
        setTimeout(() => {
          commit('shopTableLoading', false) // 去掉tableloading
        }, 200)
        return
      } else {
        // console.log("shopAnalysis/list状态码非200")
      }
    }
    catch (err) {
      // console.log('shopAnalysis/list接口错误' + err)
    }
  }
}