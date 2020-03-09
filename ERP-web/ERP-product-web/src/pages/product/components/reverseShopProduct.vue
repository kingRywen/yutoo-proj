<template>
  <div>
    <v-row :gutter="12" v-if="$attrs.batch">
      <!-- 批量 -->
      <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
        <v-form-item label="选择亚马逊类目" :label-col="labelCol" :wrapper-col="wrapperCol" prop="cate">
          <SyncCascader :load="lists" :props="prop" v-model="ruleForm.cate" ref="_this"></SyncCascader>
        </v-form-item>
        <div style="position: relative;">
          <v-form-item label="选择系统类目" :label-col="labelCol" :wrapper-col="wrapperCol" prop="categoryId">
            <v-select size="lg" :data="options" clue="categoryId" label="path" :clearable="false" v-model="ruleForm.categoryId"></v-select>
          </v-form-item>
          <v-button type="primary" @click="add" style="position: absolute;right: 20px;top:0">添加</v-button>
        </div>

      </v-form>
    </v-row>
    <v-row :gutter="12" v-else>
      <v-col span="16">
        <v-select style="width:100%" size="lg" :data="options" clue="categoryId" label="path" :clearable="false" v-model="categoryId"></v-select>
      </v-col>
      <v-col span="8">
        <v-button type="primary" @click="add">添加</v-button>
        <v-button @click="selectCol">选择类目</v-button>
      </v-col>
    </v-row>
    <v-row :gutter="12" style="margin-top:40px">
      <v-col span="24" style="text-align:center">
        <v-button type="primary" @click="confirm" :loading="loading">逆推</v-button>
        <v-button type="primary" @click="cancel">取消</v-button>
      </v-col>
    </v-row>

    <v-modal :width="1000" title="新增产品类目" :visible="customTextVisible" @ok="okSubmit" @cancel="customTextVisible= false" ok-text="保存" cancel-text="取消">
      <AddEditsCategory ref="addcategory" :info="info" />
    </v-modal>
    <v-modal :width="1000" title="选择产品类目" :visible="customTextVisible1" @ok="okSelectSubmit" @cancel="customTextVisible1= false" ok-text="确认" cancel-text="取消">
      <ProductColumns ref="column" />
    </v-modal>
  </div>
</template>

