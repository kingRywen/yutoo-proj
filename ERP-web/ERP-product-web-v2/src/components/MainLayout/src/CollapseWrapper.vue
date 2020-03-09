<template>
  <el-collapse class="custom-collapse custom-collapse-1" v-model="activeName" accordion>
    <el-collapse-item name="1">
      <div class="collapse-item-title" slot="title">
        <span>筛选条件</span>
        <!-- <ElButton v-if="backBtn" @click.stop="handleBack" type="text" icon="el-icon-back">返回</ElButton> -->
      </div>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  // props: ['backBtn', 'expand'],
  props: {
    routeIgnore: {
      default: () => [],
      type: Array
    },
    backBtn: {
      default: false
    },
    expand: {
      default: false
    }
  },
  name: 'CollapseWrapper',
  computed: {
    activeName: {
      get() {
        return this.expand ? '1' : ''
      },
      set() {
        // this.expand = val
      }
    }
  },
  methods: {
    handleBack() {
      try {
        const matched = this.$route.matched
        const len = matched.length
        const backRoute = matched[len - 2]
        let { query, params } = this.$route
        this.routeIgnore.forEach(key => {
          delete query[key]
          delete params[key]
        })
        // console.log(backRoute)
        this.$router.push({
          name: backRoute.name,
          query: backRoute.meta.showMetaProp
            ? backRoute.meta.getParams
              ? backRoute.meta.getParams(query)
              : query
            : null,
          params: backRoute.meta.showMetaProp ? params : null
        })
      } catch (error) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss">
.custom-collapse-1 {
  
  .el-collapse-item__header {
    flex-direction: row-reverse;
  }
  .el-collapse-item__header, .collapse-item-title {
    display: flex;
    justify-content: space-between;
  }
  .collapse-item-title {
    flex: 1;
    .el-button--text {
      margin-right: 10px;
    }
  }
}
</style>
