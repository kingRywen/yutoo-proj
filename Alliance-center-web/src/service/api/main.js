export default [
  {
    name: 'userlogin',
    method: 'POST',
    desc: '用户登录',
    showSuccess: true,
    path: 'sys/login'
  },
  {
    name: 'msgList',
    method: 'POST',
    desc: '消息获取',
    path: '/Msg/list',
    config: {
      keep: true
    }
  },
  {
    name: 'sysUserUpdatePswd',
    method: 'POST',
    showSuccess: true,
    type: 'formdata',
    desc: '修改密码',
    path: 'sys/user/updatePswd'
  },
  {
    name: 'sysUserInfo',
    method: 'GET',
    desc: '个人信息',
    path: 'sys/user/info'
  },
  {
    name: 'accountCopyPassword',
    method: 'POST',
    showSuccess: true,
    desc: '获取密码',
    path: 'Account/copyPassword'
  },
  {
    name: 'countryList',
    method: 'POST',
    // showSuccess: true,
    desc: '国家列表查询',
    path: 'Country/list'
  },
  {
    name: 'countryInfo',
    method: 'POST',
    singleLoading: true,
    desc: '国家-详情查询',
    path: 'Country/info'
  },
  {
    name: 'countryDropdownList',
    method: 'POST',
    desc: '国家-下拉值查询',
    path: 'Country/dropdownList'
  },
  {
    name: 'countrySave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '国家-新增',
    path: 'Country/save'
  },
  {
    name: 'countryUpdate',
    method: 'POST',
    singleLoading: true,
    showSuccess: true,
    desc: '国家-编辑',
    path: 'Country/update'
  },
  {
    name: 'countryRemove',
    method: 'POST',
    showSuccess: true,
    desc: '国家-删除',
    path: 'Country/remove'
  },
  {
    name: 'platformList',
    method: 'POST',
    desc: '平台-列表查询',
    path: 'Platform/list'
  },
  {
    name: 'platformInfo',
    method: 'POST',
    singleLoading: true,
    desc: '平台-详情查询',
    path: 'Platform/info'
  },
  {
    name: 'platformDropdownList',
    method: 'POST',
    desc: '平台-下拉值查询',
    path: 'Platform/dropdownList'
  },
  {
    name: 'platformSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '平台-新增',
    path: 'Platform/save'
  },
  {
    name: 'platformUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '平台-编辑',
    path: 'Platform/update'
  },
  {
    name: 'platformRemove',
    method: 'POST',
    showSuccess: true,
    desc: '平台-删除',
    path: 'Platform/remove'
  },
  {
    name: 'platformSiteList',
    method: 'POST',
    desc: '平台站点-列表查询',
    path: '/PlatformSite/list'
  },
  {
    name: 'platformSiteInfo',
    method: 'POST',
    singleLoading: true,
    desc: '平台站点-详情查询',
    path: 'PlatformSite/info'
  },
  {
    name: 'platformSiteDropdownList',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '平台站点-下拉值查询',
    path: 'PlatformSite/dropdownList'
  },
  {
    name: 'platformSiteSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '平台站点-新增',
    path: 'PlatformSite/save'
  },
  {
    name: 'platformSiteUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '平台站点-编辑',
    path: 'PlatformSite/update'
  },
  {
    name: 'platformSiteRemove',
    method: 'POST',
    showSuccess: true,
    desc: '平台站点-删除',
    path: 'PlatformSite/remove'
  },
  {
    name: 'merchantList',
    method: 'POST',
    desc: '商户-列表查询',
    path: 'Merchant/list'
  },
  {
    name: 'merchantInfo',
    method: 'POST',
    singleLoading: true,
    desc: '商户-详情查询',
    path: 'Merchant/info'
  },
  {
    name: 'merchantGetMerchantNo',
    method: 'POST',
    singleLoading: true,
    desc: '商户-获取商户编号',
    path: 'Merchant/getMerchantNo'
  },
  {
    name: 'merchantSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '商户-新增',
    path: 'Merchant/save'
  },
  {
    name: 'merchantUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '商户-编辑',
    path: 'Merchant/update'
  },
  {
    name: 'merchantRemove',
    method: 'POST',
    showSuccess: true,
    desc: '商户-删除',
    path: 'Merchant/remove'
  },
  {
    name: 'merchantActivate',
    method: 'POST',
    showSuccess: true,
    desc: '商户-激活',
    path: '/Merchant/activate'
  },
  {
    name: 'merchantTermination',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '商户-终止',
    path: 'Merchant/termination'
  },
  {
    name: 'merchantRenew',
    method: 'POST',
    showSuccess: true,
    desc: '商户-续期',
    path: 'Merchant/renew'
  },
  {
    name: 'merchantResetPassword',
    method: 'POST',
    showSuccess: true,
    desc: '商户-重置密码',
    path: 'Merchant/resetPassword'
  },
  {
    name: 'ipPoolList',
    method: 'POST',
    desc: 'IP-列表查询',
    path: 'IpPool/list'
  },
  {
    name: 'ipPoolCheck',
    method: 'POST',
    desc: 'IP-校验',
    singleLoading: true,
    path: 'IpPool/check'
  },
  {
    name: 'ipPoolExportTemplate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    config: {
      responseType: 'blob'
    },
    desc: 'IP-下载模板',
    path: 'IpPool/exportTemplate'
  },
  {
    name: 'ipPoolImportData',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: 'IP-导入',
    path: 'IpPool/importData'
  },
  {
    name: 'ipPoolInfo',
    method: 'POST',
    // showSuccess: true,
    singleLoading: true,
    desc: 'IP-详情查询',
    path: 'IpPool/info'
  },
  {
    name: 'ipPoolSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: 'IP-新增',
    path: 'IpPool/save'
  },
  {
    name: 'ipPoolUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: 'IP-编辑',
    path: 'IpPool/update'
  },
  {
    name: 'ipPoolRemove',
    method: 'POST',
    showSuccess: true,
    desc: 'IP-删除',
    path: '/IpPool/remove'
  },
  {
    name: 'ipBindRecordList',
    method: 'POST',
    desc: 'IP-使用情况',
    path: 'IpBindRecord/list'
  },
  {
    name: 'ipPriceList',
    method: 'POST',
    desc: 'IP价格-列表查询',
    path: 'IpPrice/list'
  },
  {
    name: 'ipPriceInfo',
    method: 'POST',
    singleLoading: true,
    desc: 'IP价格-详情查询',
    path: 'IpPrice/info'
  },
  {
    name: 'ipPriceUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: 'IP价格-编辑',
    path: 'IpPrice/update'
  },
  {
    name: 'merchantOrderList',
    method: 'POST',
    desc: '订单-列表查询',
    path: 'MerchantOrder/list'
  },
  {
    name: 'merchantOrderAllocationIp',
    method: 'POST',
    desc: '订单-分配IP',
    path: 'MerchantOrder/allocationIp'
  },
  {
    name: 'merchantOrderAccountList',
    method: 'POST',
    desc: '订单-账号列表查询',
    path: 'MerchantOrder/account/list'
  },
  {
    name: 'merchantOrderInfo',
    method: 'POST',
    desc: '订单-详情查询',
    path: 'MerchantOrder/info'
  },
  {
    name: 'platformOrderList',
    method: 'POST',
    desc: '账号-平台订单同步-列表查询',
    path: 'PlatformOrder/list'
  },
  {
    name: 'platformOrderSyncOrder',
    method: 'POST',
    desc: '账号-平台订单同步（单个订单）',
    path: 'PlatformOrder/syncOrder'
  },
  {
    name: 'merchantOrderPayAudit',
    method: 'POST',
    showSuccess: false,
    singleLoading: true,
    desc: '付费记录-审核',
    path: 'MerchantOrderPay/audit'
  },
  {
    name: 'merchantOrderPayAuditQuery',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '付费记录-审核查询',
    path: 'MerchantOrderPay/audit/query'
  },
  {
    name: 'merchantOrderPayList',
    method: 'POST',
    desc: '付费记录-列表查询',
    path: 'MerchantOrderPay/list'
  },
  {
    name: 'merchantOrderPayInfo',
    method: 'POST',
    singleLoading: true,
    desc: '付费记录-详情查询',
    path: 'MerchantOrderPay/info'
  },
  {
    name: 'accountList',
    method: 'POST',
    desc: '账号-列表查询',
    path: 'Account/list'
  },
  {
    name: 'accountHabit',
    method: 'POST',
    singleLoading: true,
    desc: '账号-账号习惯详情查询',
    path: 'Account/habit'
  },
  {
    name: 'accountChangeHabit',
    method: 'POST',
    showSuccess: true,
    desc: '账号-账号习惯',
    singleLoading: true,
    path: 'Account/changeHabit'
  },
  {
    name: 'accountActiveTime',
    method: 'POST',
    singleLoading: true,
    desc: '账号-账号活跃时间详情查询',
    path: 'Account/activeTime'
  },
  {
    name: 'taskStatisticsInfoAccount',
    method: 'POST',
    desc: '账号-任务统计（列表上面那个）',
    path: 'TaskStatistics/info/account'
  },
  {
    name: 'taskConstBuyTimeList',
    method: 'POST',
    desc: '安全范围-购买时间间隔约束查看',
    path: 'TaskConstBuyTime/list'
  },
  {
    name: 'taskConstBuyTimeUpdate',
    method: 'POST',
    showSuccess: true,
    desc: '安全范围-购买时间间隔约束编辑',
    path: 'TaskConstBuyTime/update'
  },
  {
    name: 'taskConstReviewList',
    method: 'POST',
    desc: '安全范围-评价约束查看',
    path: 'TaskConstReview/list'
  },
  {
    name: 'taskConstReviewUpdate',
    method: 'POST',
    desc: '安全范围-评价约束编辑',
    showSuccess: true,
    path: 'TaskConstReview/update'
  },
  {
    name: 'taskConstProdAvoidRelList',
    method: 'POST',
    desc: '安全范围-产品防关联约束查看',
    path: 'TaskConstProdAvoidRel/list'
  },
  {
    name: 'merchantMessageList',
    method: 'POST',
    desc: '消息-列表查询',
    path: 'MerchantMessage/list'
  },
  {
    name: 'merchantMessageInfo',
    method: 'POST',
    desc: '消息-详情',
    path: 'MerchantMessage/info'
  },
  {
    name: 'merchantMessageSave',
    method: 'POST',
    desc: '消息-新增',
    showSuccess: true,
    path: 'MerchantMessage/save'
  },
  {
    name: 'merchantMessageUpdate',
    method: 'POST',
    desc: '消息-编辑',
    showSuccess: true,
    path: 'MerchantMessage/update'
  },
  {
    name: 'merchantMessageRemove',
    method: 'POST',
    desc: '消息-编辑',
    showSuccess: true,
    path: 'MerchantMessage/remove'
  },
  {
    name: 'taskConstProdAvoidRelUpdate',
    method: 'POST',
    desc: '安全范围-产品防关联约束编辑',
    showSuccess: true,
    path: 'TaskConstProdAvoidRel/update'
  },
  {
    name: 'clientTaskListAccount',
    method: 'POST',
    desc: '账号-任务统计（列表）',
    path: 'TaskAllot/list/account'
  },
  {
    name: 'accountTimeList',
    method: 'POST',
    desc: '账号-活跃时间列表查询',
    path: 'SystemSetting/timeList'
  },
  {
    name: 'accountChangeActiveTime',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '账号-账号活跃时间',
    path: 'Account/changeActiveTime'
  },
  {
    name: 'taskTypeList',
    method: 'POST',
    desc: '任务类型-列表查询',
    path: '/TaskType/list'
  },
  {
    name: 'taskTypeInfo',
    method: 'POST',
    singleLoading: true,
    desc: '任务类型-详情查询',
    path: 'TaskType/info'
  },
  {
    name: 'taskTypeDropdownList',
    method: 'POST',
    desc: '任务类型-下拉值查询',
    singleLoading: true,
    path: 'TaskType/dropdownList'
  },
  {
    name: 'categorySysDropdownListNoHasLastLevel',
    method: 'POST',
    desc: '上级类目不为空',
    showSuccess: false,
    singleLoading: true,
    path: 'CategorySys/dropdownList/noHasLastLevel'
  },
  {
    name: 'taskTypeSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '任务类型-新增',
    path: 'TaskType/save'
  },
  {
    name: 'taskTypeListPlatform',
    method: 'POST',
    // showSuccess: true,
    singleLoading: true,
    desc: '任务类型支持平台',
    path: 'TaskType/list/platform'
  },
  {
    name: 'accountListCategory',
    method: 'POST',
    desc: '账号类目',
    singleLoading: true,
    path: 'Account/list/category'
  },
  {
    name: 'taskTypeUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '任务类型-编辑',
    path: 'TaskType/update'
  },
  {
    name: 'actionList',
    method: 'POST',

    desc: '动作定义-列表查询',
    path: 'Action/list'
  },
  {
    name: 'actionInfo',
    method: 'POST',
    singleLoading: true,
    desc: '动作定义-详情查询',
    path: 'Action/info'
  },
  {
    name: 'actionDropdownList',
    method: 'POST',
    desc: '动作定义-下拉值查询',
    path: 'Action/dropdownList'
  },
  {
    name: 'actionListHabit',
    method: 'POST',
    singleLoading: true,
    desc: '动作定义-列表查询(习惯需要)',
    path: 'Habit/action'
  },
  {
    name: 'categorySysReuseCrowd',
    method: 'POST',
    type: 'formdata',
    singleLoading: true,
    desc: '类目-复用人群',
    path: 'CategorySys/reuseCrowd'
  },
  {
    name: 'actionSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '动作定义-新增',
    path: 'Action/save'
  },
  {
    name: 'actionUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '动作定义-编辑',
    path: 'Action/update'
  },
  {
    name: 'processList',
    method: 'POST',

    desc: '流程定义-列表查询',
    path: 'Process/list'
  },
  {
    name: 'processInfo',
    method: 'POST',
    singleLoading: true,
    desc: '流程定义-详情查询',
    path: 'Process/info'
  },
  {
    name: 'processSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '流程定义-新增',
    path: 'Process/save'
  },
  {
    name: 'processUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '流程定义-编辑',
    path: 'Process/update'
  },
  {
    name: 'habitList',
    method: 'POST',
    desc: '习惯定义-列表查询',
    path: 'Habit/list'
  },
  {
    name: 'habitDropdownList',
    method: 'POST',
    desc: '习惯定义-下拉值查询',
    path: 'Habit/dropdownList'
  },
  {
    name: 'habitInfo',
    method: 'POST',
    singleLoading: true,
    desc: '习惯定义-详情查询',
    path: 'Habit/info'
  },
  {
    name: 'habitSave',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '习惯定义-新增',
    path: 'Habit/save'
  },
  {
    name: 'habitUpdate',
    method: 'POST',
    showSuccess: true,
    desc: '习惯定义-编辑',
    singleLoading: true,
    path: 'Habit/update'
  },
  {
    name: 'habitRemove',
    method: 'POST',
    showSuccess: true,
    desc: '习惯定义-删除',
    path: 'Habit/remove'
  },
  {
    name: 'taskList',
    method: 'POST',

    desc: '任务-列表查询',
    path: 'Task/list'
  },
  {
    name: 'taskSubList',
    method: 'POST',

    desc: '任务-任务结果查询-列表查询',
    path: 'TaskSub/list'
  },
  {
    name: 'taskInfo',
    method: 'POST',
    desc: '任务-任务结果查询-详情查询',
    path: 'Task/info'
  },
  {
    name: 'taskSubParamList',
    method: 'POST',

    desc: '任务-账号执行结果查询-列表查询',
    path: 'TaskSubParam/list'
  },
  {
    name: 'taskSubParamInfo',
    method: 'POST',

    desc: '任务-账号执行结果查询-详情查询',
    path: 'TaskSubParam/info'
  },
  {
    name: 'systemSettingList',
    method: 'POST',

    desc: '系统设置-列表查询',
    path: 'SystemSetting/list'
  },
  {
    name: 'systemSettingInfo',
    method: 'POST',
    singleLoading: true,
    desc: '系统设置-详情查询',
    path: 'SystemSetting/info'
  },
  {
    name: 'systemSettingUpdate',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '系统设置-编辑',
    path: 'SystemSetting/update'
  },
  /**
   *
   * 系统类目
   *
   */
  {
    name: 'categorySysList',
    method: 'POST',
    desc: '类目-列表查询',
    path: 'CategorySys/list',
    keep: true
  },
  {
    name: 'categorySysInfo',
    method: 'POST',
    desc: '类目-详情查询',
    path: 'CategorySys/info'
  },
  {
    name: 'merchantNo',
    method: 'POST',
    desc: '商户-启用',
    showSuccess: true,
    path: 'Merchant/no'
  },
  {
    name: 'merchantOff',
    method: 'POST',
    desc: '商户-禁用',
    showSuccess: true,
    path: 'Merchant/off'
  },
  {
    name: 'merchantListPlatformSite',
    method: 'POST',
    singleLoading: true,
    desc: '商户-鼠标移动上去查看',
    path: 'Merchant/list/platformSite'
  },
  {
    name: 'categorySysSave',
    method: 'POST',
    showSuccess: true,
    desc: '类目-新增',
    path: 'CategorySys/save'
  },
  {
    name: 'categorySysUpdaye',
    method: 'POST',
    showSuccess: true,
    desc: '类目-编辑（也适用人群设置）',
    path: 'CategorySys/update'
  },
  {
    name: 'categorySysRemove',
    method: 'POST',
    desc: '类目-删除',
    path: 'CategorySys/remove'
  },
  {
    name: 'categorySysSearch',
    method: 'POST',
    desc: '类目-搜索',
    path: 'CategorySys/search',
    type: 'formdata'
  },
  {
    name: 'categorySysDropdownList',
    method: 'POST',
    desc: '类目下拉值',
    path: 'CategorySys/dropdownList',
    config: {
      keep: true
    }
  },
  {
    name: 'categorySysDropdownListHasParent',
    method: 'POST',
    desc: '类目下拉值(包含父类目名称)',
    path: 'CategorySys/dropdownList/hasParent'
  },
  {
    name: 'categorySysGetAllNodeHasParentList',
    method: 'POST',
    desc: '所有类目节点（包含了父类目名称）',
    path: 'CategorySys/getAllNodeHasParentList'
  },
  {
    name: 'categoryPlatformSiteDropdownList',
    method: 'POST',
    desc: '类目（平台站点）下拉值',
    path: 'CategoryPlatformSite/dropdownList',
    config: {
      keep: true
    }
  },

  {
    name: 'systemSettingListSafetyConst',
    method: 'POST',
    desc: '安全范围-通用约束查看',
    path: 'GeneralConst/list'
  },
  {
    name: 'systemSettingUpdateSafetyConst',
    method: 'POST',
    desc: '安全范围-通用约束查看',
    showSuccess: true,
    path: 'GeneralConst/update'
  },
  {
    name: 'accountConstParamList',
    method: 'POST',
    desc: '安全范围-账号类目约束查看',
    // showSuccess: true,
    path: 'AccountConstParam/list'
  },
  {
    name: 'accountConstParamUpdate',
    method: 'POST',
    desc: '安全范围-账号类目约束编辑',
    showSuccess: true,
    path: 'AccountConstParam/update'
  },
  {
    name: 'accountConstParamMaxCategoryCount',
    method: 'POST',
    desc: '安全范围-最大类目值限制',
    path: 'AccountConstParam/maxCategoryCount'
  },
  {
    name: 'taskTypeConstList',
    method: 'POST',
    desc: '安全范围-任务类型约束查看',
    // showSuccess: true,
    path: 'TaskTypeConst/list'
  },
  {
    name: 'taskTypeConstUpdate',
    method: 'POST',
    desc: '安全范围-任务类型约束编辑',
    showSuccess: true,
    path: 'TaskTypeConst/update'
  },
  {
    name: 'crowdList',
    method: 'POST',
    desc: '人群-列表查询',
    // showSuccess: true,
    path: 'Crowd/list'
  },
  {
    name: 'crowdInfo',
    method: 'POST',
    desc: '人群-详情查询',
    // showSuccess: true,
    path: 'Crowd/info'
  },
  {
    name: 'crowdSave',
    method: 'POST',
    desc: '人群-新增',
    showSuccess: true,
    path: 'Crowd/save'
  },
  {
    name: 'crowdDropdownList',
    method: 'POST',
    desc: '人群-下拉',
    showSuccess: true,
    path: 'Crowd/dropdownList'
  },
  {
    name: 'crowdUpdate',
    method: 'POST',
    desc: '人群-编辑',
    showSuccess: true,
    path: 'Crowd/update'
  },
  {
    name: 'crowdRemove',
    method: 'POST',
    desc: '人群属性-删除',
    showSuccess: true,
    path: 'Crowd/remove'
  },
  {
    name: 'crowdPropertyList',
    method: 'POST',
    desc: '人群属性-列表查询',
    // showSuccess: true,
    path: 'CrowdProperty/list'
  },
  {
    name: 'crowdPropertyInfo',
    method: 'POST',
    desc: '人群属性-详情查询',
    // showSuccess: true,
    path: 'CrowdProperty/info'
  },
  {
    name: 'crowdPropertyDropdownList',
    method: 'POST',
    desc: '人群属性-下拉值查询',
    // showSuccess: true,
    path: 'CrowdProperty/dropdownList'
  },
  {
    name: 'crowdPropertySave',
    method: 'POST',
    desc: '人群属性-新增',
    showSuccess: true,
    path: 'CrowdProperty/save'
  },
  {
    name: 'crowdPropertyUpdate',
    method: 'POST',
    desc: '人群属性-编辑',
    showSuccess: true,
    path: 'CrowdProperty/update'
  },
  {
    name: 'crowdPropertyRemove',
    method: 'POST',
    desc: '人群属性-删除',
    showSuccess: true,
    path: 'CrowdProperty/remove'
  },
  {
    name: 'categoryVmShopList',
    method: 'POST',
    desc: '类目(店铺虚拟机)-列表查询',
    // showSuccess: true,
    path: 'CategoryVmShop/list'
  },
  {
    name: 'categoryVmShopInfo',
    method: 'POST',
    desc: '类目(店铺虚拟机)-详情查询',
    // showSuccess: true,
    path: 'CategoryVmShop/info'
  },
  {
    name: 'categoryVmShopSave',
    method: 'POST',
    desc: '类目(店铺虚拟机)-新增',
    showSuccess: true,
    path: 'CategoryVmShop/save'
  },
  {
    name: 'categoryVmShopUpdate',
    method: 'POST',
    desc: '类目(店铺虚拟机)-编辑',
    showSuccess: true,
    path: 'CategoryVmShop/update'
  },
  {
    name: 'categoryVmShopRemove',
    method: 'POST',
    desc: '类目(店铺虚拟机)-删除',
    showSuccess: true,
    path: 'CategoryVmShop/remove'
  },
  {
    name: 'categoryVmShopSearch',
    method: 'POST',
    desc: '类目(店铺虚拟机)-搜索',
    path: 'CategoryVmShop/search'
  },
  {
    name: 'categoryVmShopDropdownList',
    method: 'POST',
    desc: '类目(店铺虚拟机)-下拉值',
    path: 'CategoryVmShop/dropdownList'
  },
  {
    name: 'categoryVmShopDropdownListHasParent',
    method: 'POST',
    desc: '类目(店铺虚拟机)-下拉值(包含父类目名称)',
    path: 'CategoryVmShop/dropdownList/hasParent'
  },
  {
    name: 'categoryVmShopGetAllNodeHasParentList',
    method: 'POST',
    desc: '类目(店铺虚拟机)-所有类目节点（包含了父类目名称）',
    path: 'CategoryVmShop/getAllNodeHasParentList'
  },
  {
    name: 'vmShopList',
    method: 'POST',
    desc: '店铺虚拟机-列表查询',
    path: 'VmShop/list'
  },
  {
    name: 'vmShopInfo',
    method: 'POST',
    desc: '店铺虚拟机-详情查询',
    path: 'VmShop/info'
  },
  {
    name: 'vmShopSave',
    method: 'POST',
    desc: '店铺虚拟机-新增',
    showSuccess: true,
    path: 'VmShop/save'
  },
  {
    name: 'vmShopUpdate',
    method: 'POST',
    desc: '店铺虚拟机-编辑',
    showSuccess: true,
    path: 'VmShop/update'
  },
  {
    name: 'vmShopRemove',
    method: 'POST',
    desc: '店铺虚拟机-删除',
    showSuccess: true,
    path: 'VmShop/remove'
  },
  {
    name: 'vmShopOpen',
    method: 'POST',
    desc: '店铺虚拟机-打开',
    showSuccess: true,
    path: 'VmShop/open'
  },
  {
    name: 'vmShopClose',
    method: 'POST',
    desc: '店铺虚拟机-关闭',
    showSuccess: true,
    path: 'VmShop/close'
  },
  {
    name: 'taskStatisticsSupplementExportTemplate',
    method: 'POST',
    desc: '账号-操作记录统计-下载模板',
    config: {
      responseType: 'blob'
    },
    showSuccess: true,
    path: 'TaskStatisticsSupplement/exportTemplate'
  },
  {
    name: 'taskStatisticsSupplementImportData',
    method: 'POST',
    showSuccess: true,
    singleLoading: true,
    desc: '账号-操作记录统计-导入数据',
    path: 'TaskStatisticsSupplement/importData'
  },
  {
    name: 'taskStatisticsListSeller',
    method: 'POST',
    singleLoading: true,
    desc: '账号-任务统计-购买卖家列表',
    path: 'TaskStatistics/list/seller'
  },
  {
    name: 'taskStatisticsListCategorySys',
    method: 'POST',
    singleLoading: true,
    desc: '账号-任务统计-购买类目列表',
    path: 'TaskStatistics/list/categorySys'
  },
  {
    name: 'incomeStatistics',
    method: 'POST',
    desc: '财务概况-收入统计',
    mock: false,
    path: 'Income/statistics'
  },
  {
    name: 'expendStatistics',
    method: 'POST',
    desc: '财务概况-支出统计',
    mock: false,
    path: 'Expend/statistics'
  },
  {
    name: 'incomeStatisticsProportion',
    method: 'POST',
    desc: '财务概况-累计收入占比',
    mock: false,
    path: 'Income/statistics/proportion'
  },
  {
    name: 'expendStatisticsProportion',
    method: 'POST',
    mock: false,
    desc: '财务概况-累计支出占比',
    path: 'Expend/statistics/proportion'
  },
  {
    name: 'expendOptionList',
    mock: false,
    method: 'POST',
    desc: '支出项-列表查询',
    path: 'ExpendOption/list'
  },
  {
    name: 'expendOptionInfo',
    mock: false,
    method: 'POST',
    desc: '支出项-详情查询',
    path: 'ExpendOption/info'
  },
  {
    name: 'expendOptionSave',
    mock: false,
    method: 'POST',
    desc: '支出项-新增', showSuccess: true,
    path: 'ExpendOption/save'
  },
  {
    name: 'expendOptionUpdate',
    mock: false,
    method: 'POST',
    desc: '支出项-编辑', showSuccess: true,
    path: 'ExpendOption/update'
  },
  {
    name: 'expendOptionRemove',
    mock: false,
    method: 'POST', showSuccess: true,
    desc: '支出项-删除',
    path: 'ExpendOption/remove'
  },
  {
    name: 'expendOptionDropdownList',
    mock: false,
    method: 'POST',
    desc: '支出项-下拉值查询',
    path: 'ExpendOption/dropdownList'
  },
  {
    name: 'expendRecordList',
    mock: false,
    method: 'POST',
    desc: '支出记录-列表查询',
    path: 'ExpendRecord/list'
  },
  {
    name: 'expendRecordInfo',
    mock: false,
    method: 'POST',
    desc: '支出记录-详情查询',
    path: 'ExpendRecord/info'
  },
  {
    name: 'expendRecordSave',
    method: 'POST',
    mock: false,
    desc: '支出记录-新增',
    showSuccess: true,
    path: 'ExpendRecord/save'
  },
  {
    name: 'expendRecordUpdate',
    method: 'POST',
    desc: '支出记录-编辑',
    showSuccess: true,
    mock: false,
    path: 'ExpendRecord/update'
  },
  {
    name: 'expendRecordRemove',
    method: 'POST',
    mock: false,
    desc: '支出记录-删除',
    showSuccess: true,
    path: 'ExpendRecord/remove'
  },
  {
    name: 'merchantPayCurrentDateStatistics',
    method: 'POST',
    mock: false,
    desc: '财务概况-今日充值金额',
    path: 'MerchantPay/currentDateStatistics'
  },
  {
    name: 'incomeStatisticsGraph',
    method: 'POST',
    desc: '财务概况-收入曲线图',
    path: 'Income/statistics/graph'
  },
  {
    name: 'expendStatisticsGraph',
    method: 'POST',
    desc: '财务概况-支出曲线图',
    path: 'Expend/statistics/graph'
  },
  {
    name: 'incomeExportData',
    method: 'POST',
    config: {
      responseType: 'blob'
    },
    showSuccess: true,
    desc: '财务概况-收入导出',
    path: 'Income/exportData'
  },
  {
    name: 'expendExportData',
    method: 'POST',
    desc: '财务概况-支出导出', config: {
      responseType: 'blob'
    },
    showSuccess: true,
    path: 'Expend/exportData'
  },
  {
    name: 'categorySysExportTemplate',
    method: 'POST',
    desc: '类目-下载模板', config: {
      responseType: 'blob'
    },
    showSuccess: true,
    path: 'CategorySys/exportTemplate'
  },
  {
    name: 'categorySysImportData',
    method: 'POST',
    desc: '类目-导入',
    showSuccess: true,
    path: 'CategorySys/importData'
  },
  {
    name: 'exchangeRateList',
    method: 'POST',
    desc: '汇率列表',
    path: 'ExchangeRate/list'
  },
  {
    name: 'exchangeRateUpdate',
    method: 'POST',
    desc: '更新汇率列表',
    showSuccess: true,
    path: 'ExchangeRate/update'
  },
  {
    name: 'exchangeRateCurrency',
    method: 'POST',
    desc: '币种',
    path: 'ExchangeRate/currency'
  },
  {
    name: 'taskSourceList',
    method: 'POST',
    desc: '任务源(商户)-列表查询',
    path: 'TaskSource/list'
  },
  {
    name: 'taskSourceInfo',
    method: 'POST',
    desc: '任务源(商户)-详情',
    path: 'TaskSource/info'
  },
  {
    name: 'taskSourceTaskMoney',
    method: 'POST',
    desc: '任务源(商户)-任务佣金',
    path: 'TaskSource/taskMoney'
  },
  {
    name: 'merchantPlatformSitePlatformSite',
    method: 'POST',
    desc: '任务源(商户)-商户平台站点',
    path: 'MerchantPlatformSite/platformSite'
  },
  {
    name: 'categoryDropdownListHasLastLevel',
    method: 'POST',
    desc: '任务源(商户)-类目下拉选择',
    path: 'Category/dropdownList/hasLastLevel'
  },
  {
    name: 'merchantStoreDropdownList',
    method: 'POST',
    desc: '任务源(商户)-店铺下拉选择',
    path: 'MerchantStore/dropdownList'
  },
  {
    name: 'taskSourceAgeDropdownList',
    method: 'POST',
    desc: '任务源(商户)-年龄段',
    path: 'TaskSource/age/dropdownList'
  },
]
