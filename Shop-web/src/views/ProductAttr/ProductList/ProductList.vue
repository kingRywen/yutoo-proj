<!--  -->
<template>
  <div>
    <MainLayout
      v-if="show"
      :edits="edits"
      :editBtns="editBtns"
      :outerParams="outerParams"
      :searchFields="searchFields"
      :columns="columns"
      :searchFunc="searchFunc"
      :treeTable="treeTable"
      :treeTableOtions="treeTableOtions"
      @selectChange="selectChange"
      reserveSelection="parentAsin"
      ref="layout"
      url="selAttrProductList"
    ></MainLayout>
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
  props: ['outerParams', 'cateId'],
  components: {},
  data() {
    let vm = this
    return {
      treeTable: true,
      treeTableOtions: {
        childs: 'sameListings',
        expandFunc: row => {
          return row.sameListings && row.sameListings.length > 0
        }
      },
      // sider end

      parentSkus: null,
      searchFields: [
        {
          label: '款式类型',
          name: 'popularFlag',
          placeholder: '请选择',
          labelWidth:'60px',
          type: 'select',
          // optionsHoverFunc(i) {
          //   return i.value === 0
          // },
          options: [
            {
              label: '衰款',
              value: 0
            },
            {
              label: '爆款',
              value: 1
            }
          ]
        }
      ],
      editBtns: [
        {
          name: '导入产品属性值',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '导入产品属性值',
              size: 'small',
              component: () => import('./children/import.vue'),
              params: {
                cateId: this.cateId
                // close: () => {
                //   vm.getLayoutList();
                // }
              }
              //   okBtnText: "确认",
              //   cancelBtnText: "取消"
            })
          }
        },
        {
          name: '添加产品属性',
          fn: () => {
            let cateId, cateFlag, parentAsins
            // console.log(vm.slectIds, "slectIds");
            cateId = this.cateId
            cateFlag = this.outerParams.cateFlag
            if (this.slectIds.length == 0) {
              // 添加类目属性
              // cateId = this.cateId
              // cateFlag = this.outerParams.cateFlag
            } else if (this.slectIds.length > 1) {
              // 添加多个产品属性
              parentAsins = this.slectIds
            } else{
              // 添加 一个产品属性 需要回显
              parentAsins = this.slectIds
            }
            this.$refs.layout.$dialog({
              title: '添加产品属性',
              width: '600px',
              component: () => import('./children/addAttr.vue'),
              params: {
                cateId,
                cateFlag,
                parentAsins
                // close: () => {
                //   vm.getLayoutList();
                // }
              },
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '提取ASIN',
          fn: () => {
            if (this.slectIds.length == 0) {
              this.$message.warning('请选择一项提取')
              return
            }
            // console.log(this.slectIds);
            this.$refs.layout.$dialog({
              title: '提取ASIN',
              size: 'small',
              copyText: this.slectIds.join('\n'),
              component: () => import('./children/copyText.vue'),
              params: {
                value: this.slectIds.join('\n')
              },
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '设为同款',
          showLoading: true,
          fn: () => {
            return this.setSameOrSingle()
          }
        },
        {
          name: '设为独立产品',
          showLoading: true,
          fn: () => {
            return this.setSameOrSingle(0)
          }
        },
        {
          name: '移入到类目',
          fn: () => {
            if (this.slectIds.length == 0) {
              this.$message.warning('请选择一项提取')
              return
            }
            this.$refs.layout.$dialog({
              title: '选择要移入的类目',
              size: 'small',
              component: () => import('./children/MoveCategory.vue'),
              params: {
                cateId: this.outerParams.cateId,
                cateFlag: this.outerParams.cateFlag,
                parentAsins: this.slectIds
              },
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '导出',
          showLoading: true,
          fn: () => {
            let params = { ...this.mustParams, parentAsins: this.slectIds.length ? this.slectIds : null }
            return this.$api[`selAttrProductExportProductData`](params)
              .then(data => {
                downloadFile(data, '产品列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
              })
              .catch(() => {})
          }
        },
        {
          name: '删除',
          showLoading:true,
          fn: () => {
            if (this.slectIds.length == 0) {
              this.$message.warning('请选择产品删除')
              return Promise.reject()
            }
            return this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = { ...this.mustParams, parentAsins: this.slectIds }
                return this.$api[`taskSelAttrBatchRemoveProduct`](params)
                  .then(data => {
                    this.$refs.layout.getList()
                  })
                  .catch(() => {})
            }).catch(() => {

            });
           
          }
        }
      ],
      //columns表格
      columns: [
        {
          label: 'ASIN',
          value: 'parentAsin',
          url: 'productUrl',
          // noShowTooltip: true,
          showTooltip:true,
          expand: true,
          //noRetract: true,
          width: 150,
          async: false,
          align:'left'
        },
        {
          img: true,
          label: '主图',
          value: 'imageUrl',
          badge(scope) {
            return scope.row.popularFlag ? '爆' : '衰'
          },
          badgeType(scope) {
            return scope.row.popularFlag ? 'danger' : 'info'
          }
        },

        {
          label: '价格',
          value: 'price'
        },
        {
          label: '颜色',
          value: 'color',
          render(h, scope) {
            let { color } = scope.row
            return color ? (
              <el-tooltip open-delay={300} content={color.join(', ')} placement="top" effect="light">
                <span class="fix__row_1">{color.join(', ')}</span>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '尺寸',
          value: 'size',
          render(h, scope) {
            let { size } = scope.row
            return size ? (
              <el-tooltip open-delay={300} content={size.join(', ')} placement="top" effect="light">
                <span class="fix__row_1">{size.join(', ')}</span>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '包装重量',
          value: 'shippingWeight',
          render(h, scope) {
            let { shippingWeight } = scope.row
            // return <span class="fix__row_1">{shippingWeight.join(', ')}</span>
            return shippingWeight ? (
              <el-tooltip open-delay={300} content={shippingWeight.join(', ')} placement="top" effect="light">
                <span class="fix__row_1">{shippingWeight.join(', ')}</span>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '包装尺寸',
          value: 'dimensions',
          render(h, scope) {
            let { dimensions } = scope.row
            return dimensions ? (
              <el-tooltip open-delay={300} content={dimensions.join(', ')} placement="top" effect="light">
                <span class="fix__row_1">{dimensions.join(', ')}</span>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '材质',
          value: 'material',
          render(h, scope) {
            let { material } = scope.row
            // return <span class="fix__row_1">{material.join(', ')}</span>
            return material ? (
              <el-tooltip open-delay={300} content={material.join(', ')} placement="top" effect="light">
                <span class="fix__row_1">{material.join(', ')}</span>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '所属类目',
          value: 'category',
          urlItem: 'categoryUrl',
          showTooltip:true
          // render(h,scope){
          //   let {category} = scopw.row
          //   return category ?(
          //     <el-tooltip placement="top" effect="light">
          //       <span slot="content">{category}</span>
          //       <div style='text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'>
          //           <a  href={scope.row.categoryUrl} target="_blink" style='#108ee9;display:block;'>{category}</a>
          //       </div>
          //     </el-tooltip>
          //   ) : (
          //      <span v-else>-</span>
          //   )
          // }
        }
      ],
      //表格列表操作按钮
      edits: [
        {
          name: '查看产品属性',
          icon: 'el-icon-search',
          show: scope => {
            return true
          },
          fn: scope => {
            this.$refs.layout.$dialog({
              title: '产品属性',
              size: 'medium',
              component: () => import('./children/ViewAttrs.vue'),
              params: {
                parentAsin: scope.row.parentAsin
              }
            })
          }
        }
      ],
      slectIds: [] //选择的ID的数组
    }
  },

  created() {},
  mounted() {},
  methods: {
    // 清除选择数据
    clearSelection() {
      return this.$refs.layout.clearSelection()
    },
    // 设置为同款 或者 独立产品
    setSameOrSingle(sameFlag = 1) {
      if (this.slectIds.length <= 1 && sameFlag) {
        this.$message.warning('请至少选择两款产品')
        return Promise.reject()
      }
      if (!sameFlag && this.slectIds.length === 0) {
        this.$message.warning('请至少选择一款产品')
        return Promise.reject()
      }
      return this.$confirm(`是否设置为${sameFlag ? '同款？' : '独立产品？'}`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            siteId: this.outerParams.siteId,
            sellerId: this.outerParams.sellerId,
            platformId: this.platformId,
            cateId: this.outerParams.cateId,
            cateFlag: this.outerParams.cateFlag,
            sameFlag,
            parentAsins: this.slectIds
          }
          return this.$api[`selAttrProductManualHandle`](params)
            .then(data => {
              this.$refs.layout.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data
      let [startTime, endTime] = time || []
      return { startTime, endTime, ...info }
    }, //勾选改变
    selectChange(v) {
      //   console.log(v);
      this.slectIds = []
      v.forEach(i => {
        this.slectIds.push(i.parentAsin)
      })
      //console.log(this.slectIds);
    },
    //清空费用按钮
    delBtn() {
      if (this.slectIds.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
        return
      }
      this.$api['taskSelAttrBatchRemoveProduct']({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        parentAsins: this.slectIds
      })
        .then(data => {
          if (data.code === 0) {
            this.$refs.layout.getList()
          }
        })
        .catch(() => {})
    }
  },
  computed: {
    mustParams() {
      return {
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        platformId: this.platformId,
        cateId: this.outerParams.cateId,
        cateFlag: this.outerParams.cateFlag
      }
    },
    show() {
      if (!this.outerParams) {
        return false
      }
      return this.outerParams.cateFlag != null
    }
  },
  watch: {}
}
</script>

<style lang='scss' scoped>
</style>
