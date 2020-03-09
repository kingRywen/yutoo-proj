export default [
    /**
     *
     * 1. name          路由展示名
     * 2. path          路由路径，最底层路由会带上父级的路径，生成的最终路由形式 ${parent.path}${parent.path}${current.path}
     * 3. showSubMenu   是否显示子菜单，默认不显示
     * 4. isSubMenu     是否在子菜单展示，如果为true会展示在子菜单tab页中
     * 5. showTop       在下拉菜单中展示，默认不展示
     * 6. topMenuname   在下拉菜单中显示的名字
     * 7. leaf          是否设置为最底层菜单，默认为false,目前的路由生成规则是，只有最底层都会生成路由,如果设为true表示无论是否最底层都将生成路由
     * 8. perms         按钮权限，需要与后端协商约定
     * 9. layout        基础布局组件，默认为通用布局 即 src/Layout/Layout.vue
     * 10. width        是否窄屏，窄屏宽度
     * 11. homePath     主菜单跳转地址，level = 1 的路径才生效
     * 12. hideHeader   是否隐藏导航菜单，编辑页一般都会隐藏
     * 13. subMenuName  设置子菜单显示别名，如果设置了这个会用于tab页上的显示
     *
     */
    {
        name: '充值',
        path: '/recharge',
        perms: ['charge']
    },
    {
        name: '发布任务',
        width: true,
        path: '/addTask'
    },
    {
        name: '查看任务',
        width: true,
        path: '/viewTask'
    },
    {
        name: '快速发布',
        width: true,
        path: '/quickAdd'
    },
    {
        name: '编辑任务',
        width: true,
        path: '/editTask'
    },
    {
        name: '任务反馈',
        width: true,
        path: '/feedback'
    },
    {
        name: '充值',
        path: '/recharge'
    },
    {
        name: '消费记录',
        path: '/spend_list'
    },
    // {
    //     name: '商品回收',
    //     path: '/recycling'
    // },
    {
        name: '店铺管理',
        path: '/stores',
        perms: ['add']
    },
    {
        name: '编辑店铺',
        width: true,
        path: '/editStore'
    },
    {
        name: '新增店铺',
        width: true,
        path: '/addStore'
    },
    {
        name: '帮助',
        path: '/help',
        width: true
    },
    {
        name: '消息',
        path: '/message'
    },
    {
        name: '商户中心',
        path: '/user'
    },
    {
        name: '修改密码',
        width: true,
        path: '/editPass'
    }
]
