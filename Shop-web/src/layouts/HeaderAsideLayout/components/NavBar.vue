<template>
  <el-menu
    class="navbar"
    mode="horizontal"
    active-text-color="#909399"
    :unique-opened="false"
    @select="selectFun"
    :default-openeds="openeds"
    :default-active="defaultActive"
  >
    <template>
      <el-menu-item disabled class="dash-logo" index="img">
        <img @click="handleClick" src="~@/assets/images/logo.png" height="65" />
      </el-menu-item>
    </template>
	
	<el-submenu index="2" >
		<template slot="title">
		    <img style="width: 24px;margin-right: 4px;margin-top: -2px;" :src="seller_Img" />
		    <span style="color: #5e5e5e">{{seller_Name ? seller_Name : '英国站'}}</span>
		</template>
		<template  v-for="item in stateData">
			<el-submenu v-if="item.siteList && item.siteList.length" :index="'2_' + item.platformId" :key="'2_' + item.platformId"  >
				<template slot="title">
				    <span style="color: #5e5e5e">{{item.platformName}}</span>
				</template>
				<template  v-for="child in item.siteList">
					<el-submenu v-if="child.sellerList && child.sellerList.length" :index="'2_' + item.platformId + '_' + child.siteId" :key="'2_' + item.platformId + '_' + child.siteId" >
						<template slot="title">
						    <span style="color: #5e5e5e">{{child.siteName}}</span>
						</template>
						<template  v-for="childItem in child.sellerList">
							<el-menu-item :index="'2_' + item.platformId + '_' + child.siteId + '_' + childItem.sellerId + '_' + childItem.sellerAlias" :key="'2_' + item.platformId + '_' + child.siteId + '_' + childItem.sellerId + '_' + childItem.sellerAlias"  >{{childItem.sellerAlias}}</el-menu-item>
						</template>
					</el-submenu>
					<el-menu-item v-else :index="'2_' + item.platformId + '_' + child.siteId" :key="'2_' + item.platformId + '_' + child.siteId"  >{{child.siteName}}</el-menu-item>
				</template>			
			</el-submenu>
			<el-menu-item v-else :index="'2_' + item.platformId" :key="'2_' + item.platformId" >{{item.platformName}}</el-menu-item>
		</template>	
	</el-submenu>
	
    <!-- <el-submenu
      index="shop"
      :show-timeout="timeout"
      :hide-timeout="timeout"
      id="platform"
      popper-class="custom-site"
      :style="noSide ? {marginLeft: 0} : null"
    >
      <template slot="title">
        <img style="width: 24px;margin-right: 4px;margin-top: -2px;" :src="seller_Img" />
        <span style="color: #5e5e5e">{{seller_Name}}</span>
      </template>
      <div class="_scroll _s1" v-if="stateData">
        <el-submenu
          :index="item.platformId + '%_%' + Math.random()"
          v-for="(item, stateIndex) in stateData"
          :show-timeout="timeout"
          :hide-timeout="timeout"
          :key="stateIndex"
        >
          <div
            class="__title"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
            slot="title"
          >{{item.platformName}}</div>
          <div
            class="_scroll _s2"
            @mouseenter="handleS1Enter"
            @mouseleave="handleS1Leave"
            v-for="(value, siteIndex) in item.siteList"
            :key="siteIndex"
          >
            <el-submenu :show-timeout="0" :hide-timeout="0" :index="value.siteId + ''">
              <div slot="title">{{value.siteName}}</div>
              <template>
                <div class="_scroll">
                  <el-menu-item
                    v-for="i in value.sellerList"
                    :index="i.sellerId + '%_%' + i.sellerAlias"
                    :key="i.sellerId"
                  >
                    <div>{{i.sellerAlias}}</div>
                  </el-menu-item>
                </div>
              </template>
            </el-submenu>
          </div>
        </el-submenu>
      </div>
    </el-submenu> -->

    <el-menu-item class="shop-warning" index="badge" v-if="shopWarningFlag" disabled>
      <el-dropdown @command="toggleStore">
        <el-badge :value="shopWarnings.length" :max="99" class="item">
          <el-button type="text" icon="el-icon-de iconfont1 iconbiaoji" size="small"></el-button>
        </el-badge>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in shopWarnings" :command="item" :divided="index !== 0" :key="index">
            <div class="clearfix">
              {{item.name}}
              <span>
                <el-badge class="mark" :value="item.warningCnt" :max="99" />
              </span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
    <el-popover class="storeBtn2" placement="bottom" trigger="click" v-if="!noSide">
      <el-button type="primary" plain size="mini" @click="changeMethod('amazon',0, null, 1)">amazon</el-button>
      <el-button type="primary" plain size="mini" @click="changeMethod('ebay', 0, null, 1)">ebay</el-button>
      <el-button type="text" slot="reference" style="padding: 9px 0px">
        <el-tooltip content="店铺授权" placement="left" effect="light">
          <img src="../../../assets/images/dianpu.png" />
        </el-tooltip>
      </el-button>
    </el-popover>

    <div class="user-profile-container" trigger="click">
      <div class="user-profile-content">
        <el-dropdown @command="logout">
          <div class="user-profile-body">
            <img class="user-avatar" src="../../../assets/images/avator.png" />
            <span class="user-name">{{username}}</span>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item>
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-menu>
</template>

