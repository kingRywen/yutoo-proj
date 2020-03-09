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
      <!-- eslint-disable-next-line -->
      <template v-for="item in navList">
        <!-- eslint-disable-next-line -->
        <el-menu-item :index="item.url" class="box_li">
          <div class="box">
            <i class="anticon" :class="item.icon ? `anticon-${item.icon}` : `anticon-setting`"></i>
            {{item.name}}
          </div>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },
  created() {
    // console.log(process.env.NODE_ENV)
    this.changeSubmenu(this.$route.matched[0].name)
  },
  methods: {
    handleSelect(key) {
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
    },
    activeIndex() {
      // return location.pathname + location.hash
      return process.env.NODE_ENV === 'development'
        ? '/permsManage.html'
        : '/erp/erp-setting/#/roles/index'
    }
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
