import Layout from '@/components/Layout/Layout';

const routes = {
  path: '/roles',
  redirect: '/roles/index',
  name: "roles",
  meta: {
    title: "角色权限管理"
  },
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('Views/CompanyManagement/Roles/index'),
  }]
}

export default routes