export default [
  {
    path: "fbaShipmentCreate/address/list",
    name: "fbaShipmentCreateAddressList",
    method: "POST",
    desc: "FBA补货地址管理 - 发货地址列表",
    mock: false
  },
  {
    path: "fbaShipmentCreate/address/set",
    name: "fbaShipmentCreateAddressSet",
    method: "POST",
    desc: "FBA补货地址管理 - 设置默认发货地址",
    mock: false
  },
  {
    path: "fbaShipmentCreate/address/delete",
    name: "fbaShipmentCreateAddressDelete",
    method: "POST",
    desc: "FBA补货地址管理 - 批量删除发货地址",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/address/edit",
    name: "fbaShipmentCreateAddressEdit",
    method: "POST",
    desc: "FBA补货地址管理 - 编辑发货地址",
    mock: false,
    showSuccess: true
  },
  {
    path: "fbaShipmentCreate/address/save",
    name: "fbaShipmentCreateAddressSave",
    method: "POST",
    desc: "FBA补货地址管理 - 添加发货地址",
    mock: false,
    showSuccess: true
  }
];
