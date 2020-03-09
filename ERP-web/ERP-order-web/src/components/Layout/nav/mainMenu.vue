<template>
  <!-- 主菜单 -->
  <div>
    <el-menu
      class="menu-hearder"
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
      background-color="#404040"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- // eslint-disable-next-line -->
      <template v-for="item in navList">
        <!-- // eslint-disable-next-line -->
        <el-menu-item :index="item.url" class="box_li" :key="item.id">
          <div class="box">
            <i class="anticon" :class="`anticon-${item.icon}`"></i>
            {{item.name}}
          </div>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations } from 'vuex'
import { NODE_ENV } from 'Config'

export default {
  data() {
    return {
      activeIndex:
        NODE_ENV === 'production'
          ? '/erp/erp-order/#/salesManagement/associatedSettings/allOrderLists'
          : '/erp-order/#/salesManagement/associatedSettings/allOrderLists'
    }
  },
  watch: {
    $route(to, from) {
      this.setRouter()
    }
  },
  created() {
    this.changeSubmenu(this.$route.matched[0].name)
    this.setRouter()
  },
  methods: {
    setRouter() {
      if (location.hash.indexOf('#/salesManagement') === 0) {
        this.activeIndex =
          NODE_ENV === 'production'
            ? '/erp/erp-order/#/salesManagement/associatedSettings/allOrderLists'
            : '/erp-order/#/salesManagement/associatedSettings/allOrderLists'
      } else {
        this.activeIndex =
          NODE_ENV === 'production'
            ? '/erp/erp-order/#/purchasingManagement/procurement/procurementList'
            : '/erp-order/#/purchasingManagement/procurement/procurementList'
      }
    },
    handleSelect(key, keyPath) {
      location.href = key
      setTimeout(() => {
        this.changeSubmenu(this.$route.matched[0].name)
      }, 100)
    },
    ...mapMutations(['changeSubmenu', 'changeBreadcrumb'])
  },
  computed: {
    navList() {
      return this.$store.state.perms.merchantMenuList
    }
    // activeIndex() {
    //   return location.pathname + location.hash
    // }
    // activeIndex: this.$route.matched[0].path
  }
}
</script>

<style lang="scss" scoped>
.box_li {
  flex: 1;
  max-width: 110px;
  padding: 6px 10px;
  .box {
    display: flex;
    flex-direction: column;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    color: hsla(0, 0%, 100%, 0.67);
    i {
      color: hsla(0, 0%, 100%, 0.67);
      width: 100%;
      display: block;
      font-size: 32px;
      line-height: 1;
    }
  }
}
</style>
<style lang="scss">
.menu-hearder {
  .el-menu-item.is-active {
    background: #108ee9 !important;
    border-bottom-color: transparent !important;
    .box {
      color: #fff !important;
      i {
        color: #fff !important;
      }
    }
  }
}
</style>
