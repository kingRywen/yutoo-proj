import ebay from './ebay'
export default [
  ...ebay,
  {
    // 营销策略设置
    name: 'marketPolicyInfo',
    method: 'POST',
    desc: '营销策略-详情',
    path: '/email/market/policy/info',
    mockPath: '/email/market/policy/info',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'marketPolicyCopy',
    method: 'POST',
    desc: '营销策略-复制添加',
    path: '/email/market/policy/copy',
    mockPath: '/email/market/policy/copy',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'marketPolicyRemove',
    method: 'POST',
    desc: '营销策略-删除',
    path: '/email/market/policy/remove',
    mockPath: '/email/market/policy/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'getStoreProductAsin',
    method: 'POST',
    desc: '获取产品asin',
    path: '/email/market/policy/getStoreProductAsin',
    mockPath: '/email/market/policy/getStoreProductAsin',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'marketPolicySave',
    method: 'POST',
    desc: '营销策略-添加',
    path: '/email/market/policy/save',
    mockPath: '/email/market/policy/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'marketPolicyUpdate',
    method: 'POST',
    desc: '营销策略-修改',
    path: '/email/market/policy/update',
    mockPath: '/email/market/policy/update',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 营销策略设置
    name: 'marketPolicyList',
    method: 'POST',
    desc: '营销策略-列表',
    path: '/email/market/policy/list',
    mockPath: '/email/market/policy/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // review
    name: 'reviewExport',
    method: 'POST',
    desc: 'review-导出',
    path: '/service/amazon/review/export',
    mockPath: '/service/amazon/review/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // review
    name: 'reviewBatchExtract',
    method: 'POST',
    desc: 'review-提取订单号',
    path: '/service/amazon/review/batchExtract',
    mockPath: '/service/amazon/review/batchExtract',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // review
    name: 'reviewSetHandle',
    method: 'POST',
    desc: 'review-批量处理',
    path: '/service/amazon/review/setHandle',
    mockPath: '/service/amazon/review/setHandle',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // review
    name: 'reviewList',
    method: 'POST',
    desc: 'review-列表',
    path: '/service/amazon/review/list',
    mockPath: '/service/amazon/review/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackBatchExtract',
    method: 'POST',
    desc: 'feedback-提取订单号',
    path: '/service/amazon/feedback/batchExtract',
    mockPath: '/service/amazon/feedback/batchExtract',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackContactBuyers',
    method: 'POST',
    desc: 'feedback-发送邮件',
    path: '/service/amazon/feedback/contact/buyers',
    mockPath: '/service/amazon/feedback/contact/buyers',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackGetReason',
    method: 'POST',
    desc: 'feedback-获取差评原因',
    path: '/service/amazon/feedback/get/evaluation/reasons',
    mockPath: '/service/amazon/feedback/get/evaluation/reasons',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackSetReason',
    method: 'POST',
    desc: 'feedback-设置差评原因',
    path: '/service/amazon/feedback/set/evaluation/reasons',
    mockPath: '/service/amazon/feedback/set/evaluation/reasons',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackExport',
    method: 'POST',
    desc: 'feedback-导出',
    path: '/service/amazon/feedback/export',
    mockPath: '/service/amazon/feedback/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackList',
    method: 'POST',
    desc: 'feedback-列表',
    path: '/service/amazon/feedback/list',
    mockPath: '/service/amazon/feedback/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // feedback
    name: 'feedbackSetHandle',
    method: 'POST',
    desc: 'feedback-批量处理',
    path: '/service/amazon/feedback/setHandle',
    mockPath: '/service/amazon/feedback/setHandle',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsInfo',
    method: 'POST',
    desc: '跟卖投诉管理-设置已处理/未处理',
    path: '/service/selling/complaints/info',
    mockPath: '/service/selling/complaints/info',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsSendEmail',
    method: 'POST',
    desc: '跟卖投诉管理-向亚马逊投诉',
    path: '/service/selling/complaints/send/email',
    mockPath: '/service/selling/complaints/send/email',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsSaveEmailContent',
    method: 'POST',
    desc: '跟卖投诉管理-保存',
    path: '/service/selling/complaints/save/email/content',
    mockPath: '/service/selling/complaints/save/email/content',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsGetEmailContent',
    method: 'POST',
    desc: '跟卖投诉管理-获取',
    path: '/service/selling/complaints/get/email/content',
    mockPath: '/service/selling/complaints/get/email/content',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsSetHandle',
    method: 'POST',
    desc: '跟卖投诉管理-设置已处理/未处理',
    path: '/service/selling/complaints/setHandle',
    mockPath: '/service/selling/complaints/setHandle',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsRemove',
    method: 'POST',
    desc: '跟卖投诉管理-删除',
    path: '/service/selling/complaints/remove',
    mockPath: '/service/selling/complaints/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsList',
    method: 'POST',
    desc: '跟卖投诉管理-列表',
    path: '/service/selling/complaints/list',
    mockPath: '/service/selling/complaints/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 跟卖投诉管理
    name: 'complaintsSave',
    method: 'POST',
    desc: '跟卖投诉管理-添加',
    path: '/service/selling/complaints/save',
    mockPath: '/service/selling/complaints/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'recycleAdd',
    method: 'POST',
    desc: '邮件移动到回收站',
    path: '/email/base/recycle/add',
    mockPath: '/email/base/recycle/add',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'baseGet',
    method: 'POST',
    desc: '邮件获取',
    path: '/email/base/get',
    mockPath: '/email/base/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'downloadPathGet',
    method: 'POST',
    desc: '获取oss文件下载http地址',
    path: '/email/account/file/download/path/get',
    mockPath: '/email/account/file/download/path/get',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'pathGet',
    method: 'POST',
    desc: '上传路劲',
    path: '/email/account/file/path/get',
    mockPath: '/email/account/file/path/get',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'baseSave',
    method: 'POST',
    desc: '编辑邮件',
    path: '/email/base/save',
    mockPath: '/email/base/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'baseDraftCommit',
    method: 'POST',
    desc: '发送邮件',
    path: '/email/base/draft/commit',
    mockPath: '/email/base/draft/commit',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'recycleEmpty',
    method: 'POST',
    desc: '回收站清空',
    path: '/email/base/email/recycle/empty',
    mockPath: '/email/base/email/recycle/empty',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'recycleRevert',
    method: 'POST',
    desc: '回收站恢复',
    path: '/email/base/recycle/batch/revert',
    mockPath: '/email/base/recycle/batch/revert',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'outboxAuditUpdate',
    method: 'POST',
    desc: '草稿箱邮件完成审核',
    path: '/email/base/draft/audit/update',
    mockPath: '/email/base/draft/audit/update',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'outboxBatchCommit',
    method: 'POST',
    desc: '草稿箱邮件提交审核',
    path: '/email/base/draft/batch/commit',
    mockPath: '/email/base/draft/batch/commit',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'outboxSendCancel',
    method: 'POST',
    desc: '发件箱邮件取消发送-可批量',
    path: '/email/base/outbox/send/cancel',
    mockPath: '/email/base/outbox/send/cancel',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'outboxSetSuccess',
    method: 'POST',
    desc: '发件箱设置邮件发送成功-可批量',
    path: '/email/base/outbox/send/success/set',
    mockPath: '/email/base/outbox/send/success/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'outboxSendAgain',
    method: 'POST',
    desc: '发件箱选中邮件再次发送-可批量',
    path: '/email/base/outbox/send/again',
    mockPath: '/email/base/outbox/send/again',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'batchOrderGet',
    method: 'POST',
    desc: '批量提取订单号',
    path: '/email/base/inbox/batch/order/num/get',
    mockPath: '/email/base/inbox/batch/order/num/get',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'batchStarSet',
    method: 'POST',
    desc: '收件箱批量设置标记',
    path: '/email/base/inbox/batch/star/set',
    mockPath: '/email/base/inbox/batch/star/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'batchServiceSet',
    method: 'POST',
    desc: '收件箱批量设置客服',
    path: '/email/base/inbox/batch/service/set',
    mockPath: '/email/base/inbox/batch/service/set',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'batchClassificationMove',
    method: 'POST',
    desc: '邮件分类批量改动',
    path: '/email/base/inbox/batch/classification/move',
    mockPath: '/email/base/inbox/batch/classification/move',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'emailPage',
    method: 'POST',
    desc: '邮件分页',
    path: '/email/base/page',
    mockPath: '/email/base/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'inboxSignSet',
    method: 'POST',
    desc: '收件箱邮件标记',
    path: '/email/base/inbox/sign/set',
    mockPath: '/email/base/inbox/sign/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'emailListAdd',
    method: 'POST',
    desc: '邮件黑名单加入',
    path: '/email/black/list/add',
    mockPath: '/email/black/list/add',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    // 发件箱
    name: 'orderNumGet',
    method: 'POST',
    desc: '根据订单号查询所属店铺',
    path: '/email/base/orderNum/get',
    mockPath: '/email/base/orderNum/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //邮件账户管理
    name: 'emailAccountGet',
    method: 'POST',
    desc: '获取账号详情',
    path: '/email/account/get',
    mockPath: '/email/account/get',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //邮件账户管理
    name: 'accountPage',
    method: 'POST',
    desc: '获取账号分页列表',
    path: '/email/account/page',
    mockPath: '/email/account/page',
    // singleLoading: true,
    // mock: false,
    params: {}
  },
  {
    //邮件账户管理
    name: 'accountLogPage',
    method: 'POST',
    desc: '邮箱账号日志分页列表',
    path: '/email/log/accout/page',
    mockPath: '/email/log/accout/page',
    // singleLoading: true,
    // mock: false,
    params: {}
  },
  {
    //邮件账户管理
    name: 'accountGet',
    method: 'POST',
    desc: '获取账号详情',
    path: '/email/account/get',
    mockPath: '/email/account/get',
    // singleLoading: true,
    // mock: false,
    params: {}
  },
  {
    // 邮件账户管理
    name: 'protocolList',
    method: 'POST',
    desc: '获取邮件接收协议列表',
    path: '/email/account/protocol/list',
    mockPath: '/email/account/protocol/list',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    // 邮件账户管理
    name: 'serviceList',
    method: 'POST',
    desc: '获取客服列表',
    path: '/email/account/service/list',
    mockPath: '/email/account/service/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 邮件账户管理
    name: 'emailSave',
    method: 'POST',
    desc: '添加 修改邮件账号',
    path: '/email/account/save',
    mockPath: '/email/account/save',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    // 邮件账户管理
    name: 'deleteAccount',
    method: 'POST',
    desc: '删除邮件账号（可批量）',
    path: '/email/account/batch/remove',
    mockPath: '/email/account/batch/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },

  {
    // 邮件规则管理
    name: 'ruleLogPage',
    method: 'POST',
    desc: '邮件接收规则日志分页列表',
    path: '/email/log/rule/page',
    mockPath: '/email/log/rule/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'skuStorePage',
    method: 'POST',
    desc: '获取产品sku列表',
    path: '/email/rule/store/sku/page',
    mockPath: '/email/rule/store/sku/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'skuAccountPage',
    method: 'POST',
    desc: '获取产品sku列表',
    path: '/email/rule/account/sku/page',
    mockPath: '/email/rule/store/sku/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'rulePage',
    method: 'POST',
    desc: '获取邮件规则管理分页列表',
    path: '/email/rule/page',
    mockPath: '/email/rule/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'emailAccountList',
    method: 'POST',
    desc: '获取邮箱账号列表',
    path: '/email/account/list',
    mockPath: '/email/account/list',
    mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'emailRuleSave',
    method: 'POST',
    desc: '邮件规则添加,修改',
    path: '/email/rule/save',
    mockPath: '/email/rule/save',
    // mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'emailRuleRemove',
    method: 'POST',
    desc: '邮件模板删除',
    path: '/email/rule/batch/remove',
    mockPath: '/email/rule/batch/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 邮件规则管理
    name: 'emailServiceSet',
    method: 'POST',
    desc: '邮件规则设置客服',
    path: '/email/rule/customer/service/batch/set',
    mockPath: '/email/rule/customer/service/batch/set',
    // mock: false,
    params: {}
  },
  {
    //邮件规则管理
    name: 'emailRuleDataGet',
    method: 'POST',
    desc: '邮件规则复制添加',
    path: '/email/rule/data/get',
    mockPath: '/email/rule/data/get',
    // mock: false,
    params: {}
  },
  {
    //邮件规则管理
    name: 'emailRuleGet',
    method: 'POST',
    desc: '邮件规则详情',
    path: '/email/rule/get',
    mockPath: '/email/rule/get',
    // mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templateSave',
    method: 'POST',
    desc: '邮件模板添加修改',
    path: '/email/template/save',
    mockPath: '/email/template/save',
    mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templateGet',
    method: 'POST',
    desc: '邮件模板获取',
    path: '/email/template/get',
    mockPath: '/email/template/get',
    mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templateDataGet',
    method: 'POST',
    desc: '邮件模板复制添加',
    path: '/email/template/data/get',
    mockPath: '/email/template/data/get',
    mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templateRemove',
    method: 'POST',
    desc: '邮件模板删除',
    path: '/email/template/batch/remove',
    mockPath: '/email/template/batch/remove',
    mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templatePage',
    method: 'POST',
    desc: '邮件模板分页列表',
    path: '/email/template/page',
    mockPath: '/email/template/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    // 邮件模板管理
    name: 'templateGroupList',
    method: 'POST',
    desc: '邮件模板模糊查询',
    path: '/email/template/group/list',
    mockPath: '/email/template/group/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationList',
    method: 'POST',
    desc: '邮件自定义分类列表',
    path: '/email/classification/list',
    mockPath: '/email/classification/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationPage',
    method: 'POST',
    desc: '邮件自定义分类分页列表',
    path: '/email/classification/page',
    mockPath: '/email/classification/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    //  模板自定义分类
    name: 'classificationTemplateList',
    method: 'POST',
    desc: '模板自定义分类分页列表',
    path: '/email/classification/template/list',
    mockPath: '/email/classification/template/list',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationGet',
    method: 'POST',
    desc: '邮件自定义分类获取',
    path: '/email/classification/get',
    mockPath: '/email/classification/get',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationSave',
    method: 'POST',
    desc: '邮件自定义分类修改添加',
    path: '/email/classification/save',
    mockPath: '/email/classification/save',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationRemoveCheck',
    method: 'POST',
    desc: '删除自定义分类校验',
    path: '/email/classification/remove/check',
    mockPath: '/email/classification/remove/check',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    //  邮件自定义分类
    name: 'classificationRemove',
    method: 'POST',
    desc: '邮件自定义分类删除 (可批量)',
    path: '/email/classification/batch/remove',
    mockPath: '/email/classification/batch/remove',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyLogPage',
    method: 'POST',
    desc: '邮件自动回复规则日志分页列表',
    path: '/email/log/reply/policy/page',
    mockPath: '/email/log/reply/policy/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyPage',
    method: 'POST',
    desc: '邮件自动回复策略分頁查询',
    path: '/email/reply/policy/page',
    mockPath: '/email/reply/policy/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'storeSkuPage',
    method: 'POST',
    desc: '获取产品sku列表',
    path: '/email/rule/store/sku/page',
    mockPath: '/email/rule/store/sku/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replySave',
    method: 'POST',
    desc: '自动回复策略添加修改',
    path: '/email/reply/policy/save',
    mockPath: '/email/reply/policy/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyGet',
    method: 'POST',
    desc: '邮件自动回复策略获取',
    path: '/email/reply/policy/get',
    mockPath: '/email/reply/policy/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyRemove',
    method: 'POST',
    desc: '邮件自动回复策略批量删除',
    path: '/email/reply/policy/batch/remove',
    mockPath: '/email/reply/policy/batch/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyDataGet',
    method: 'POST',
    desc: '邮件自动回复策略复制添加(类似查询功能，编辑后保存)',
    path: '/email/reply/policy/data/get',
    mockPath: '/email/reply/policy/data/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyPolicyList',
    method: 'POST',
    desc: '邮件自动回复策略列表',
    path: '/email/reply/policy/list',
    mockPath: '/email/reply/policy/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复策略
    name: 'replyTimeSet',
    method: 'POST',
    desc: '邮件自动回复策略批量设置时间',
    path: '/email/reply/policy/batch/time/set',
    mockPath: '/email/reply/policy/batch/time/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复记录
    name: 'historyDownloadConditions',
    method: 'POST',
    desc: '邮件自动回复记录按当前条件导出',
    path: '/email/auto/reply/history/download/conditions',
    mockPath: '/email/auto/reply/history/download/conditions',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复记录
    name: 'historyDownloadPolicy',
    method: 'POST',
    desc: '邮件自动回复记录按自动回复策略导出',
    path: '/email/auto/reply/history/download/policy',
    mockPath: '/email/auto/reply/history/download/policy',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复记录
    name: 'autoHistoryPage',
    method: 'POST',
    desc: '邮件自动回复记录分页查询',
    path: '/email/auto/reply/history/page',
    mockPath: '/email/auto/reply/history/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    //  邮件自动回复记录
    name: 'autoHistoryDownload',
    method: 'POST',
    desc: '邮件自动回复记录当前条件导出',
    path: '/email/auto/reply/history/download',
    mockPath: '/email/auto/reply/history/download',
    showSuccess: false,
    // mock: false,
    params: {}
  },
  {
    //  邮件黑名单
    name: 'blackSave',
    method: 'POST',
    desc: '邮件黑名单添加修改',
    path: '/email/black/list/save',
    mockPath: '/email/black/list/save',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //  邮件黑名单
    name: 'blackRemove',
    method: 'POST',
    desc: '邮件黑名单删除（可批量）',
    path: '/email/black/list/batch/remove',
    mockPath: '/email/black/list/batch/remove',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //  邮件黑名单
    name: 'blackGet',
    method: 'POST',
    desc: '邮件黑名单获取',
    path: '/email/black/list/get',
    mockPath: '/email/black/list/get',
    showSuccess: true,
    // mock: false,
    params: {}
  },
  {
    //  邮件黑名单
    name: 'blackPage',
    method: 'POST',
    desc: '邮件黑名单分页查询',
    path: '/email/black/list/page',
    mockPath: '/email/black/list/page',
    showSuccess: false,
    // mock: false,
    params: {}
  },

  //2019-1-5 laihq
  {
    name: 'examineList',
    method: 'POST',
    desc: '待审核订单-列表',
    path: '/service/wait/examine/list',
    mockPath: '/service/wait/examine/list',
    // mock: false,
    params: {}
  },
  {
    name: 'examineExamine',
    method: 'POST',
    desc: '待审核订单-审核',
    path: '/service/wait/examine/examine',
    params: {}
  },
  {
    name: 'examineUpdate',
    method: 'POST',
    desc: '修改收货信息',
    path: '/service/wait/examine/update',
    params: {}
  },
  {
    name: 'returnList',
    method: 'POST',
    desc: '订单退换货-列表',
    path: '/service/return/list',
    params: {}
  },
  {
    name: 'returnExamine',
    method: 'POST',
    desc: '退换货管理-审核',
    path: '/service/return/examine',
    params: {}
  },
  {
    name: 'returnDetail',
    method: 'POST',
    desc: '退换货管理-详情',
    path: '/service/return/detail',
    params: {}
  },

  //

  {
    name: 'logList',
    method: 'POST',
    desc: '客服售后记录-列表',
    path: '/service/log/list',
    mockPath: '/service/log/list',
    params: {}
  },
  {
    name: 'logSave',
    method: 'POST',
    desc: '客服售后记录-添加',
    path: '/service/log/save',
    params: {}
  },
  {
    name: 'logInfo',
    method: 'POST',
    desc: '客服售后记录-详情',
    path: '/service/log/info',
    params: {}
  },
  {
    name: 'setCompleteSituation',
    method: 'POST',
    desc: '客服售后记录-设置完成情况',
    path: '/service/log/setCompleteSituation',
    params: {}
  },
  {
    name: 'logExport',
    method: 'POST',
    desc: '客服售后记录-当前条件导出',
    path: '/service/log/export',
    params: {}
  },
  {
    name: 'logSetRemark',
    method: 'POST',
    desc: '客服售后记录-备注',
    path: '/service/log/setRemark',
    params: {}
  },
  {
    name: 'refundList',
    method: 'POST',
    desc: '订单退款管理-列表',
    path: '/service/refund/list',
    params: {}
  },
  {
    name: 'refundInfo',
    method: 'POST',
    desc: '订单退款管理-详情',
    path: '/service/refund/info',
    params: {}
  },
  {
    name: 'refundExamine',
    method: 'POST',
    desc: '订单退款管理-批量审核',
    path: '/service/refund/examine',
    params: {}
  },
  {
    name: 'refundSetRefundState',
    method: 'POST',
    desc: '订单退款管理-批量设置退款状态',
    path: '/service/refund/setRefundState',
    params: {}
  },
  {
    name: 'serviceRefundExport',
    method: 'POST',
    desc: '订单退款管理-当前条件导出',
    path: '/service/refund/export',
    mockPath: '/',
    params: {}
  },
  {
    name: 'emailReplyPolicyDefaultGet',
    method: 'POST',
    desc: '【邮件自动回复策略】获取邮件默认回复模板',
    path: '/email/reply/policy/default/get',
    mockPath: '/',
    params: {}
  },
  {
    name: 'emailReplyPolicyDefaultSave',
    method: 'POST',
    desc: '【邮件自动回复策略】编辑邮件默认回复模板',
    path: '/email/reply/policy/default/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'serviceRefundCancel',
    method: 'POST',
    desc: '订单退款管理-作废或者取消作废',
    path: '/service/refund/cancel',
    mockPath: '/',
    params: {}
  }
]
