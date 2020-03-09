<template>
  <div class="priceOptimizeAdd">
    <div>
      <el-steps :active="stepOptions.active" :space="120" align-center finish-status="success">
        <el-step v-for="(item, index) in stepOptions.titleList" :title="item" :key="index"></el-step>
      </el-steps>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabClick" type="card" class="mainContent">
      <el-tab-pane name="1">
        <keep-alive>
          <chooseProducts ref="child1" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane name="2">
        <keep-alive>
          <configRule ref="child2" />
        </keep-alive>
      </el-tab-pane>
      <div class="btnGroup">
        <el-button @click="cancel">取消添加</el-button>
        <el-button @click="goUpMethod" v-if="stepOptions.active !== 0">上一步</el-button>
        <el-button @click="nextMethod" type="primary">{{stepOptions.active !== 1 ? '继续下一步' : '确认提交'}}</el-button>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import chooseProducts from './page/chooseProducts.vue'
import configRule from './page/configRule.vue'
export default {
  data() {
    return {
      stepOptions: {
        active: 0,
        titleList: ['选择商品', '配置规则']
      },
      activeName: '1'
    }
  },
  methods: {
    tabClick(e) {},
    cancel() {
      this.$router.go(-1)
    },
    goUpMethod() {
      let option = this.stepOptions
      option.active--
      this.activeName = (parseInt(this.activeName) - 1).toString()
    },
    nextMethod() {
      let option = this.stepOptions
      if (option.active < option.titleList.length - 1) {
        if (option.active === 0) {
          if (!this.$refs.child1.validateFn())
            return this.$message.warning('请添加至少一条数据')
        }
        let firstData = this.$refs.child1.$refs.child.rightTableData
        this.$refs.child2.$refs.child.$refs.form2.getData(firstData)
        option.active++
        this.activeName = (parseInt(this.activeName) + 1).toString()
      } else {
        //提交  //只需验证最后一个tab表单即可
        this.$refs.child2
          .validateFn()
          .then(res => {
            let params = {
              ...this.storeInfo,
              ...res[0],
              ...res[1]
            }
            this.$api['shopManage/priceSeoSaveStrategy'](params).then(res => {
              this.$router.push({
                path: '/shopManage/priceOptimize'
              })
            })
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  },
  components: {
    chooseProducts,
    configRule
  }
}
</script>

<style lang="scss">
.priceOptimizeAdd {
  position: relative;
  width: 100%;
  > div:nth-child(1) {
    width: 100%;
    height: 80px;
    position: absolute;
    top: 0px;
    background: rgb(242, 242, 242);
    z-index: 3;
    .el-steps {
      display: flex;
      justify-content: center;
      margin-top: 14px;
      .el-step__title {
        color: #303133;
      }
      .el-step__head.is-process {
        .el-step__icon {
          background: rgb(254, 152, 0);
          border: none;
          .el-step__icon-inner {
            color: #ffffff;
          }
        }
      }
      .el-step__head.is-success {
        color: #c0c4cc;
        border-color: #c0c4cc;
        .el-step__icon {
          border: 2px solid rgb(254, 152, 0);
          .el-step__icon-inner {
            color: rgb(254, 152, 0);
          }
        }
      }
      .el-step__title {
        font-size: 14px;
        font-weight: 500;
      }
      .el-step__title.is-success {
        color: #303133;
      }
    }
  }
  .mainContent {
    position: absolute;
    top: 20px;
    width: 100%;
    .btnGroup {
      margin-top: 30px;
      width: 100%;
      height: 60px;
      border-top: 1px solid rgb(228, 228, 228);
      .el-button {
        margin-top: 12px;
      }
    }
  }
}
</style>
