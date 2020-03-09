<template>
  <!-- <div>仓库管理</div> -->
  <div>
    <yt-page
      v-if="$route.meta.title === '库位管理'"
      url="warehouse/wmLocationList"
      reserveSelection="wmLocationId"
      :fixedPage="true"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @selectChange="selectChange"
      :dialogEvents="dialogEvents"
      @onClickBtn="onClickBtn"
      ref="page"
    >
      <template slot="tableLeft">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="edit(scope)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
    <router-view v-else></router-view>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import mixin from './mixin'
/* eslint-disable */
export default {
  name: 'storehouse',
  mixins: [mixin],
  data() {
    let vm = this
    return {
      wmWarehouseId: null,

      dialogEvents: {
        open() {
          vm.$nextTick(() => {
            // 弹窗里的组件
            let component = vm.$refs.page.$refs.component
            // 调用组件初始化函数
            component._initData && component._initData()
          })
        },
        close() {
          // 弹窗里的组件
          let component = vm.$refs.page.$refs.component
          // 调用组件关闭函数
          component._close && component._close()
        },
        handleOkClick() {
          let component = vm.$refs.page.$refs.component
          return (
            component.submit &&
            component.submit().then(() => {
              vm.$refs.page.getList(true)
            })
          )
        }
      },
      tableConfig: [
        { value: 'wmName', label: '仓库名称' },
        { value: 'divisionName', label: '区域名称' },
        { value: 'locationCode', label: '位置编码' },
        { value: 'locationStatus', label: '位置状态' },
        { value: 'locationType', label: '库位类型' },
        { value: 'locationSize', label: '库位大小' },
        {
          value: 'locationVolume',
          label: '体积',
          render(h, scope) {
            let { locationVolume, sizeUnit } = scope.row
            return (
              <span>
                {locationVolume != null && locationVolume !== ''
                  ? locationVolume + sizeUnit
                  : '-'}
                <sup>3</sup>
              </span>
            )
          }
        },
        {
          value: 'valueX',
          label: '长',
          render(h, scope) {
            let { valueX, sizeUnit } = scope.row
            return (
              <span>
                {valueX != null && valueX !== '' ? valueX + sizeUnit : '-'}
              </span>
            )
          }
        },
        {
          value: 'valueY',
          label: '宽',
          render(h, scope) {
            let { valueY, sizeUnit } = scope.row
            return (
              <span>
                {valueY != null && valueY !== '' ? valueY + sizeUnit : '-'}
              </span>
            )
          }
        },
        {
          value: 'valueZ',
          label: '高',
          render(h, scope) {
            let { valueZ, sizeUnit } = scope.row
            return (
              <span>
                {valueZ != null && valueZ !== '' ? valueZ + sizeUnit : '-'}
              </span>
            )
          }
        },
        {
          value: 'activatedFlag',
          label: '状态',
          render(h, scope) {
            const {activatedFlag} = scope.row
            
            // return (
            //   <i
            //     style={{ fontSize: '22px' }}
            //     class={
            //       scope.row.activatedFlag ? 'el-icon-check' : 'el-icon-close'
            //     }
            //   />
            // )
            return <el-button type="text" class="__table-btn" icon={activatedFlag ? `el-icon-check` : `el-icon-close`} on-click={() =>{
              let {locationStatus, ...info} = scope.row
              let params = {ids: [scope.row.wmLocationId] ,activatedFlag: (activatedFlag ? 0 : 1)}
              vm.$api[`warehouse/wmLocationUpdateActivated`](params)
              .then(data => {
                vm.$refs.page.getList(true)
              }).catch(() => {})
            }}></el-button>
          }
        },
        { value: 'userName', label: '添加人' },
        { value: 'createTime', label: '添加时间', width: 180 }
      ],

      btnConfig: [
        {
          name: '添加',
          fn: () => {
            this.$refs.page.$dialog({
              title: '添加库位',
              visible: true,
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./components/AddLocation.vue')
            })
          }
        },
        {
          name: '批量操作',
          children: [
            { name: '批量导入库位' },
            { name: '设置库位激活' },
            { name: '设置库位关闭' },
            { name: '批量呆滞库位' },
            { name: '批量正常库位' },
            { name: '批量设置库位规格' }
          ]
        },
        {
          name: '批量打印库位编码',
          fn: () => {
            let data = this.getChecked()
            if (data) {
              let routeUrl = this.$router.resolve({
                name: 'storehousePrintCode',
                params: { id: data.join('_') }
              })

              window.open(routeUrl.href, '_blank')
              
            }
          }
        },
        {
          name: '删除库位',
          fn: () => {
            this.batchModify('wmLocationDelete', '是否删除选择的库位?')
          }
        }
      ]
    }
  },

  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    ...mapMutations('vmWarehouse', ['clearRegionalList']),
    onClickBtn(name) {
      let ids
      let arrs = ['批量导入库位']
      if (arrs.indexOf(name) === -1) {
        ids = this.getChecked()
        if (!ids || !ids.length) {
          return
        }
      }

      switch (name) {
        case '批量导入库位':
          this.$refs.page.$dialog({
            title: name,
            visible: true,
            width: '700px',
            okBtnText: '确认导入',
            cancelBtnText: '取消',
            component: () => import('./components/ImportLocation.vue')
          })
          break
        case '设置库位激活':
          this.changeLocationStatus(1, ids)
          break
        case '设置库位关闭':
          this.changeLocationStatus(2, ids)
          break
        case '批量呆滞库位':
          this.changeLocationStatus(3, ids)
          break
        case '批量正常库位':
          this.changeLocationStatus(4, ids)
          break
        case '批量设置库位规格':
          this.$refs.page.$dialog({
            title: name,
            visible: true,
            width: '480px',
            okBtnText: '确认设置',
            params: ids,
            cancelBtnText: '取消',
            component: () => import('./components/SelectLocation.vue')
          })
          break

        default:
          break
      }
    },

    edit(scope) {
      this.$refs.page.$dialog({
        title: '编辑库位',
        visible: true,
        okBtnText: '确认',
        cancelBtnText: '取消',
        params: scope.row,
        component: () => import('./components/AddLocation.vue')
      })
    },

    initData() {
      Promise.all([
        this.queryData(3),
        // this.queryData(4),
        this.queryData(5),
        this.queryData(6),
        this.queryData(7)
      ]).catch(() => {
        // this.$notify({
        //   title: '警告',
        //   type: 'warning',
        //   message: '初始化数据失败，请刷新重试'
        // })
      })
    },
    searchData(val) {
      let { addTime = [], ...info } = val
      let [startDate, endDate] = addTime
      return { ...info, startDate, endDate }
    },

    changeLocationStatus(type, ids) {
      let api, params
      /* 
      1设置库位激活
      2设置库位关闭
      3批量呆滞库位
      4批量正常库位 
      */
      switch (type) {
        case 1:
          // 激活
          api = 'wmLocationUpdateActivated'
          params = {
            ids,
            activatedFlag: 1
          }
          this.isConfirmFetchStatus(api, params)
          break

        case 2:
          // 关闭
          api = 'wmLocationUpdateActivated'
          params = {
            ids,
            activatedFlag: 0
          }
          this.isConfirmFetchStatus(api, params, true)
          break

        case 3:
          // 呆滞库位
          api = 'wmLocationUpdateSluggish'
          params = {
            ids
          }
          this.isConfirmFetchStatus(
            api,
            params,
            true,
            '是否设置所选库位为呆滞库位？'
          )
          break

        case 4:
          // 正常库位
          api = 'wmLocationUpdateNormal'
          params = {
            ids
          }
          this.isConfirmFetchStatus(api, params)
          break

        default:
          break
      }
    },
    isConfirmFetchStatus(api, params, show, title = '是否关闭所选库位？') {
      if (show) {
        this.$.showWarning(title, () => {
          this.$api[`warehouse/${api}`](params)
            .then(data => {
              this.refresh()
            })
            .catch(() => {})
        })
      } else {
        this.$api[`warehouse/${api}`](params)
          .then(data => {
            this.refresh()
          })
          .catch(() => {})
      }
    }
  },
  computed: {
    ...mapState('vmWarehouse', [
      'warehouseList',
      'regionalList',
      'warehouseLocationStatus',
      'warehouseLocationActiveState',
      'locationSizeList'
    ]),
    searchConfig() {
      let vm = this
      return [
        {
          label: '仓库(多选)',
          value: 'wmWarehouseIds',
          type: 'multiple',
          children: vm.warehouseList,
          change(val, data) {
            data.wmWarehouseDivisionIds = []
            if (!val.length) {
              vm.clearRegionalList()
              
              return
            }
            let params = { type: 4, outParams: { wmWarehouseIds: val } }
            console.log(params);
            vm.queryData(params)
          }
        },
        {
          label: '区域(多选)',
          value: 'wmWarehouseDivisionIds',
          type: 'multiple',
          children: vm.regionalList
        },
        {
          label: '位置状态',
          value: 'locationStatus',
          type: 'select',
          children: vm.warehouseLocationStatus
        },
        {
          label: '激活状态',
          value: 'activatedFlag',
          type: 'select',
          children: vm.warehouseLocationActiveState
        },
        {
          label: '位置大小规格',
          value: 'locationSize',
          type: 'select',
          children: vm.locationSizeList
        },
        {
          label: '库位编码',
          value: 'locationCode',
          type: 'input'
        },
        {
          label: '是否支持多SKU',
          value: 'multipleSkuFlag',
          type: 'select',
          children: vm.$const['OTHER/yesno']
        },
        {
          label: '是否系统推荐生成库位',
          value: 'sysCreateFlag',
          type: 'select',
          children: vm.$const['OTHER/yesno']
        },
        {
          label: '添加时间',
          value: 'addTime',
          type: 'time'
        }
      ]
    }
  },
  created() {
    this.initData()
  }
}
</script>
<style lang="scss">
</style>