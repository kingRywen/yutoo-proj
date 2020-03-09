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
.custom-collapse {
  &.el-collapse {
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
  }
  .el-collapse-item {
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
  }
  .el-collapse-item__header {
    border-bottom: 1px solid #dcdfe6;
    background-color: #f5f5f5;
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
  }
  .el-collapse-item__arrow {
    line-height: 40px;
  }
  &.header14 .el-collapse-item__header {
    font-size: 14px;
  }

  .el-collapse-item__wrap {
    .el-collapse-item__content {
      margin: 16px;
      padding-bottom: 6px;
      margin-bottom: 0;
    }
  }

  &.custom-collapse-nomargin {
    .el-collapse-item__wrap {
      .el-collapse-item__content {
        margin: 0;
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }
    .el-table {
      border: none;
    }
  }
}
.custom-collapse-1 {
  // .el-collapse-item__header {
  //   flex-direction: row-reverse;
  // }
  .el-collapse-item__header,
  .collapse-item-title {
    display: flex;
    justify-content: space-between;
  }
  .collapse-item-title {
    font-size: 12px;
    // flex: 1;
    .el-button--text {
      margin-right: 10px;
    }
  }
}
</style>
