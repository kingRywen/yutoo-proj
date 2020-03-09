export default [{
  name: 'userlogin',
  method: 'POST',
  desc: '用户登录',
  path: 'sys/login',
}, {
  name: 'sysLoginRecipient',
  method: 'POST',
  desc: '操作员登录',
  config: { allot: true, },
  showSuccess: true,
  path: 'sys/login/recipient',
}, {
  name: 'sysUserUpdatePswd',
  method: 'POST',
  showSuccess: true,
  type: 'formdata',
  desc: '修改密码',
  path: 'sys/user/updatePswd',
}, {
  name: 'platformSiteGetPlatformSite',
  method: 'POST',
  desc: '选择平台站点',
  path: 'PlatformSite/getPlatformSite',
}, {
  name: 'categoryList',
  method: 'POST',
  desc: '类目列表',
  path: 'Category/list',
}, {
  name: 'categoryDropdownList',
  method: 'POST',
  desc: '类目下拉值',
  config: {
    keep: true,
  },
  path: 'Category/dropdownList',
}, {
  name: 'categoryDropdownListHasParent',
  method: 'POST',
  config: {
    keep: true,
  },
  desc: '类目下拉值(包含父类目名称)',
  path: 'Category/dropdownList/hasParent',
}, {
  name: 'categorySave',
  method: 'POST',
  showSuccess: true,
  desc: '类目新增',
  path: 'Category/save',
}, {
  name: 'categoryUpdate',
  method: 'POST',
  desc: '类目编辑',

  showSuccess: true,
  path: 'Category/update',
}, {
  name: 'categorySearch',
  method: 'POST',
  desc: '类目搜索',
  singleLoading: true,
  type: 'formdata',
  path: 'Category/search',
}, {
  name: 'categoryRemove',
  method: 'POST',
  desc: '类目删除',
  showSuccess: true,
  path: 'Category/remove',
}, {
  name: 'categoryInfo',
  method: 'POST',
  desc: '类目信息（通过主键获取）',
  path: 'Category/info',
}, {
  name: 'accountList',
  method: 'POST',
  desc: '账号列表',
  path: 'Account/list',
}, {
  name: 'accountSave',
  method: 'POST',
  desc: '账号新增',
  showSuccess: true,
  path: 'Account/save',
}, {
  name: 'accountListCategory',
  method: 'POST',
  desc: '账号类目',
  singleLoading: true,
  path: 'Account/list/category',
}, {
  name: 'accountUpdate',
  method: 'POST',
  showSuccess: true,
  desc: '账号编辑',
  path: 'Account/update',
}, {
  name: 'accountExportTemplate',
  method: 'POST',
  desc: '下载模版',
  config: {
    responseType: "blob"
  },
  path: 'Account/exportTemplate',
}, {
  name: 'accountImportData',
  method: 'POST',
  desc: '导入数据',
  showSuccess: true,
  path: 'Account/importData',
}, {
  name: 'accountActive',
  method: 'POST',
  desc: '激活账号',
  // showSuccess: true,
  path: 'Account/active',
}, {
  name: 'apiPriceRange',
  method: 'POST',
  desc: '价格区间',
  showSuccess: true,
  path: 'api/priceRange',
}, {
  name: 'merchantOrderGetOrderId',
  method: 'POST',
  desc: '获取订单ID',
  // showSuccess: true,
  path: 'MerchantOrder/getOrderId',
}, {
  name: 'apiPrice',
  method: 'POST',
  desc: '获取价格',
  path: 'api/price',
}, {
  name: 'accountListActive',
  method: 'POST',
  desc: '可激活账号列表',
  path: 'Account/list/active',
}, {
  name: 'accountAotuRegister',
  method: 'POST',
  showSuccess: true,
  desc: '自动注册（手动类型的账号）',
  path: 'Account/aotuRegister',
}, {
  name: 'accountRemove',
  method: 'POST',
  desc: '账号删除',
  showSuccess: true,
  path: 'Account/remove',
}, {
  name: 'accountUpdateStatus',
  method: 'POST',
  desc: '修改状态',
  showSuccess: true,
  path: 'Account/updateStatus',
}, {
  name: 'accountInfo',
  method: 'POST',
  desc: '账号信息（通过主键获取）',
  path: 'Account/info',
}, {
  name: 'taskSubParamList',
  method: 'POST',
  desc: '查看账号结果',
  path: 'TaskSubParam/list',
}, {
  name: 'extensionTaskInfo',
  method: 'POST',
  desc: '查看任务详情',
  path: 'TaskAllot/taskInfo',
}, {
  name: 'accountTerminalList',
  method: 'POST',
  desc: '终端编号列表',
  // mock: true,
  // mockPath: 'http://120.79.124.232:8001/mock/229/Account/terminalList',
  path: 'Account/terminalList',
}, {
  name: 'extensionFeedback',
  method: 'POST',
  desc: '反馈任务',
  path: 'TaskAllot/feedback',
}, {
  name: 'extensionComplete',
  method: 'POST',
  desc: '完成任务',
  path: 'TaskAllot/complete',
}, {
  name: 'merchantOrderList',
  method: 'POST',
  desc: '订单列表',
  path: 'MerchantOrder/list',
}, {
  name: 'merchantOrderPayInfo',
  method: 'POST',
  desc: '支付信息（通过订单号id获取）',
  path: 'MerchantOrder/payInfo',
}, {
  name: 'merchantOrderAccountList',
  method: 'POST',
  desc: '账号列表',
  path: 'MerchantOrder/accountList',
}, {
  name: 'merchantOrderPay',
  method: 'POST',
  desc: '支付',
  showSuccess: true,
  path: 'MerchantOrder/pay',
}, {
  name: 'merchantOrderPayList',
  method: 'POST',
  desc: '付费记录列表',
  path: 'MerchantOrderPay/list',
}, {
  name: 'merchantOrderCancellation',
  method: 'POST',
  desc: '作废',
  path: 'MerchantOrder/cancellation',
}, {
  name: 'merchantOrderRenewInfo',
  method: 'POST',
  desc: '续费信息（通过订单号id获取）',
  path: 'MerchantOrder/renewInfo',
}, {
  name: 'merchantOrderRenew',
  method: 'POST',
  desc: '续费',
  showSuccess: true,
  path: 'MerchantOrder/renew',
}, {
  name: 'taskList',
  method: 'POST',
  desc: '任务列表',
  path: 'Task/list',
}, {
  name: 'taskSave',
  method: 'POST',
  desc: '任务新增',
  showSuccess: true,
  path: 'Task/save',
}, {
  name: 'taskUpdate',
  method: 'POST',
  desc: '任务编辑',
  path: 'Task/update',
}, {
  name: 'taskInfo',
  method: 'POST',
  desc: '任务信息（通过主键获取）',
  path: 'Task/info',
}, {
  name: 'taskSubInfo',
  method: 'POST',
  desc: '子任务信息（通过主键获取）',
  path: 'TaskSub/info',
}, {
  name: 'taskSubParamInfo',
  method: 'POST',
  desc: '任务信息（通过主键获取）',
  path: 'TaskSubParam/info',
}, {
  name: 'taskRemove',
  method: 'POST',
  desc: '任务删除',
  path: 'Task/remove',
}, {
  name: 'taskCancel',
  method: 'POST',
  desc: '取消任务',
  path: 'Task/cancel',
}, {
  name: 'taskName',
  method: 'POST',
  desc: '获取任务名称',
  path: 'Task/name',
}, {
  name: 'taskTypeDropdownList',
  method: 'POST',
  desc: '任务类型下拉值',
  path: 'TaskType/dropdownList',
}, {
  name: 'taskAllotList',
  method: 'POST',
  desc: '任务-任务分配-列表查询（分配给操作员的数据）',
  path: 'TaskAllot/list',
  config: { allot: true, },
}, {
  name: 'taskAllotListMain',
  method: 'POST',
  desc: '任务-任务分配-列表查询（分配给操作员的数据）',
  path: 'TaskAllot/list'
}, {
  name: 'taskAllotAllot',
  method: 'POST',
  desc: '任务-分配任务-提交',
  showSuccess: true,
  path: 'TaskAllot/allot',
  config: { allot: true, },
}, {
  name: 'taskAllotExecuteTask',
  method: 'POST',
  desc: '操作员-执行任务',
  config: { allot: true, },
  showSuccess: true,
  path: 'TaskAllot/executeTask',
}, {
  name: 'taskAllotExecuteTaskCase',
  method: 'POST',
  desc: '任务-操作员代办任务数',
  path: 'TaskAllot/executeTaskCase',
  config: { allot: true, },
}, {
  name: 'taskListUnAllot',
  method: 'POST',
  desc: '任务-任务分配-列表查询（商户管理员要分配的任务数据）',
  path: 'Task/list/unAllot',
}, {
  name: 'sysUserRecipientDropdownList',
  method: 'POST',
  desc: '任务-任务分配-操作员下拉值',
  path: 'sys/user/recipient/dropdownList',
}, {
  name: 'taskRegrab',
  method: 'POST',
  desc: '任务-重新抓取',
  showSuccess: true,
  path: 'Task/regrab',
}, {
  name: 'addrTemporaryExportTemplate',
  method: 'POST',
  desc: '任务-临时地址-下载模板',
  showSuccess: true,
  config: {
    responseType: 'blob'
  },
  path: 'AddrTemporary/exportTemplate',
}, {
  name: 'taskStatisticsSupplementExportTemplate',
  method: 'POST',
  desc: '账号-操作记录统计-下载模板',
  showSuccess: true,
  config: {
    responseType: 'blob'
  },
  path: 'TaskStatisticsSupplement/exportTemplate',
}, {
  name: 'addrTemporaryImportData',
  method: 'POST',
  desc: '任务-临时地址-导入数据',
  showSuccess: true,
  path: 'AddrTemporary/importData',
}, {
  name: 'addrTemporaryList',
  method: 'POST',
  config: {
    keep: true,
  },
  desc: '临时地址-列表查询',
  path: 'AddrTemporary/list',
}, {
  name: 'addrTemporaryListTask',
  method: 'POST',
  desc: '临时地址-任务与临时地址的关系',
  path: 'AddrTemporary/list/task',
}, {
  name: 'dropdownListNoHasLastLevel',
  method: 'POST',
  desc: '没有最底层的类目',
  path: 'Category/dropdownList/noHasLastLevel',
  config: {
    keep: true
  }
}, {
  name: 'categoryDropdownListHasLastLevel',
  method: 'POST',
  desc: '商户端的类目',
  path: 'Category/dropdownList/hasLastLevel',
  config: {
    keep: true
  }
}, {
  name: 'addrTemporaryListAccount',
  method: 'POST',
  desc: '临时地址-账号与临时地址的关系',
  path: 'AddrTemporary/list/account',
}, {
  name: 'addressInfoAccount',
  method: 'POST',
  desc: '账号-地址推荐',
  singleLoading: true,
  path: 'Address/info/account',
}, {
  name: 'taskSubList',
  method: 'POST',
  desc: '查看结果',
  path: 'TaskSub/list',
}, {
  name: 'libEvaluateList',
  method: 'POST',
  desc: '评价列表',
  path: 'LibEvaluate/list',
}, {
  name: 'libEvaluateUpdate',
  method: 'POST',
  desc: '评价编辑',
  showSuccess: true,
  path: 'LibEvaluate/update',
}, {
  name: 'libEvaluateSave',
  method: 'POST',
  desc: '评价新增',
  showSuccess: true,
  path: 'LibEvaluate/save',
}, {
  name: 'libEvaluateRemove',
  method: 'POST',
  desc: '评价删除',
  showSuccess: true,
  path: 'LibEvaluate/remove',
}, {
  name: 'libEvaluateExportTemplate',
  method: 'POST',
  desc: '下载评价模版',
  config: {
    responseType: "blob"
  },
  path: 'LibEvaluate/exportTemplate',
}, {
  name: 'taskExportTemplate',
  method: 'POST',
  desc: '下载导入任务模版',
  config: {
    responseType: "blob"
  },
  path: 'Task/exportTemplate',
}, {
  name: 'libEvaluateImportData',
  method: 'POST',
  desc: '评价导入数据',
  path: 'LibEvaluate/importData',
}, {
  name: 'libEvaluateInfo',
  method: 'POST',
  desc: '评价信息（通过主键获取）',
  path: 'LibEvaluate/info',
}, {
  name: 'libQuestionAnswerList',
  method: 'POST',
  desc: '问答列表',
  path: 'LibQuestionAnswer/list',
}, {
  name: 'libQuestionAnswerSave',
  method: 'POST',
  desc: '问答新增',
  showSuccess: true,
  path: 'LibQuestionAnswer/save',
}, {
  name: 'libQuestionAnswerUpdate',
  method: 'POST',
  desc: '问答编辑',
  showSuccess: true,
  path: 'LibQuestionAnswer/update',
}, {
  name: 'libQuestionAnswerRemove',
  method: 'POST',
  desc: '问答删除',
  showSuccess: true,
  path: 'LibQuestionAnswer/remove',
}, {
  name: 'libQuestionAnswerExportTemplate',
  method: 'POST',
  desc: '下载问答模版',
  config: {
    responseType: "blob"
  },
  path: 'LibQuestionAnswer/exportTemplate',
}, {
  name: 'libQuestionAnswerImportData',
  method: 'POST',
  desc: '问答导入数据',
  path: 'LibQuestionAnswer/importData',
}, {
  name: 'libQuestionAnswerInfo',
  method: 'POST',
  desc: '问答信息（通过主键获取）',
  path: 'LibQuestionAnswer/info',
}, {
  name: 'libMessageContentList',
  method: 'POST',
  desc: '站内信列表',
  path: 'LibMessageContent/list',
}, {
  name: 'libMessageContentSave',
  method: 'POST',
  desc: '问答新增',
  showSuccess: true,
  path: 'LibMessageContent/save',
}, {
  name: 'libMessageContentUpdate',
  method: 'POST',
  desc: '问答编辑',
  showSuccess: true,
  path: 'LibMessageContent/update',
}, {
  name: 'libMessageContentRemove',
  method: 'POST',
  desc: '问答删除',
  showSuccess: true,
  path: 'LibMessageContent/remove',
}, {
  name: 'libMessageContentInfo',
  method: 'POST',
  desc: '站内信信息（通过主键获取）',
  path: 'LibMessageContent/info',
}, {
  name: 'libMessageContentExportTemplate',
  method: 'POST',
  desc: '下载站内信模版',
  config: {
    responseType: "blob"
  },
  path: 'LibMessageContent/exportTemplate',
}, {
  name: 'libMessageContentImportData',
  method: 'POST',
  desc: '站内信导入数据',
  path: 'LibMessageContent/importData',
}, {
  name: 'accountLogin',
  method: 'POST',
  desc: '获取登录',
  // showSuccess: true,
  path: 'Account/login',
}, {
  name: 'accountReactive',
  method: 'POST',
  desc: '重新激活账号',
  // showSuccess: true,
  singleLoading: true,
  path: 'Account/reactive',
}, {
  name: 'platformSiteListPlatform',
  method: 'POST',
  desc: '选择平台',
  path: 'PlatformSite/list/platform',
}, {
  name: 'platformSiteListSite',
  method: 'POST',
  desc: '选择站点',
  path: 'PlatformSite/list/site',
}, {
  name: 'sysUserChangeSite',
  method: 'POST',
  desc: '切换站点（点击站点后就调该接口）',
  path: 'sys/user/changeSite',
}, {
  name: 'sysUserInfo',
  method: 'POST',
  desc: '个人信息',
  path: 'sys/user/info',
  config: {
    role: 'all'
  }
}, {
  name: 'merchantMailTemplateInfo',
  method: 'POST',
  desc: '邮箱设置（打开页面就获取信息）',
  path: 'MerchantMailTemplate/info',
}, {
  name: 'merchantMailTemplateSet',
  method: 'POST',
  showSuccess: true,
  desc: '邮箱设置（点设置那个页面保存时调的）',
  path: 'MerchantMailTemplate/set',
}, {
  name: 'merchantOrderAuditPass',
  method: 'POST',
  showSuccess: true,
  desc: '订单审核通过(中心端)',
  path: 'MerchantOrder/auditPass',
}, {
  name: 'accountCenterActive',
  method: 'POST',
  showSuccess: true,
  desc: '激活账号(中心端)',
  path: 'Account/center/active',
}, {
  name: 'accountLogout',
  method: 'POST',
  showSuccess: true,
  desc: '关闭浏览器',
  path: 'Account/logout',
}, {
  name: 'ipBindRecordGetIpCase',
  method: 'POST',
  desc: '剩余可用配额数调接口',
  path: 'IpBindRecord/getIpCase',
}, {
  name: 'ipPricePriceRange',
  method: 'POST',
  desc: '获取价格区间',
  path: 'IpPrice/priceRange',
}, {
  name: 'ipPricePrice',
  method: 'POST',
  desc: '获取单价、总金额（单个月）和需付金额',
  path: 'IpPrice/price',
}, {
  name: 'ipPriceNeedPay',
  method: 'POST',
  desc: '获取需付金额（账号激活的支付，续费时调的）',
  path: 'IpPrice/needPay',
}, {
  name: 'merchantOrderPayReactivePay',
  method: 'POST',
  showSuccess: true,
  desc: '重新激活账号的支付',
  path: 'MerchantOrderPay/reactivePay',
}, {
  name: 'accountCopyPassword',
  method: 'POST',
  desc: '获取密码',
  showSuccess: true,
  path: 'Account/copyPassword',
}, {
  name: 'categorySysList',
  method: 'POST',
  desc: '系统类目',
  path: 'CategorySys/dropdownList',
  config: {
    keep: true,
  },
}, {
  name: 'categoryExtend',
  method: 'POST',
  desc: '类目-扩展类目账号',
  showSuccess: false,
  path: 'Category/extend',
}, {
  name: 'msgList',
  method: 'POST',
  desc: '消息获取',
  path: '/Msg/list',
  config: {
    keep: true
  }
}, {
  name: 'categorySysDropdownListHasLastLevel',
  method: 'POST',
  desc: '类目系统下拉',
  path: '/CategorySys/dropdownList/hasLastLevel',
  config: {
    keep: true
  }
}, {
  name: 'systemSettingPriceReactive',
  method: 'POST',
  desc: '类目-获取重新激活价格',
  path: 'SystemSetting/price/reactive',
}, {
  name: 'systemSettingPriceAnnualfee',
  method: 'POST',
  desc: '商户续费的获取价格',
  // path: 'SystemSetting/price/annualfee',
  path: 'api/price/annualfee',
},
{
  name: 'merchantOrderPayMemberfeePay',
  method: 'POST',
  showSuccess: true,
  desc: '商户续期的会员费支付',
  // path: 'MerchantOrderPay/memberfeePay',
  path: 'api/memberfeePay',
},
{
  name: 'sysGetVerificationCode',
  method: 'POST',
  desc: '获取验证码',
  showSuccess: true,
  type: 'formdata',
  path: 'sys/getVerificationCode',
},
{
  name: 'sysResetPassword',
  method: 'POST',
  showSuccess: true,
  type: 'formdata',
  desc: '重置密码',
  path: 'sys/resetPassword',
},
{
  name: 'sysRoleList',
  method: 'POST',
  // showSuccess: true,
  desc: '角色管理-列表查询',
  path: 'sys/role/list',
},
{
  name: 'sysRoleInfo',
  method: 'POST',
  // showSuccess: true,
  desc: '角色管理-详情',
  path: 'sys/role/info',
},
{
  name: 'sysRoleSave',
  method: 'POST',
  showSuccess: true,
  desc: '角色管理-新增',
  path: 'sys/role/save',
},
{
  name: 'sysRoleUpdate',
  method: 'POST',
  showSuccess: true,
  desc: '角色管理-编辑',
  path: 'sys/role/update',
},
{
  name: 'sysRoleRemove',
  method: 'POST',
  showSuccess: true,
  desc: '角色管理-删除',
  path: 'sys/role/remove',
},
{
  name: 'sysMenuList',
  method: 'POST',
  // showSuccess: true,
  desc: '角色管理-权限设置-菜单列表',
  path: 'sys/menu/list',
},
{
  name: 'sysRoleAuthorizeOpt',
  method: 'POST',
  showSuccess: true,
  desc: '角色管理-权限设置-提交保存',
  path: 'sys/role/authorize/opt',
},
{
  name: 'sysUserList',
  method: 'POST',
  // showSuccess: true,
  desc: '操作员管理-用户列表查询',
  config: { allot: true, },
  path: 'sys/user/list',
},
{
  name: 'sysUserInfoUser',
  method: 'POST',
  // showSuccess: true,
  desc: '操作员管理-详情',
  path: 'sys/user/infoUser',
},
{
  name: 'sysRoleSelect',
  method: 'POST',
  // showSuccess: true,
  desc: '操作员管理-详情（角色选择）',
  path: 'sys/role/select',
},
{
  name: 'sysUserSave',
  method: 'POST',
  showSuccess: true,
  desc: '操作员管理-新增',
  path: 'sys/user/save',
},
{
  name: 'sysUserUpdate',
  method: 'POST',
  showSuccess: true,
  desc: '操作员管理-编辑',
  path: 'sys/user/update',
},
{
  name: 'sysUserRemove',
  method: 'POST',
  showSuccess: true,
  desc: '操作员管理-删除',
  path: 'sys/user/remove',
},
{
  name: 'sysUserReset',
  method: 'POST',
  showSuccess: true,
  desc: '操作员管理-重置密码',
  path: 'sys/user/reset',
},
{
  name: 'accountLoginEmail',
  method: 'POST',
  showSuccess: true,
  desc: '账号-登录邮箱',
  path: 'Account/loginEmail',
},
{
  name: 'merchantEditMobile',
  method: 'POST',
  showSuccess: true,
  desc: '修改手机号码',
  path: 'Merchant/editMobile',
},
{
  name: 'timezoneSelectList',
  method: 'POST',
  desc: '时区列表',
  path: 'Timezone/selectList',
},
{
  name: 'merchantRecipientRemove',
  method: 'POST',
  desc: '时区列表',
  path: 'Merchant/recipient/remove',
},
{
  name: 'categoryImportData',
  method: 'POST',
  desc: '导入类目', showSuccess: true,
  type: 'formdata',
  path: 'Category/importData',
},

{
  name: 'categorySysExportTemplate',
  method: 'POST',
  desc: '类目-下载模板', config: {
    responseType: 'blob'
  },
  showSuccess: true,
  path: 'Category/exportTemplate'
},

{
  name: 'constantRealPathGet',
  method: 'POST',
  desc: '获取oss上传图片路径',
  path: '/constant/realPath/get',
  config: {
    keep: true,
  },
  params: {}
},

]