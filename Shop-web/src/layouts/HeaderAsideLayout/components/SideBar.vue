<template>
  <div id="sideBar" :class="{'isCollapse' :isCollapse}">
    <scroll-bar :class="{'isCollapse' :isCollapse}">
      <!-- <div class="logo" @click="routerLink">
        <transition-type mode="out-in">
          <img v-if="!isCollapse" src="~@/assets/images/logo.png" key="1" height="65">
        </transition-type>
      </div>-->
      <el-menu
        @select="bindSelect"
        unique-opened
        mode="vertical"
        :show-timeout="200"
        background-color="#fafafa"
        text-color="#5e5e5e"
        active-text-color="#377EA8"
        :default-active="$route.meta.active ? $route.meta.active : $route.matched[0].meta.isChild ? $route.matched[1].path : $route.matched[0].path"
        :collapse="isCollapse"
        class="main-menu"
      >
        <template v-for="item in asideMenuConfig">
          <router-link v-if="!item.children" tag="li" :to="item.path" :key="item.name">
            <el-menu-item :index="item.path" :key="item.path">
              <i v-if="item.icon" :class="item.icon"></i>
              <span v-if="item.name" slot="title" class="itemName">{{item.name}}</span>
            </el-menu-item>
          </router-link>

          <el-submenu v-else :index="item.name || item.path" :key="item.name">
            <template slot="title">
              <i v-if="item && item.icon" :class="item.icon"></i>
              <span v-if="item && item.name" slot="title" class="itemName">{{item.name}}</span>
            </template>
            <template v-for="child in item.children" v-if="!child.hidden">
              <router-link :to="item.path + child.path" :key="child.name">
                <el-menu-item :index="item.path + child.path" :key="item.path + child.path">
                  <span v-if="child && child.name" slot="title">{{child.name}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-submenu>
        </template>
      </el-menu>
      <div :class="[isCollapse ? 'right' : 'left', 'toggleBtn']">
        <ElButton type="primary" circle plain icon="el-icon-arrow-left" @click="handleToggleMenu"></ElButton>
        <!-- <i class="el-icon-arrow-left"></i> -->
      </div>
    </scroll-bar>
  </div>
</template>

<script>
import ScrollBar from './ScrollBar'
import { asideMenuConfig } from '../../../menuConfig'
import { ebayAsideMenuConfig } from '@/ebayMenuConfig'
import { cateAsideMenuConfig } from '@/cateAsideMenuConfig'
import storage from 'Utils/saver'
export default {
  components: { ScrollBar },
  name: 'SideBar',
  props: ['isCollapse'],
  data() {
    return {
      asideMenuConfig: []
    }
  },
  created() {
    // console.log(this.$route);
    this.asideMenuConfig = asideMenuConfig
	GLOBAL.vbus.$on('navbar.menu.select', () =>{
		this.changeRouter()
	})
  },
  methods: {
    // 点击侧边栏的时候，通过传入随机时间，改变sellerData的状态，从而实现就算点击的侧边栏是当前的侧边栏，也触发当前页面的请求
    bindSelect() {
      let sellerData = this.sellerData
      sellerData.time = new Date()
      this.$store.commit('common/sellerData', sellerData)
      // console.log(this.sellerData);
    },
    routerLink() {
      if (storage.get('local', 'routerType') === 'ebay') {
        this.$router.push({ name: 'ebayCategoryAnalysisItem' })
      } else {
        let query = {}
        if (this.$route.path !== '/cate/CateSetup') {
          query.backroute = this.$route.fullPath
        }
        this.$router.push({ path: '/dash', query })
      }
    },
    handleToggleMenu() {
      this.$emit('collapse')
    },
	changeRouter(){
		const ca = storage.get('local', 'isShowCate')
		if(ca) {
			this.asideMenuConfig = cateAsideMenuConfig
		} else {
			this.asideMenuConfig = asideMenuConfig
		}
	}
  },
  computed: {
    routerType() {
      return this.$store.state.common.routerType || 'amazon'
    }
  },
  watch: {
    routerType: {
      handler(val) {
        // console.log(val)
        this.$nextTick(function() {
          switch (val) {
            case 'amazon':	
				this.changeRouter()
				// this.asideMenuConfig = asideMenuConfig           
              break
            case 'ebay':
              this.asideMenuConfig = ebayAsideMenuConfig
              break
          }
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  // justify-content: center;
  align-items: center;
  height: 64px;
  line-height: 64px;
  background: #fafafa;
  color: #222;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  cursor: pointer !important;
  padding: 0 14px;
}
.site-name {
  margin-left: 10px;
}
.itemName {
  font-size: 14px;
}

.sidebar-container {
  // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  box-sizing: border-box;
  padding: 10px;
  padding-right: 0;
  transition: width 0.28s;
  // background: #fafafa;
  width: 200px !important;
  height: calc(100% - 84px);
  position: absolute;
  // top: 0;
  // bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    // padding-top: 16px;
    width: 100% !important;
    border: none;
  }

  .el-submenu .el-menu-item {
    padding-left: 48px !important;
    background-color: #fff !important;
    &:hover {
      color: $titleColor !important;
    }
  }
  &.isCollapse {
    width: 65px !important;
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background-color: $subBgTitleColor !important;
      color: $titleColor !important;
    }
  }
  .el-submenu__title i {
    font-size: 17px;
    color: #aaa;
  }
}
</style>
<style lang="scss">
#sideBar {
  .el-submenu__title {
    transition: all ease-in 0.25s;
  }
  .el-menu-item.is-active {
    position: relative;
    &:after {
      content: '';
      width: 2px;
      height: 100%;
      background: $titleColor;
      top: 0;
      left: 0;
      position: absolute;
    }
  }
  .el-menu--collapse {
    .el-submenu__title {
      padding-left: 15px !important;
      transition: all ease-in 0.25s;
    }
  }
  .toggleBtn {
    position: absolute;
    top: 50%;
    right: -24px;
    .el-button.is-circle {
      padding: 10px;
    }
    .el-icon-arrow-left {
      transform: scale(0.7);
      left: -10px;
      position: relative;
      transition: all ease-in-out 0.25s;
    }
    &.right .el-icon-arrow-left {
      transform: rotate(180deg) scale(0.7);
    }
  }
}
.sidebar-container {
  .el-submenu__title i.el-submenu__icon-arrow {
    display: none;
  }
  // .el-submenu.is-active {
  //   position: relative;
  //   &:after {
  //     content: '';
  //     display: block;
  //     background: $titleColor;
  //     width: 3px;
  //     height: 40px;
  //     position: absolute;
  //     left: -1px;top:1px;
  //   }
  // }
}

.el-menu--collapse {
  .el-submenu.is-active {
    i {
      color: $titleColor !important;
    }
  }
}
.el-submenu__title:hover {
  background-color: #eeeeee !important;
}
</style>