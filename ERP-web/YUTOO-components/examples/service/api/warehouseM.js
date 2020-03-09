//仓库管理
export default [
  {
    name: 'WmWarehouseGlobalList',
    method: 'POST',
    desc: '仓库列表查询',
    path: '/WmWarehouse/global/list',
    params: {}
  },
  {
    name: 'WWarehouseGlobalDivisionList',
    method: 'POST',
    desc: '仓库分区列表查询',
    path: '/WmWarehouse/global/division/list',
    params: {}
  },
  {
    name: 'WmLocationGlobalList',
    method: 'POST',
    desc: '仓库库位列表查询',
    path: '/WmLocation/global/list',
    params: {}
  },
  //拣货篮管理
  {
    name: 'WmPickingBasketList',
    method: 'POST',
    desc: '拣货篮管理',
    path: '/WmPickingBasket/list',
    params: {}
  },
  {
    name: 'WmPickingBasketCreate',
    method: 'POST',
    desc: '创建拣货篮',
    path: '/WmPickingBasket/create',
    params: {}
  },
  {
    name: 'WmPickingBasketInfo',
    method: 'POST',
    desc: '获取拣货篮信息',
    path: '/WmPickingBasket/info',
    params: {}
  },
  {
    name: 'WmPickingBasketUpdate',
    method: 'POST',
    desc: '获取拣货篮信息',
    path: '/WmPickingBasket/update',
    params: {}
  },
  // 拣货篮规格
  {
    name: 'WmPickingBasketNormList',
    method: 'POST',
    desc: '搜索拣货篮规格（分页）',
    path: '/WmPickingBasketNorm/list',
    params: {}
  },
  {
    name: 'WmPickingBasketNormCreate',
    method: 'POST',
    desc: '创建拣货篮规格',
    path: '/WmPickingBasketNorm/create',
    params: {}
  },
  {
    name: 'WmPickingBasketNormInfo',
    method: 'POST',
    desc: '拣货获取信息',
    path: '/WmPickingBasketNorm/info',
    params: {}
  },
  {
    name: 'WmPickingBasketNormUpdate',
    method: 'POST',
    desc: '修改拣货篮规格',
    path: '/WmPickingBasketNorm/update',
    params: {}
  },
  {
    name: 'WmPickingBasketNormDelete',
    method: 'POST',
    desc: '批量删除拣货篮规格',
    path: '/WmPickingBasketNorm/delete',
    params: {}
  },
  {
    name: 'WmPickingBasketNormgetList',
    method: 'POST',
    desc: '获取列表，搜索里面用拣货篮规格',
    path: '/WmPickingBasketNorm/getObjectList',
    params: {}
  },
  //拣货机管理
  {
    name: 'WmPickingRobotList',
    method: 'POST',
    desc: '获取列表，搜索里面用拣货篮规格',
    path: '/WmPickingRobot/list',
    params: {}
  },
  {
    name: 'WmPickingRobotCreate',
    method: 'POST',
    desc: '创建拣货机器人',
    path: '/WmPickingRobot/create',
    params: {}
  },
  {
    name: 'WmPickingRobotDelete',
    method: 'POST',
    desc: '批量删除拣货机器人',
    path: '/WmPickingRobot/delete',
    params: {}
  },
  {
    name: 'WmPickingRobotInfo',
    method: 'POST',
    desc: '拣货机器人信息',
    path: '/WmPickingRobot/info',
    params: {}
  },
  {
    name: 'WmPickingRobotUpdate',
    method: 'POST',
    desc: '修改拣货机器人',
    path: '/WmPickingRobot/update',
    params: {}
  },
  {
    name: 'WmPickingRobotRangeSave',
    method: 'POST',
    desc: '添加机器人负责库位',
    path: '/WmPickingRobotRange/save',
    params: {}
  },
  {
    name: 'WmPickingRobotRangeRemove',
    method: 'POST',
    desc: '删除机器人负责库位',
    path: '/WmPickingRobotRange/remove',
    params: {}
  },
  {
    name: 'WmPickingBasketPrint',
    method: 'POST',
    desc: '打印(拣货篮)',
    path: '/WmPickingBasket/print',
    params: {}
  },
  //拣货篮位置管理
  {
    name: 'WmPickingBasketSeatList',
    method: 'POST',
    desc: '拣货篮位置（分页）',
    path: '/WmPickingBasketSeat/list',
    params: {}
  },
  {
    name: 'WmPickingBasketSeatCreate',
    method: 'POST',
    desc: '创建拣货篮位置',
    path: '/WmPickingBasketSeat/create',
    params: {}
  },
  {
    name: 'WmPickingBasketSeatInfo',
    method: 'POST',
    desc: '拣货篮获取信息',
    path: '/WmPickingBasketSeat/info',
    params: {}
  },
  {
    name: 'WmPickingBasketSeatUpdate',
    method: 'POST',
    desc: '修改拣货篮位置',
    path: '/WmPickingBasketSeat/update',
    params: {}
  },
  {
    name: 'WmPickingBasketSeatPrint',
    method: 'POST',
    desc: '修改拣货篮位置',
    path: '/WmPickingBasketSeat/print',
    params: {}
  }
]
