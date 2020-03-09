export default [
  {
    name: 'sysGetVerificationCode',
    method: 'POST',
    desc: '获取验证码',
    showSuccess: true,
    type: 'form',
    path: 'sys/getVerificationCode',
  },
  {
    name: 'sysResetPassword',
    method: 'POST',
    showSuccess: true,
    type: 'form',
    desc: '重置密码',
    path: 'sys/resetPassword',
  },
  {
    name: 'taskSourceList',
    method: 'POST',
    desc: '发布任务-列表查询',
    path: '/TaskSource/list',
    params: {}
  },
  {
    name: 'taskSourceCheckBalance',
    method: 'POST',
    desc: '发布任务-提交校验余额够不够',
    path: '/TaskSource/checkBalance',
    params: {}
  },
  {
    name: 'taskSourceFeedbackRemove',
    method: 'POST',
    singleLoading: true,
    desc: '任务反馈-删除',
    path: '/TaskSourceFeedback/remove',
    params: {}
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
  {
    name: 'constantGetOssSignature',
    method: 'POST',
    desc: '获取oss签名',
    path: '/constant/get/oss/signature',

    params: {}
  },
  {
    name: 'taskSourceAgeDropdownList',
    method: 'POST',
    desc: '发布任务-年龄段',
    path: '/TaskSource/age/dropdownList',
    params: {}
  },
  {
    name: 'taskSourceTaskMoney',
    method: 'POST',
    desc: '发布任务-任务佣金',
    path: 'TaskSource/taskMoney',
    params: {}
  },
  {
    name: 'taskSourceSave',
    method: 'POST',
    desc: '发布任务-新增',
    path: '/TaskSource/save',
    showSuccess: true,
    params: {}
  },
  {
    name: 'taskSourceInfo',
    method: 'POST',
    desc: '发布任务-详情',
    path: '/TaskSource/info',
    params: {}
  },
  {
    name: 'taskSourceUpdate',
    method: 'POST',
    desc: '发布任务-编辑',
    showSuccess: true,
    path: '/TaskSource/update',
    params: {}
  },
  {
    name: 'taskSourceTermination',
    method: 'POST',
    desc: '发布任务-终止任务',
    showSuccess: true,
    path: '/TaskSource/termination',
    params: {}
  },
  {
    name: 'taskSourceRemove',
    method: 'POST',
    desc: '发布任务-删除',
    showSuccess: true,
    path: '/TaskSource/remove',
    params: {}
  },
  {
    name: 'taskSourceMaxTaskCount',
    method: 'POST',
    desc: '发布任务-获取最大任务总数',
    path: '/TaskSource/maxTaskCount',
    params: {}
  },
  {
    name: 'merchantProductRecycleRecycleCostExplanation',
    method: 'POST',
    desc: '费用说明',
    path: '/MerchantProductRecycle/recycleCost/explanation',
    params: {}
  },
  {
    name: 'taskSourceReviewExportTemplate',
    method: 'POST',
    type: 'form',
    desc: '发布任务-评价模版下载', config: { responseType: 'blob' },
    showSuccess: true,
    path: '/TaskSource/review/exportTemplate',
    params: {}
  },
  {
    name: 'taskSourceReviewImportData',
    method: 'POST',
    desc: '发布任务-评价导入',
    showSuccess: true,
    path: '/TaskSource/review/importData',
    params: {}
  },
  {
    name: 'taskSourceQaExportTemplate',
    method: 'POST',
    type: 'form',
    desc: '发布任务-QA模版下载', config: { responseType: 'blob' },
    showSuccess: true,
    path: '/TaskSource/qa/exportTemplate',
    params: {}
  },
  {
    name: 'taskSourceQaImportData',
    method: 'POST',
    desc: '发布任务-QA导入',
    showSuccess: true,
    path: '/TaskSource/qa/importData',
    params: {}
  },
  {
    name: 'taskSourceFeedbackList',
    method: 'POST',
    desc: '任务反馈-查看',
    path: '/TaskSourceFeedback/list',
    params: {}
  },
  {
    name: 'taskSourceFeedbackSave',
    method: 'POST',
    desc: '任务反馈-新增',
    showSuccess: true,
    path: '/TaskSourceFeedback/save',
    params: {}
  },
  {
    name: 'platformOrderList',
    method: 'POST',
    desc: '订单列表-列表查看',
    path: '/PlatformOrder/list',
    params: {}
  },
  {
    name: 'platformOrderAskForReview',
    method: 'POST',
    desc: '订单列表-索评',
    singleLoading: true,
    showSuccesss: true,
    path: '/PlatformOrder/askForReview',
    params: {}
  },
];
