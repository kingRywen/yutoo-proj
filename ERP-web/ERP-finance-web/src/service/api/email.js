export default [
  {
    name: 'logInfo',
    method: 'POST',
    desc: '客服售后记录-详情',
    path: '/service/log/info',
    params: {}
  },
  {
    // 发件箱
    name: 'downloadPathGet',
    method: 'POST',
    desc: '获取oss文件下载http地址',
    path: '/email/account/file/download/path/get',
    mockPath: '/email/account/file/download/path/get',
    showSuccess: false,
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
    showSuccess: false,
    mock: false,
    params: {}
  }
]
