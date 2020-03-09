import blankLayout from '@/components/Layout/blankLayout';
import Layout from '@/components/Layout/Layout';
import department from './department';
import menu from './menu';
import roles from './roles';

const routes = {
  path: '/companyMangement',
  redirect: '/roles',
  name: "companyMangement",
  meta: {
    title: "公司管理"
  },
  component: blankLayout,
  children: [
    department,
    menu,
    roles,
    {
      path: '/dataAuthority',
      component: Layout,
      children: [{
        name: "dataAuthority",
        meta: {
          title: "数据权限管理"
        },
        path: '',
        component: () => import('Views/CompanyManagement/DataAuthority/Index'),
      }]
    }
  ]
}

export default routes