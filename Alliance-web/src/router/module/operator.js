import HeaderAsideLayout from 'Layouts/HeaderAsideLayout';

export default [
  {
    path: '/allotLogin',
    component: () => import('Views/Login/AllotLogin'),
    name: "allotLogin",
    meta: {
      title: "操作员登录"
    }
  },
  {
    path: '/allotTask',
    component: HeaderAsideLayout,

    children: [
      {
        path: '',
        component: () => import('Views/AllotTask'),
        name: "allotTask",
        meta: {
          title: "操作任务"
        },
      }
    ]
  },
  {
    path: '/sys', //系统设置
    meta: {
      title: "系统设置"
    },
    children: [{
      path: 'operator',
      component: () => import('Views/Sys/Operator'),
      name: "sysOperator",
      meta: {
        perms: ['add'],
        title: "操作员管理"
      },
    }, {
      path: 'role',
      component: () => import('Views/Sys/Role'),
      name: "sysRole",
      meta: {
        title: "角色管理"
      },
    }],
    component: HeaderAsideLayout,
  },
]
