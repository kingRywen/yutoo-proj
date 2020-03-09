// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = []
const cateAsideMenuConfig = [
  {
    path: '/Amazon',
    name: '类目分析',
    icon: 'el-icon-menu iconfont1 iconAMAZONleimufenxi',
    children: [{
		  path: '/CateAnalysis',
		  name: '类目分析'
		},
		{
		  path: '/AmazonCateDepthAnalysis',
		  name: '类目深度分析'
		}
    ]
  },
]

export {
  headerMenuConfig,
  cateAsideMenuConfig
}