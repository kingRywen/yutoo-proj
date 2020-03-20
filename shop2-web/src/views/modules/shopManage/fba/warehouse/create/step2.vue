<template>
  <div class="w1200">
    <Info />
    <section class="mt20">
      <ElButton type="primary" @click="addPro">添加产品</ElButton>
      <main-layout :showSelection="false" class="mt10" :columns="columns" :outerTableList="tableList" ref="layout">
        <el-table-column slot="right" :width="45" label align="left">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="del(scope.row, scope.$index)"></el-button>
          </template>
        </el-table-column>
      </main-layout>
    </section>
    <article class="mt20">
      <el-button type="default" @click="$emit('cancel')">取消创建</el-button>
      <el-button type="primary" @click="next">继续下一步</el-button>
    </article>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import Info from './info'
export default {
  components: {
    Info
  },
  data() {
    return {
      tableList: JSON.parse(
        JSON.stringify(this.$store.state.fba.selectProjProduct)
      ),
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          noTooltip: true,
          minWidth: 200
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: 110
        },
        {
          label: '主图',
          img: true,
          width: 70,
          value: 'img'
        },
        {
          label: '标题',
          url: true,
          btnClick: scope => {
            window.open(this.storeUrls.asinUrl + scope.row['asin'])
          },
          minWidth: 300,
          value: 'title',
          noTooltip: true
        },
        // {
        //   label: '每个装运箱的商品数量',
        //   width: 170,

        //   value: 'str',
        //   render: this.renderEdit('str')
        // },
        // {
        //   label: '装运箱数量',
        //   value: ''
        // },
        {
          label: '数量',
          width: 120,
          value: 'quantity',
          render: this.renderEdit('quantity')
        }
      ]
    }
  },
  computed: {
    ...mapState('fba', ['planInfo']),
    ...mapGetters('fba', ['addressGroupName', 'packageTypeName']),
    editVal: {
      get() {
        return this.value == null ? this.planInfo.planName : this.value
      },
      set(val) {
        this.value = val
      }
    }
  },
  methods: {
    ...mapActions('fba', ['updatePlan', 'submitPro']),
    ...mapMutations('fba', [
      'setAddressInfo',
      'setSelectedPro',
      'saveCreateInfo'
    ]),
    async next() {
      let el = [].find.call(
        document.querySelectorAll('.over .el-input-number .el-input__inner'),
        e => e.value == ''
      )
      if (el) {
        el.focus()
        return this.$message.warning('请填写数据')
      }
      await this.setPro()
      this.setSelectedPro(this.tableList)
      this.saveCreateInfo(2)
    },
    async setPro() {
      const params = {
        planId: this.planInfo.planId,
        planProcess: 2,
        items: this.tableList.map(el => {
          const { sellerSku, storeId, quantity, fnsku } = el
          return {
            sellerSku,
            storeId,
            quantity,
            fnsku
          }
        })
      }
      await this.submitPro(params)
    },
    addPro() {
      let vm = this
      this._openDialog({
        size: 'medium',
        title: '添加产品',
        params: {
          type: 'exist',
          storeId: this.$route.query.storeId,
          fn: selected => {
            vm.tableList = vm.tableList.concat(
              selected.filter(
                el =>
                  el.variationType !== 1 &&
                  !vm.tableList.find(e => e.sellerSku === el.sellerSku)
              )
            )
            vm.tableList = vm.tableList.map(e => {
              const { parent, ...info } = e
              return { ...info, __show: true }
            })
            vm.setSelectedPro(JSON.parse(JSON.stringify(vm.tableList)))
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () =>
          import('Views/modules/shopManage/fba/dialogs/addPro.vue')
      })
    },

    renderEdit(str) {
      return (h, scope) => (
        <el-input-number
          size="mini"
          style="width: 100%"
          min={1}
          onChange={val => {
            this.$set(scope.row, str, val)
          }}
          value={scope.row[str]}
          // max={99999999999}
          controls={false}
        ></el-input-number>
      )
    },
    del(row) {
      let e = this.tableList.filter(el => el.sellerSku !== row.sellerSku)
      this.tableList = JSON.parse(JSON.stringify(e))
      this.setSelectedPro(e)

      // this.tableList.splice(index, 1)
    },

    async ok() {
      if (this.value === '') {
        this.$message.warning('请输入计划名')
        return
      }
      await this.updatePlan({
        ...this.planInfo,
        planName: this.value
      })
      this.editName = false
      this.value = null
    }
  }
}
</script>
<style lang="scss" scoped>
h4 {
  font-size: 15px;
}
</style>