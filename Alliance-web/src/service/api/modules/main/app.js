export default [{
  name: 'mobileList',
  method: 'POST',
  mock: true,
  desc: '手机列表',
  path: 'mobile/list'
},
{
  name: 'mobilePay',
  method: 'POST',
  mock: true,
  desc: '手机充值', showSuccess: true,
  path: 'mobile/pay'
},
{
  name: 'mobileInfo',
  mock: true,
  method: 'POST',
  desc: '手机详情页',
  // singleLoading: true,
  path: 'mobile/info'
},
{
  name: 'mobileSave',
  mock: true,
  method: 'POST',
  desc: '手机新增接口', showSuccess: true,
  path: 'mobile/save'
},
{
  name: 'mobileUpdate',
  mock: true,
  method: 'POST',
  desc: '手机编辑接口', showSuccess: true,
  path: 'mobile/update'
},
{
  name: 'mobileRemove',
  method: 'POST',
  mock: true,
  desc: '手机删除接口', showSuccess: true,
  path: 'mobile/remove'
},
]