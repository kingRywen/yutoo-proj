export default [
  {
    path: "fbaShipmentCreate/shipment/delete",
    name: "fbaShipmentCreateShipmentDelete",
    method: "POST",
    desc: "FBA补货预处理 - 删除货件",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/transport/confirm",
    name: "fbaShipmentCreateTransportConfirm",
    method: "POST",
    desc: "FBA补货预处理 - 确认运输信息",
    mock: false
  },
  {
    path: "fbaShipmentCreate/transport/get",
    name: "fbaShipmentCreateTransportGet",
    method: "POST",
    desc: "FBA补货预处理 - 查询运输信息",
    mock: false
  },
  {
    path: "fbaShipmentCreate/carton/upload",
    name: "fbaShipmentCreateCartonUpload",
    method: "POST",
    desc: "FBA补货预处理 - 上传填写装箱信息EXCEL文件",
    mock: false
  },
  {
    path: "fbaShipmentCreate/carton/download",
    name: "fbaShipmentCreateCartonDownload",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "FBA补货预处理 - 下载填写装箱信息EXCEL文件",
    mock: false
  },
  {
    path: "fbaShipmentCreate/transport/save",
    name: "fbaShipmentCreateTransportSave",
    method: "POST",
    desc: "FBA补货预处理 - 保存运输信息",
    mock: false
  },
  {
    path: "fbaShipmentCreate/shipment/items",
    name: "fbaShipmentCreateShipmentItems",
    method: "POST",
    desc: "FBA补货预处理 - 查询货件商品",
    mock: false
  },
  {
    path: "fbaShipmentCreate/shipment/edit",
    name: "fbaShipmentCreateShipmentEdit",
    method: "POST",
    desc: "FBA补货预处理 - 编辑货件",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/label/bill",
    name: "fbaShipmentCreateLabelBill",
    method: "POST",
    desc: "FBA补货预处理 - 下载账单信息",
    mock: false
  },
  {
    path: "fbaShipmentCreate/transport/put",
    name: "fbaShipmentCreateTransportPut",
    method: "POST",
    desc: "FBA补货预处理 - 提交运输信息",
    mock: false
  },
  {
    path: "fbaShipmentCreate/label/pallet",
    name: "fbaShipmentCreateLabelPallet",
    method: "POST",
    desc: "FBA补货预处理 - 下载托盘标签",
    mock: false
  },
  {
    path: "fbaShipmentCreate/shipment/create",
    name: "fbaShipmentCreateShipmentCreate",
    method: "POST",
    desc: "FBA补货预处理 - 创建货件",
    mock: false
  },
  {
    path: "fbaShipmentCreate/label/package",
    name: "fbaShipmentCreateLabelPackage",
    method: "POST",
    config: {
      responseType: "blob"
    },
    desc: "FBA补货预处理 - 下载外箱标签",
    mock: false
  },
  {
    path: "fbaShipmentCreate/carton/put",
    name: "fbaShipmentCreateCartonPut",
    method: "POST",
    desc: "FBA补货预处理 - 提交装箱信息",
    mock: false
  }
];
