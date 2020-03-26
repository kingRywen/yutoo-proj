import Vue from "vue";
import { STORAGE_NAME } from "@/_CONFIG";
let cacheProjInfo = sessionStorage.getItem(STORAGE_NAME + "_planInfo");
let selectProjProduct = sessionStorage.getItem(
  STORAGE_NAME + "_selectProjProduct"
);
let shipments = sessionStorage.getItem(STORAGE_NAME + "_shipments");
if (selectProjProduct) {
  selectProjProduct = JSON.parse(selectProjProduct);
}
if (cacheProjInfo) {
  cacheProjInfo = JSON.parse(cacheProjInfo);
}
if (shipments) {
  shipments = JSON.parse(shipments);
}
export const state = {
  // 运输方式列表
  transportList: [],
  // 发货地址列表
  addresses: [],
  // 当前计划详情
  planInfo: { latestIndex: 0 },
  // 创建计划时地址详情
  addressInfo: {},
  //  创建计划的步骤
  activeIndex: 0,
  // 当前货件装箱信息
  cartonInfo: [],
  // 当前计划货件清单
  shipments: shipments || [],
  ...cacheProjInfo,
  selectProjProduct: selectProjProduct || []
};
export const mutations = {
  setTransportList(state, data) {
    state.transportList = data;
  },
  setAddress(state, data) {
    state.addresses = data;
  },

  // 设置计划详情
  setPlanInfo(state, data) {
    state.planInfo = data;
    Vue.prototype.$storage.set("session", "planInfo", {
      planInfo: state.planInfo,
      addressInfo: state.addressInfo,
      activeIndex: state.activeIndex
    });
  },
  setCartonInfo(state, data) {
    state.cartonInfo = data;
  },
  // 设置计划的货件清单
  setShipments(state, data) {
    state.shipments = data;
    Vue.prototype.$storage.set("session", "shipments", data);
  },

  // 设置地址详情
  setAddressInfo(state, data) {
    state.addressInfo = data;
  },
  //  保存计划设置
  saveCreateInfo(state, active) {
    state.activeIndex = active != null ? active : state.activeIndex;
    state.planInfo.latestIndex = Math.max(
      active,
      state.planInfo.latestIndex || 0
    );
    Vue.prototype.$storage.set("session", "planInfo", {
      planInfo: state.planInfo,
      addressInfo: state.addressInfo,
      activeIndex: state.activeIndex
    });
  },
  // 保存计划的产品列表
  setSelectedPro(state, list) {
    state.selectProjProduct = list;
    Vue.prototype.$storage.set("session", "selectProjProduct", list);
  }
};
export const actions = {
  async clearCacheProj({ dispatch, commit }) {
    if (state.planInfo.planId) {
      await dispatch("delPlan", { planId: state.planInfo.planId });
    }
    Vue.prototype.$storage.remove("session", "planInfo");
    Vue.prototype.$storage.remove("session", "selectProjProduct");
    Vue.prototype.$storage.remove("local", "carrierName");
    commit("setPlanInfo", {
      latestIndex: 0
    });
    commit("setSelectedPro", []);
    commit("setAddressInfo", {});
    commit("setShipments", []);
    commit("saveCreateInfo", 0);
  },
  async getTransportList({ commit }) {
    return GLOBAL.ajax[`fba/FbaReplenishTransportList`]({ a: 1 }).then(data => {
      data = data.list.map(el => ({
        label: el.name,
        value: el.id
      }));
      commit("setTransportList", data);
      return data;
    });
  },
  async getAddress({ commit }, { storeId, addressId }) {
    return GLOBAL.ajax[`fba/fbaShipmentCreateAddressList`]({
      storeId,
      addressId
    }).then(data => {
      data = data.list;
      commit("setAddress", data);

      return data;
    });
  },
  //  删除当前计划
  async delPlan(store, { planId }) {
    return GLOBAL.ajax["fba/fbaShipmentCreatePlanDelete"]({
      planId
    });
  },
  // 更新计划
  async updatePlan({ commit }, { info, activeIndex }) {
    let { plan, items } = await GLOBAL.ajax["fba/fbaShipmentCreatePlanSave"](
      info
    );
    commit("setPlanInfo", plan);
    if (items && items.length) {
      commit(
        "setSelectedPro",
        items.map(e => ({ ...e, img: e.imagePath }))
      );
    }
    if (activeIndex) {
      commit("saveCreateInfo", activeIndex);
    }
    return plan;
  },
  // 查询计划商品
  async getProList({ commit }, params) {
    return GLOBAL.ajax[`fba/fbaShipmentCreateItemList`](params).then(data => {
      commit(
        "setSelectedPro",
        data.items.map(e => ({ ...e, img: e.imagePath }))
      );
    });
  },
  // 提交计划商品
  // eslint-disable-next-line no-unused-vars
  async submitPro({ commit }, params) {
    return GLOBAL.ajax[`fba/fbaShipmentCreateItemSave`](params);
  },
  // 获取货件清单
  async getShipments({ commit, state }) {
    return GLOBAL.ajax[`fba/fbaShipmentCreateShipmentList`]({
      planId: state.planInfo.planId
    }).then(data => {
      commit("setShipments", data.shipments);
      return data.shipments;
    });
  },
  // 创建计划的货件清单
  async createShipments({ commit, state }) {
    // if (state.shipments.length) {
    //   return;
    // }
    const params = {
      planId: state.planInfo.planId,
      planProcess: 4,
      storeId: state.planInfo.storeId
    };
    return GLOBAL.ajax[`fba/fbaShipmentCreatePlanCreate`](params).then(data => {
      commit("setShipments", data.shipments);
      return data.shipments;
    });
  },
  // 添加计划商品，用于 添加至现有的入库计划
  async addItemToCreated({ commit }, params) {
    await GLOBAL.ajax[`fba/fbaShipmentCreateItemAdd`](params);
    commit("setSelectedPro", params.items);
  },
  // 删除货件
  delShipments({ commit, state }, params) {
    return GLOBAL.ajax[`fba/fbaShipmentCreateShipmentDelete`](params).then(
      data => {
        commit(
          "setShipments",
          state.shipments.filter(el => el.shipmentId !== params.shipmentId)
        );
        return data.shipments;
      }
    );
  },
  // 查询货件商品
  async queryShipItems({ commit }, params) {
    let promises = Promise.all([
      GLOBAL.ajax[`fba/fbaShipmentCreateShipmentItems`](params).then(
        data => data.items
      ),
      GLOBAL.ajax[`fba/fbaShipmentCreateCartonList`](params).then(
        data => data.boxItems
      )
    ]);
    let [itemInfo /* 货件商品 */, cartonInfo /* 装箱信息 */] = await promises;
    // console.log(itemInfo, cartonInfo);
    // commit("setSelectedPro", itemInfo);
    commit("setCartonInfo", cartonInfo);
  }
};

export const getters = {
  addressGroupName(state) {
    const {
      addressName,
      addressLine1,
      addressLine2,
      addressState,
      addressCity,
      addressCountryCode,
      addressPostalCode
    } = state.addressInfo;
    return `${addressName || ""}, ${addressLine1 || ""} ${addressLine2 ||
      ""} ${addressCity || ""}, ${addressState || ""} ${addressPostalCode ||
      ""} ${addressCountryCode || ""}`;
  },
  packageTypeName(state) {
    return state.planInfo.packageType == 1 ? "混装商品" : "原厂包装发货商品";
  }
};