<script>
import USA from '@/assets/images/USA.png'
import storage from 'Utils/saver'
import setSite from 'Service/mixins/setSite'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'NavBar',
  props: ['isCollapse', 'noSide'],
  mixins: [setSite],
  data() {
    return {
      // 判断是否从登录页过来，如果是登录页过来的，已经在app中注册过路由，不需要再注册
      isFromLogin: false,
      // 切换到哪个店铺和站点openeds
      openeds: [],
      USA,
      Img: '',
      timeout: 0
      // stateData: [],
      // seller_Name: "选择店铺"
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'login') {
        vm.isFromLogin = true
      }
    })
  },
  created() {
    if (!this.isFromLogin) {
      // this.changeMethod('amazon', 1)
      this.getSelectPlatform({})
    }
  },

  methods: {
    ...mapActions('ShopWarning', ['getSellerWornCnt']),
    handleMouseenter(e) {
      // console.log(e);
      setTimeout(() => {
        let parent = e.target.parentNode.parentNode
        // console.log(parent.parentNode.querySelectorAll('.el-submenu'));
        ;[].slice
          .call(parent.parentNode.querySelectorAll('.el-submenu'))
          .forEach(el => {
            el.classList.remove('is-opened')
          })
        parent.classList.add('is-opened')
      })
    },
    handleS1Enter(e) {
      if (!e.relatedTarget) {
        return
      }
      if (e.relatedTarget.className.indexOf('_s1') === -1) {
        return
      }
      let child
      ;[].slice.call(e.relatedTarget.children).forEach(el => {
        if (el.className.indexOf('is-opened') > -1) {
          child = el
        }
      })
      setTimeout(() => {
        child && child.classList && child.classList.add('is-opened')
      }, 30)
    },
    handleS1Leave(e) {
      this.handleS1Enter(e)
    },
    handleMouseleave(e) {
      // console.log(e.relatedTarget);

      if (
        e.relatedTarget &&
        e.relatedTarget.className.indexOf('_scroll') > -1
      ) {
        setTimeout(() => {
          // e.relatedTarget.classList.remove('is-opened')
          e.target.parentNode.parentNode.classList.add('is-opened')
        }, 30)
      } else if (
        e.target &&
        e.relatedTarget &&
        e.target.parentNode.parentNode.className.indexOf('is-opened') > -1 &&
        e.relatedTarget.className.indexOf('__title') > -1
      ) {
        setTimeout(() => {
          e.target.parentNode.parentNode.classList.remove('is-opened')
        }, 50)
      }
    },
    handleClick() {
      if (this.$store.state.common.routerType === 'ebay') {
        this.$router.push({ name: 'ebayCategoryAnalysisItem' })
        return
      }
      if (this.$route.path === '/dash') {
        if (this.$route.query.backroute) {
          this.$router.push({ path: this.$route.query.backroute })
        } else {
          this.$router.push('/cate/CateSetup')
        }
      } else {
        this.$router.push({
          path: '/dash',
          query: { backroute: this.$route.fullPath }
        })
      }
    },
    toggleStore(item) {
      const {platformId, sellerId, sellerName, siteId } = item
      this.selectFun(
        '2_'+platformId+'_'+siteId+'_'+sellerId+'_'+sellerName,
        ['2','2_'+platformId,'2_'+platformId+'_'+siteId,'2_'+platformId+'_'+siteId+'_'+sellerId+'_'+sellerName],
        true
      )
    },
    // 选择店铺列表
    selectFun(index, indexPath, toHome) {
      let oldPlatformId = this.$store.state.common.sellerData.platformId
	  
	  if(indexPath && indexPath.length !== 4){
		  //只是站点 只展示类目分析
		  this.$store.commit('common/seller_Name', null)
		  let platformId = parseInt(indexPath[1].split('_')[1]) 
		  let siteId = parseInt(indexPath[2].split('_')[2])
		  let siteList = this.stateData.find(el => {
		    return platformId === el.platformId
		  }).siteList
		  let data = {
		    sellerId: null,
		    platformId: platformId,
		    siteId: siteId,
		    sellerAlias: null,
		    siteList: siteList
		  }
		  sessionStorage.setItem('shop_seller_data', JSON.stringify(data))
		  localStorage.setItem('shop_seller_data', JSON.stringify(data))
		  this.$store.commit('common/sellerData', data)
		  if (indexPath[2] === '1') {
		    this.Img = this.USA
		  }
		  storage.set('local', 'routerType', platformId == 1 ? 'amazon' : 'ebay')
		  storage.set('local', 'isShowCate', true)
		  this.changeMethod('amazon', 1, '/Amazon/CateAnalysis' , false , true)
		  
		  this.$router.push('/Amazon/CateAnalysis')
		  GLOBAL.vbus.$emit('page.main.refresh')
	  }else{
		  storage.set('local', 'isShowCate', false)
		  //有授权店铺的
		  console.log(index, indexPath)
		  let sellerList = indexPath[3].split('_',5)
		  let sellerId = sellerList[3]
		  let sellerAlias = sellerList[4]
		  this.$store.commit('common/seller_Name', sellerAlias)
		  let platformId = parseInt(indexPath[1].split('_')[1]) 
		  let siteId = parseInt(indexPath[2].split('_')[2])
		  // 找到对应的sellerId下的站点seteList，存起来用作类目选择上级的亚马逊映射
		  let siteList = this.stateData.find(el => {
		    return platformId === el.platformId
		  }).siteList
		  let data = {
		    //将店铺id和站点id存入vuex
		    sellerId: sellerId,
		    platformId: platformId,
		    siteId: siteId,
		    sellerAlias: this.seller_Name,
		    // 存siteId用作类目选择上级，亚马孙底层类目映射
		    siteList: siteList
		  }
		  // //将店铺id和站点id存入sessionStorage
		  sessionStorage.setItem('shop_seller_data', JSON.stringify(data))
		  localStorage.setItem('shop_seller_data', JSON.stringify(data))
		  // 存入sellerData
		  this.$store.commit('common/sellerData', data)
		  if (indexPath[2] === '1') {
		    // 如果是美国站，显示美国国旗图片
		    this.Img = this.USA
		  }
		  storage.set('local', 'routerType', platformId == 1 ? 'amazon' : 'ebay')
		  this.changeMethod(platformId == 1 ? 'amazon' : 'ebay', 1)
		  // console.log(platformId !== this.$store.state.common.sellerData.platformId);
		  if (this.$route.path === '/dash' && platformId == 1) {
		    GLOBAL.vbus.$emit('page.main.refresh')
		  } else if (platformId !== oldPlatformId || toHome === true) {
		    if (platformId != 1) {
		      // 如果是ebay，跳转到ebay的类目分析页
		      this.$router.push('/ebayCategoryAnalysis/ebayCategoryAnalysisItem')
		    } else {
		      this.$router.push('/dash')
		    }
		  } else {
		    GLOBAL.vbus.$emit('page.main.refresh')
		  }
	  }
      GLOBAL.vbus.$emit('navbar.menu.select')
    },
    logout() {
      // console.log("Logout");
      let checkAccount = storage.get('local', 'checkAccount')
      let username = storage.get('local', 'username')
      localStorage.clear()
      if (checkAccount) {
        storage.set('local', 'checkAccount', checkAccount)
        storage.set('local', 'username', username)
      }
      sessionStorage.clear()
      this.$store.commit('resetState')
      // location.reload();
      this.$router.push('/login')

      // location.href = '/#/login'
      // setTimeout(() => {
      //   location.reload()
      // });
    },
    storeMethod() {
      this.$router.push('/shopAuthorization')
    }
  },
  watch: {
    'sellerData.platformId': {
      immediate: true,
      handler(platformId) {
        if (platformId != null) {
          this.getSellerWornCnt({ platformId })
        }
      }
    }
  },
  computed: {
    ...mapGetters('ShopWarning', ['shopWarningFlag']),
    ...mapState('ShopWarning', ['shopWarnings']),
    username() {
      let username = storage.get('local', 'username')
      return username
    },

    seller_Name() {
      return this.$store.state.common.seller_Name
    },
    seller_Img() {
      return this.$store.state.common.seller_Img
    },
    defaultActive() {
      let { sellerId, sellerAlias } = this.$store.state.common.sellerData
      return sellerId + '_' + sellerAlias
    }
  }
}
</script>

