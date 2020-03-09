<template lang="html">
    <!-- 主菜单 -->

        <el-menu
            class="menu-hearder"
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            background-color="#404040"
            text-color="#fff"
            active-text-color="#ffd04b">
            <!-- // eslint-disable-next-line -->
            <template v-for="(item,index) in navList" >
              <!-- /* eslint-disable */ -->
              
                <el-menu-item :index="item.url||''" class="box_li" :key="index">
                    <div class="box">
                        <i class="anticon" :class="`anticon-${item.icon}`"></i> {{item.name}}
                    </div>
                    </el-menu-item>
            </template>
        </el-menu>


</template>

<script>
/* eslint-disable */
import { mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },

  methods: {
    handleSelect(key, keyPath) {
      location.href = key
    }
  },
  computed: {
    navList() {
      return this.$store.state.perms.merchantMenuList
    },
    activeIndex() {
      return location.pathname + location.hash
    }
  }
}
</script>

<style lang="scss" scoped>
.box_li {
  width: 110px;
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
