import Layout from '@/components/Layout/Layout';

const routes = {
  path: '/menu',
  redirect: '/menu/index',
  name: "menu",
  meta: {
    title: "操作人员管理"
  },
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('Views/CompanyManagement/Menu/index'),
  }]
}

export default routes