<style lang="scss">
//选择店铺 自定义chass(elementUi)

.custom-site {
  &.el-menu--horizontal .el-menu .el-submenu__title {
    padding: 0;
  }
  &.el-menu--horizontal .el-menu .el-menu-item {
    padding: 0 10px;
  }

  // border: 1px solid #ddd;
  animation: none !important;
  // .el-menu--popup-bottom-start {
  //   margin-left: 15px !important;
  // }
  .el-zoom-in-top-enter-active,
  .el-zoom-in-top-leave-active {
    animation: none !important;
    transition: none !important;
    opacity: 1;
    transform: none;
  }
  .el-menu--popup {
    background: #fff;
    // border-right: 1px solid #ddd;
    box-sizing: border-box;
    box-shadow: none !important;
    animation: none !important;
    padding: 0;
    min-width: 136px !important;
    // height: 200px;
    margin-left: 0;
  }

  .el-submenu {
    animation: none !important;
    .el-menu--horizontal {
      width: 120px !important;
      top: 0 !important;
      animation: none !important;
      & > .el-menu--popup-right-start {
        & > li {
          min-width: 120px !important;
        }
      }
    }
    &.is-active .el-menu--horizontal,
    &.is-opened .el-menu--horizontal {
      display: block !important;
    }
  }
  .el-menu .el-menu-item,
  .el-menu .el-submenu__title {
    height: 42px;
    line-height: 42px;
  }
  .el-submenu__title {
    padding: 0;
    i {
      display: none;
    }
    & > div {
      padding: 0 10px;
    }
  }
  // .el-submenu__title {
  //   padding: 0;

  // }

  .is-opened {
    .el-submenu__title {
      color: $titleColor !important;
    }
  }
}
.storeBtn {
  position: absolute;
  top: 18px;
}
._scroll {
  // height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}

._s1 .el-menu--horizontal,
._s2 .el-menu--horizontal {
  position: absolute;
  left: 136px !important;
}
._s1,
._s2,
._s2 .el-menu.el-menu--popup {
  border: 1px solid #e6e6e6;
  border-width: 0 0 1px 1px;
}

._s2 .el-menu.el-menu--popup {
  border-right: 1px solid #e6e6e6;
}

.storeBtn2 {
  position: absolute;
  top: 10px;
  right: 115px;
}
.navbar {
  * {
    font-weight: bold;
    [class^='el-icon-'],
    [class*=' el-icon-'] {
      font-weight: normal;
    }
    // font-size: 14px;
    // color: $text;
  }
  .el-submenu__title {
    span,
    i {
      color: #fff !important;
    }
  }
  background-color: $navBgColor;
  color: #fff;
  flex: none;
  height: 64px;
  // box-shadow: 0 1px 3px rgba(0, 21, 41, 0.05);
  z-index: 1;
  #platform {
    margin-left: 48px;
  }
  .el-button--text.el-button i.iconbiaoji {
    font-size: 18px;
  }
  & > li.el-menu-item {
    height: 65px;
    line-height: 65px;
    &.dash-logo,
    &.shop-warning {
      &.is-disabled {
        opacity: 1;
        cursor: pointer;
      }
      // &.is-active {
      //   color: $text;
      //   border-bottom: none;
      // }
      &:hover,
      &:active,
      &:focus {
        background-color: transparent !important;
      }
    }
    &.shop-warning {
      .el-badge__content.is-fixed {
        top: 21px !important;
        right: 18px !important;
      }
    }
  }
  &.el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 64px;
    line-height: 64px;
  }
  .iconbiaoji {
    color: #fff;
  }
  .collapse-btn {
    z-index: 1;
    position: absolute;
    height: 64px;
    display: flex;
    align-items: center;
    padding-left: 16px;
  }
  .user-profile-container {
    position: absolute;
    right: 20px;
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
    }
    .menu-icons {
      display: flex;
      align-items: center;
      .menu-icon {
        padding: 0 12px;
        .icon {
          display: inline-block;
          font-size: 18px;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .user-name {
      font-weight: bold;
      color: rgba(255, 255, 255, 0.65);
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
</style>