<script>
import apis from 'apis'
import {
  fetchData,
  handlerCode,
  showToast,
  toParamUrl,
  showDialog
} from 'common/common'
import ProductColumns from './productColumns'
import SyncCascader from 'components/base/SyncCascader'
import AddEditsCategory from './AddEditsCategory'
export default {
  inheritAttrs: false,
  components: {
    SyncCascader,
    ProductColumns,
    AddEditsCategory
  },
  created() {
    if (this.$attrs.type === 'single') {
      this.getData()
    }
  },
  data() {
    return {
      isSingle: this.$attrs.type === 'single',
      rows: {},
      msg: null,
      info: {},
      customTextVisible: false,
      customTextVisible1: false,
      ruleForm: {
        cate: [],
        categoryId: []
      },
      rules: {
        cate: [
          {
            required: true,
            message: '请选择平台类目'
          }
        ],
        categoryId: [
          {
            required: true,
            message: '请选择系统类目'
          }
        ]
      },

      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      prop: {
        label: 'categoryName',
        value: 'platformCategoryId',
        children: 'childs',
        enabled: 'haveTemplate'
      },
      lists(id) {
        return fetchData({
          ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
          data: {
            siteId: 1,
            cateId: id != null ? id[id.length - 1] : -1
          }
        }).then(res => {
          if (res.data.code !== 0) {
            showToast('error', res.data.msg)
            return
          }
          if (res.data.cates) {
            return res.data.cates.map(el => {
              return {
                ...el,
                childs: el.childCount > 0 ? [] : null
              }
            })
          }
        })
      },
      cate: [],
      categoryId: '',

      options: [],
      loading: false
    }
  },
  watch: {
    'ruleForm.cate'(val) {
      this.systemCategory()
    }
  },
  methods: {
    selectCol() {
      let vm = this
      this.customTextVisible1 = true
    },
    okSelectSubmit() {
      const { isLast, name, arrs } = this.$refs.column
      if (isLast) {
        let id = arrs.slice().pop()
        this.options.push({
          categoryId: arrs.pop(),
          path: name.join(' > ')
        })
        this.categoryId = id
        this.customTextVisible1 = false
      } else {
        showToast('warning', '请选择最底级的类目')
      }
    },
    //根据平台类目获取系统类目
    systemCategory(id) {
      let vm = this
      fetchData({
        ...apis.SYSTEMCATEGORY,
        data: {
          pltCateId:
            id == null ? vm.ruleForm.cate[this.ruleForm.cate.length - 1] : id,
          isLeaf: true
        }
      }).then(res => {
        if (res.data.code == 0) {
          if (!res.data.categorys.length) {
            showToast(
              'warning',
              '当前选择的亚马逊类目不存在对应的系统类目，请点击添加按钮进行添加'
            )
            return
          }
          this.options = res.data.categorys.map(el => ({
            ...el,
            path: el.nameCn
          }))
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    //添加类目
    add() {
      if (!this.$attrs.batch) {
        let arr = []
        let type = arr.join(' > ')
      } else {
        let arr = this.$refs._this.getName()

        let type = arr.join(' > ')
        this.$set(
          this.info,
          'siteId',
          this.$attrs.storeProductPlatIds[0].siteId
        )
        this.$set(
          this.info,
          'platformId',
          this.$attrs.storeProductPlatIds[0].platformId
        )
        this.$set(
          this.info,
          'typeId',
          this.ruleForm.cate[this.ruleForm.cate.length - 1]
        )
        this.$set(this.info, 'type', type)
      }

      this.customTextVisible = true
    },
    setCategoryToInput(cateId) {
      fetchData({
        ...apis.CATEGORYM_GETPATHSTRING,
        data: {
          cateId
        }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        this.options.push({
          categoryId: cateId,
          path: res.data.path
        })
        this.categoryId = cateId
      })
    },
    okSubmit() {
      this.$refs.addcategory.submit(data => {
        if (data.code == 0) {
          showToast('success', data.msg)
          // this.categoryId = data.categoryId;
          if (this.$attrs.batch) {
            this.setCategoryToInput(data.categoryId)
          } else {
            this.setCategoryToInput(data.categoryId)
          }

          this.customTextVisible = false
        }
      })
    },
    confirm() {
      let vm = this
      if (vm.isSingle) {
        if (!vm.categoryId) {
          showToast('warning', '请选择一个类目')
          return
        }
        vm.loading = true
        fetchData({
          ...apis.STORE_PRODUCT_PLAT_CONFIRM,
          data: {
            categoryId: vm.categoryId,
            storeProductPlatIds: [
              {
                storeProductPlatId: vm.$attrs.storeProductPlatId,
                productType: vm.$attrs.productType
              }
            ]
          }
        }).then(res => {
          vm.loading = false
          if (res.data.code == 0) {
            if (res.data.rows.fail) {
              showToast(
                res.data.rows.fail ? 'error' : 'warning',
                `成功 ${res.data.rows.success} 个，失败 ${
                  res.data.rows.fail
                } 个. ${res.data.rows.failMsg ? res.data.rows.failMsg : ''}`
              )
            } else {
              showToast('success', '产品逆推成功')
            }

            vm.cancel()
            vm.$listeners.set()
          } else {
            showToast('error', res.data.msg)
          }
        })
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          vm.loading = true
          fetchData({
            ...apis.STORE_PRODUCT_PLAT_CONFIRM,
            data: {
              categoryId: vm.ruleForm.categoryId,
              storeProductPlatIds: vm.$attrs.storeProductPlatIds
            }
          }).then(res => {
            vm.loading = false
            if (res.data.code == 0) {
              if (res.data.rows.fail) {
                showToast(
                  'warning',
                  `成功 ${res.data.rows.success} 个，失败 ${
                    res.data.rows.fail
                  } 个`
                )
              } else {
                showToast('success', '所有产品逆推成功')
              }

              vm.cancel()
              vm.$listeners.set()
            } else {
              showToast('error', res.data.msg)
            }

            // handlerCode(res, () => {
            //
            //   vm.$listeners.set();
            // });
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false
    },
    //单个逆推
    getData() {
      let vm = this
      const { storeProductPlatId, productType } = vm.$attrs
      fetchData({
        ...apis.STORE_PRODUCT_PLAT_REVERSE,
        data: {
          storeProductPlatId,
          productType
        }
      }).then(res => {
        const { code, rows, msg, isCategory } = res.data
        if (code !== 0) {
          showToast('error', msg)
          return
        }
        this.rows = rows
        this.msg = msg

        const {
          siteId,
          platformId,
          categoryPlatformId: typeId,
          categoryPlatName: type
        } = rows.info

        //     this.$set(this.info, "siteId", this.$attrs.storeProductPlatIds[0].siteId);
        //   this.$set(
        //     this.info,
        //     "platformId",
        //     this.$attrs.storeProductPlatIds[0].platformId
        //   );
        //   this.$set(
        //     this.info,
        //     "typeId",
        //     this.ruleForm.cate[this.ruleForm.cate.length - 1]
        //   );
        //   this.$set(this.info, "type", type);
        this.info = {
          siteId,
          platformId,
          typeId,
          type
        }
        if (!rows.isCategory) {
          showToast('warning', rows.msg)
        } else {
          this.options = rows.data.map(el => ({ ...el, path: el.nameCn }))
        }
      })
    }
  }
}
</script>

<style>
</style>
