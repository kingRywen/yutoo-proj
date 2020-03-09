
export default {
  path: '/ReportCenter',
  component: () => import('@/views/warehouse/ReportCenter/index'),
  meta: {
    title: '报告中心'
  },
  children: [
    {
      path: '/ReportCenter/index',
      component: () =>
        import('@/views/warehouse/ReportCenter/components/index.vue'),
      name: 'ReportCenter',
      meta: {
        title: '报告中心'
      },
    }
  ]
}



