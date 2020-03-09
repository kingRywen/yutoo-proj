/*
 * @Author: rywen
 * @Date: 2019-12-25 17:32:50
 * @Last Modified by: rywen
 * @Last Modified time: 2019-12-25 17:34:48
 */
export default [{
    name: "sysLogin",
    method: "POST",
    desc: "登陆",
    // showSuccess: true,
    path: "/sys/login",
    type: "form",
    params: {}
  },
  {
    name: "sysRegister",
    method: "POST",
    desc: "注册",
    // showSuccess: true,
    path: "/sys/register",
    params: {}
  },
  {
    name: "merchantPlatformSitePlatformSite",
    method: "POST",
    desc: "平台站点",
    path: "/MerchantPlatformSite/platformSite",
    params: {}
  },
  {
    name: "categoryDropdownListHasLastLevel",
    method: "POST",
    // config: {keep: true},
    desc: "类目下拉选择",
    path: "/Category/dropdownList/hasLastLevel",
    params: {}
  }
];