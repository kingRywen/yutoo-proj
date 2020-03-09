export default [
  {
    path: "sellingGroup/save",
    name: "sellingGroupSave",
    method: "POST",
    desc: "跟卖-分组管理 - 添加分组",

    showSuccess: true
  },
  {
    path: "sellingGroup/list",
    name: "sellingGroupList",
    method: "POST",
    desc: "跟卖-分组管理 - 分组列表"
  },
  {
    path: "sellingGroup/update",
    name: "sellingGroupUpdate",
    method: "POST",
    desc: "跟卖-分组管理 - 更新分组",

    showSuccess: true
  },
  {
    path: "sellingGroup/remove",
    name: "sellingGroupRemove",
    method: "POST",
    desc: "跟卖-分组管理 - 删除分组",

    newShowSuccess: true
  }
];
