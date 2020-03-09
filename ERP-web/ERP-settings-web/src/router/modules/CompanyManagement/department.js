import Layout from '@/components/Layout/Layout';

const routes = {
  path: '/department',
  redirect: '/department/index',
  name: "department",
  meta: {
    title: "公司部门管理"
  },
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('Views/CompanyManagement/Department/index'),
  }]
}

export default routes