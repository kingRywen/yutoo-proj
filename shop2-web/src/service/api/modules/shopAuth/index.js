export default [
  {
    name: "regionSiteList",
    method: "POST",
    desc: "区域站点列表",
    path: "/regionSite/list",
    mock: false
  },
  {
    name: "sellerAuthList",
    method: "POST",
    desc: "授权列表",
    path: "/sellerAuth/list",
    mock: false
  },
  {
    name: "sellerAuthSave",
    method: "POST",
    desc: "添加授权",
    showSuccess: true,
    path: "/sellerAuth/save",
    mock: false
  },
  {
    name: "sellerAuthUpdate",
    method: "POST",
    desc: "编辑授权",
    showSuccess: true,
    path: "/sellerAuth/update",
    mock: false
  },
  {
    name: "sellerAuthRemove",
    method: "POST",
    desc: "删除授权",
    newShowSuccess: true,
    path: "/sellerAuth/remove",
    mock: false
  },
  {
    name: "sellerAuthAdAddSite",
    method: "POST",
    desc: "添加广告站点授权",
    showSuccess: true,
    path: "/sellerAuthAd/addSite",
    mock: false
  },
  {
    name: "sellerAuthEmailAuth",
    method: "POST",
    desc: "邮箱授权",
    showSuccess: true,
    path: "/sellerAuth/emailAuth",
    mock: false
  },
  {
    name: "sellerAuthAdGetAdAuthUrl",
    method: "POST",
    desc: "获取广告授权链接",
    path: "/sellerAuthAd/getAdAuthUrl",
    mock: false
  },
  {
    name: "configDeveloperMwsInfo",
    method: "POST",
    desc: "获取开发者信息",
    path: "/configDeveloperMws/info",
    mock: false
  },
  {
    name: "sellerAuthAddSite",
    method: "POST",
    desc: "添加基础api站点授权",
    path: "/sellerAuth/addSite",
    mock: false
  },
  {
    name: "sellerAuthListToSeller",
    method: "POST",
    desc: "店铺列表",
    path: "/sellerAuth/listToSeller",
    mock: false
  }
];
