// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideLayout from './layouts/HeaderAsideLayout';
import Page3 from './pages/Page3';

import Add from './pages/intelligent-replenishment/setCalculate/Add';
import IntelligentReplenishment from './pages/intelligent-replenishment/intelligent-replenishment';
import batchIntelligentReplenishment from './pages/intelligent-replenishment/batch-intelligent-replenishment';
import SetCalculate from './pages/intelligent-replenishment/setCalculate/setCalculate';
import Replenishment from './pages/intelligent-replenishment/replenishment/replenishment';
import NotFound from './pages/NotFound';

import SynchronousLog from './pages/intelligent-replenishment/synchronousLog/synchronousLog'

const routerConfig = [{
    path: '/',
    layout: HeaderAsideLayout,
    meta: {
      title: '智能补货',
    },
    component: IntelligentReplenishment,
    //redirect: 'IntelligentReplenishment',
  },
  {
    path: '/IntelligentReplenishment',
    layout: HeaderAsideLayout,
    component: IntelligentReplenishment,
    meta: {
      title: '智能补货',
    },
    // children: [{
    //     path: '/IntelligentReplenishment/setCalculate',
    //     layout: HeaderAsideLayout,
    //     meta: {
    //       title: '计算公式设置',
    //     },
    //     component: SetCalculate,
    //   },
    //   {
    //     path: '/IntelligentReplenishment/Replenishment',
    //     layout: HeaderAsideLayout,
    //     meta: {
    //       title: '补货明细',
    //     },
    //     component: Replenishment,
    //   },
    // ],
  },
  {
    path: '/IntelligentReplenishment/SynchronousLog',
    layout: HeaderAsideLayout,
    meta: {
      title: '同步日志',
    },
    component: SynchronousLog,
  },
  {
    path: '/IntelligentReplenishment/Replenishment',
    layout: HeaderAsideLayout,
    meta: {
      title: '补货明细',
    },
    component: Replenishment,
  },
  {
    path: '/IntelligentReplenishment/setCalculate',
    layout: HeaderAsideLayout,
    meta: {
      title: '计算公式设置',
    },
    component: SetCalculate,
  },
  {
    path: '/IntelligentReplenishment/setCalculate/add',
    layout: HeaderAsideLayout,
    component: Add,
  },
  {
    path: '/IntelligentReplenishment/setCalculate/edit/:formulaId',
    layout: HeaderAsideLayout,
    component: Add,
  },
  {
    path: '/IntelligentReplenishment/batchReplenishment',
    meta: {
      title: '批量补货',
    },
    layout: HeaderAsideLayout,
    component: batchIntelligentReplenishment,
  },
  {
    path: '*',
    layout: HeaderAsideLayout,
    component: NotFound,
  },
];

export default routerConfig;
