<template>
  <div>
    <yt-form :fields="fields" :formData="formData" labelWidth="100px" ref="ytform"></yt-form>
    <ElDialog append-to-body title="添加区域" @close="handleClose" :visible.sync="visible">
      <AddMoreArea @close="visible = false" :warehouseId="warehouseId"/>
    </ElDialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    AddMoreArea: () => import('./AddMoreArea.vue')
  },
  inheritAttrs: false,
  props: ['data'],
  data() {
    return {
      warehouseId: null,
      visible: false,
      formData: {
        activatedFlag: 1,
        warehouseType: null,
        wmName: null,
        warehouseCode: null,
        streetAddress: null,
        zipCode: null,
        contactName: null,
        contactPhone: null,
        contactEmail: null,
        shippingAddress: null,
        shippingPhone: null,
        country: null,
        province: null,
        city: null,
        area: null
      },
      provinces: [], // 省列表
      citys: [], // 市列表
      areas: [] // 区列表
    }
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    submit() {
      if (this.formData.wmWarehouseId) {
        return this.fetch()
      }
      return this.$confirm('是否继续添加区域', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认添加区域',
        cancelButtonText: '暂不添加',
        type: 'warning'
      })
        .then(() => {
          return this.fetch().then(data => {
            const { warehouseId } = data
            this.warehouseId = warehouseId
            this.visible = true
            return Promise.reject(false)
          })
        })
        .catch(action => {
          console.log(action)
          if (action === 'cancel') {
            return this.fetch()
          } else {
            return Promise.reject(false)
          }
        })
    },
    fetch() {
      return this.$api[
        this.formData.wmWarehouseId
          ? `warehouse/wmWarehouseUpdate`
          : `warehouse/wmWarehouseCreate`
      ](this.formData)
    },
    _initData() {
      this.$nextTick(() => {
        let { data } = this
        if (data != null) {
          this.getEditData(data)
        } else {
          this.formData = {
            activatedFlag: 1,
            warehouseType: null,
            wmName: null,
            warehouseCode: null,
            streetAddress: null,
            zipCode: null,
            contactName: null,
            contactPhone: null,
            contactEmail: null,
            shippingAddress: null,
            shippingPhone: null,
            country: null,
            province: null,
            city: null,
            area: null
          }
        }
      })
    },

    getEditData(data) {
      this.$api[`warehouse/wmWarehouseInfo`]({
        id: data.wmWarehouseId
      })
        .then(data => {
          let { warehouseNumber } = data.info
          this.formData = data.info
          this.formData.warehouseCode = warehouseNumber
        })
        .catch(() => {})
    },

    handleClose() {
      // this.$parent.$parent.visible = false
      this.$parent.$parent.$parent.handleClose()
    },
    initData() {
      if (!this.warehouseType.length) {
        this.queryData(0)
      }
      this.queryData(2)
      // this.getArea(1)
    },
    /**
     * 获取地区数据
     * @param type 1 省 2 市 3 区
     * @param id 省市区父级ID
     */
    getArea(type, id) {
      switch (type) {
        case 1:
          this.provinces = []
          this.citys = []
          this.areas = []

          // this.formData.province = null
          // this.formData.city = null
          // this.formData.area = null

          break
        case 2:
          // this.formData.province = null

          // this.formData.city = null
          // this.formData.area = null

          this.citys = []
          this.areas = []
          break
        case 3:
          // this.formData.province = null
          // this.formData.city = null
          // if (!this.flag) {
          //   this.formData.area = null
          // }

          this.areas = []
          break

        default:
          break
      }

      if (id == null) {
        return
      }

      return this.$api[`warehouse/wmWarehouseGlobalArea`]({
        parentId: id
      })
        .then(data => {
          data = data.list.map(el => ({ label: el.name, value: el.id }))
          switch (type) {
            case 1:
              this.provinces = data
              break
            case 2:
              this.citys = data
              break
            case 3:
              this.areas = data
              break

            default:
              break
          }
        })
        .catch(() => {})
    }
  },
  computed: {
    ...mapState('vmWarehouse', ['warehouseType', 'countrys']),
    fields() {
      return [
        {
          label: '仓库类型',
          name: 'warehouseType',
          type: 'select',
          options: this.warehouseType,
          required: true
        },
        {
          label: '仓库名称',
          name: 'wmName',
          required: true
        },
        {
          label: '仓库编码',
          name: 'warehouseCode',
          required: true
        },
        {
          label: '所在国家',
          type: 'multi',
          opts: [
            {
              name: 'country',
              label: '国家',
              type: 'select',
              options: this.countrys,
              required: true
            },
            {
              name: 'province',
              label: '省',
              type: 'select',
              options: this.provinces,
              noDataText: this.formData.country ? '暂无数据' : '请先选择国家',
              required: true
            },
            {
              name: 'city',
              label: '市',
              type: 'select',
              options: this.citys,
              noDataText: this.formData.province ? '暂无数据' : '请先选择省'
              // required: true
            },
            {
              name: 'area',
              type: 'select',
              options: this.areas,
              noDataText: this.formData.city ? '暂无数据' : '请先选择市',
              label: '区'
            }
          ]
        },
        {
          label: '街道地址',
          name: 'streetAddress',
          required: true
        },
        {
          label: '邮编',
          name: 'zipCode',
          required: 'post'
        },
        {
          label: '联系人',
          name: 'contactName',
          required: true
        },
        {
          label: '联系电话',
          name: 'contactPhone',
          required: 'mobile'
        },
        {
          label: '联系邮箱',
          name: 'contactEmail'
        },
        {
          label: '发货联系地址',
          name: 'shippingAddress'
        },
        {
          label: '发货联系电话',
          name: 'shippingPhone'
        },
        {
          label: '是否激活',
          name: 'activatedFlag',
          type: 'switch',
          options: {
            t: 1,
            f: 0
          },
          required: true
        }
      ]
    }
  },
  watch: {
    'formData.country': {
      immediate: true,
      handler(val) {
        this.getArea(1, val)
      }
    },

    'formData.province': {
      immediate: true,
      handler(val) {
        this.getArea(2, val)
      }
    },
    'formData.city': {
      immediate: true,
      handler(val) {
        this.getArea(3, val)
      }
    }
  }
}
</script>

<style>
</style>
