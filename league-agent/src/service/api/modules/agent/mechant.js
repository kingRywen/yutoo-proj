

export default [
  {
    name: 'merchantInfo',
    method: 'POST',
    desc: '商户-详情',
    path: '/Merchant/info',
    params: {}
  },
  {
    name: 'merchantUpdateMobile',
    method: 'POST',
    desc: '商户-修改手机',
    showSuccess: true,
    path: '/Merchant/updateMobile',
    params: {}
  },
  {
    name: 'merchantUpdatePassword',
    method: 'POST',
    desc: '商户-修改密码',
    showSuccess: true,
    path: '/Merchant/updatePassword',
    params: {}
  },
  {
    name: 'merchantInvite',
    method: 'POST',
    showSuccess: true,
    desc: '商户-邀请入驻',
    path: '/Merchant/invite',
    params: {}
  },
]
