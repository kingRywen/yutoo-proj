export default [
  {
    path: "fbaShipmentCreate/plan/list",
    name: "fbaShipmentCreatePlanList",
    method: "POST",
    desc: "FBA补货计划 - 计划列表",
    mock: false
  },
  {
    path: "fbaShipmentCreate/item/list",
    name: "fbaShipmentCreateItemList",
    method: "POST",
    desc: "FBA补货计划 - 计划商品列表",
    mock: false
  },
  {
    path: "fbaShipmentCreate/plan/delete",
    name: "fbaShipmentCreatePlanDelete",
    method: "POST",
    desc: "FBA补货计划 - 删除计划",
    mock: false,
    showSuccess: false
  },
  {
    path: "fbaShipmentCreate/plan/create",
    name: "fbaShipmentCreatePlanCreate",
    method: "POST",
    desc: "FBA补货计划 - 创建计划",
    mock: false
  },
  {
    path: "fbaShipmentCreate/item/add",
    name: "fbaShipmentCreateItemAdd",
    method: "POST",
    desc: "FBA补货计划 - 添加计划商品",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/plan/save",
    name: "fbaShipmentCreatePlanSave",
    method: "POST",
    desc: "FBA补货计划 - 添加计划",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/item/save",
    name: "fbaShipmentCreateItemSave",
    method: "POST",
    desc: "FBA补货计划 - 提交计划商品",
    mock: false
  },
  {
    path: "fbaShipmentCreate/plan/prep",
    name: "fbaShipmentCreatePlanPrep",
    method: "POST",
    desc: "FBA补货计划 - 查询预处理信息",
    mock: false
  },
  {
    path: "fbaReplenishTransport/getCarrierType",
    name: "fbaReplenishTransportGetCarrierType",
    method: "POST",
    desc: "运输方式管理 - 列表-获取承运商",
  }
];