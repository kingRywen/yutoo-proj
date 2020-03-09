<template>
  <div>
    <ElForm ref="form" :model="addData" :rules="rules" size="small" label-width="80px">
      <ElRow>
        <ElCol :span="10">
          <ElFormItem label="类目名称" prop="categoryName">
            <ElInput v-model="addData.categoryName"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="10">
          <ElFormItem label="上级类目">
            <SyncCascader
              ref="tree"
              :clearable="true"
              :props="parentProps"
              v-if="show"
              @changeEl="handleChangeCas"
              v-model="addData.parentCategoryId"
              :itemDisabled="disabledId"
              :get-el="true"
              :load="loadTreeNoLast"
            ></SyncCascader>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label>
            <el-checkbox
              :disabled="this.$parent.$parent.$parent.title === '编辑类目' ? addData.used : false"
              v-model="addData.lastLevel"
              label="最底层目录"
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <CategoryCrowd
        @hook:mounted="crowdMounted"
        ref="crowd"
        :must="isMust"
        :parentCategoryId="addData.parentCategoryId"
      />
      <div v-if="addData.lastLevel" class="bg mt10">
        <ElRow>
          <ElCol :span="24">
            <h4>平台站点映射</h4>
          </ElCol>
        </ElRow>
        <ElRow v-for="(item, index) in addData.categorySysSiteMappingArray" :gutter="10" :key="index">
          <template>
            <ElCol :span="10">
              <ElFormItem
                label="平台站点"
                :prop="`categorySysSiteMappingArray.${index}.platformSiteId`"
                :rules="siteRule(item, index, addData.categorySysSiteMappingArray)"
              >
                <ElCascader
                  :props="categorySysSiteOpts"
                  :options="options"
                  v-model="item.platformSiteId"
                  clearable
                  @change="handleChange(item, index, $event)"
                ></ElCascader>
              </ElFormItem>
            </ElCol>
            <ElCol :span="10">
              <ElFormItem
                label="平台类目"
                :prop="`categorySysSiteMappingArray.${index}.categoryId`"
                v-if="item.show && options.length"
                :rules="[{required: true, message: '请选择平台类目'}]"
              >
                <SyncCascader
                  :clearable="true"
                  :props="props"
                  :params="{platformSiteCode: getCode(item.platformSiteId)}"
                  v-model="item.categoryId"
                  :get-el="true"
                  :load="loadSiteTree"
                ></SyncCascader>
              </ElFormItem>
              <span v-else>&nbsp;</span>
            </ElCol>
            <ElCol :span="4" class="txc">
              <ElButton size="small" type="text" icon="el-icon-plus" @click="handlePlus(item, index)"></ElButton>
              <ElButton
                size="small"
                type="text"
                icon="el-icon-minus"
                @click="handleMinus(item, index)"
                v-if="addData.categorySysSiteMappingArray.length > 1"
              ></ElButton>
            </ElCol>
          </template>
        </ElRow>
      </div>
    </ElForm>

    <!-- <yt-dialog :events="dialogEvents" :options="dialogOptions">
      
    </yt-dialog>-->
  </div>
</template>

<script>
export default {
  components: {
    CategoryCrowd: () => import('./CategoryCrowd.vue')
  },
  data() {
    const checkSiteRule = (item, index, arr) => [
      {
        validator: (rule, value, cb) => {
          this.$refs.form.clearValidate()
          let i = arr.findIndex(
            el => JSON.stringify(el.platformSiteId) === JSON.stringify(value)
          )
          if (i > -1 && i !== index) {
            cb(new Error('不能存在相同的平台站点'))
          }
          cb()
        }
      }
    ]
    return {
      siteRule: checkSiteRule,
      crowdMountFlag: false,
      currentNode: null,
      show: false,
      disabledId: null,
      res: false,
      flag: true,
      options: [],
      dialogOptions: {
        visible: false,
        title: '类目人群',
        width: '800px',
        appendToBody: true
      },
      dialogEvents: {},
      addData: {
        categoryName: null,
        parentCategoryId: [],
        categorySysSiteMappingArray: [
          {
            parentCategoryId: null,
            categorySysSite: [],
            show: false
          }
        ]
      },
      rules: {
        categoryName: [{ required: true, message: '请输入类目名称' }],
        parentCategoryId: [{ required: true, message: '请选择上级类目' }]
      },
      props: {
        label: 'categoryName',
        value: 'categoryId',
        children: 'childs',
        enabled: 'disabled'
      },
      parentProps: {
        label: 'categoryName',
        value: 'categorySysId',
        children: 'childs',
        enabled: 'enabled'
      },
      categorySysSiteOpts: {
        label: 'cnName',
        value: 'platformSiteId',
        children: 'childArray'
      }
    }
  },
  computed: {
    isMust() {
      // debugger
      let crowd = this.$refs.crowd
      if (this.crowdMountFlag) {
        if (this.addData.lastLevel) {
          return true
        }
        let arr = crowd.addData.categorySysCrowdArray
        console.log(arr.some(el => el.crowdId != null || el.rate != null))
        if (arr.some(el => el.crowdId != null || el.rate != null)) {
          return true
        } else {
          return false
        }
      } else {
        return !!this.addData.lastLevel
      }
    }
  },
  created() {
    if (this.$parent.$parent.title !== '编辑类目') {
      this.show = true
    }
    if (this.$parent.$parent.$parent.title === '新增系统类目') {
      this.getList()
    }
  },

  methods: {
    crowdMounted() {
      this.crowdMountFlag = true
    },
    filterFunc(el) {
      return !el.lastLevel
    },
    handleChangeCas(val) {
      this.$emit('changeEl', val)
    },
    validate() {
      let { form, crowd } = this.$refs,
        promises = []
      promises.push(form)
      if (crowd) {
        promises.push(crowd)
      }

      return Promise.all(promises.map(el => el.validate())).then(res => {
        if (this.addData.lastLevel) {
          const total = this.$refs.crowd.addData.categorySysCrowdArray.reduce(
            (total, el) => {
              return total + el.rate
            },
            0
          )
          if (total !== 100) {
            return Promise.reject('人群占比总和必须为100')
          }
        }
        return Promise.resolve()
      })
    },
    getCode(id) {
      let res
      let _id = id.slice(0).pop()
      this.options.forEach(element => {
        element.childArray.forEach(el => {
          if (el.platformSiteId === _id) {
            res = el.code
            return false
          }
        })
      })
      return res
    },
    openDialog() {
      this.dialogOptions.visible = true
    },
    handleChange(item, index, val) {
      // console.log(val)
      if (val.length == 0) {
        item.categoryId = []
      }
      item.show = false
      if (val.length) {
        this.$nextTick(() => {
          item.show = true
        })
      }
    },
    handlePlus(item, index) {
      this.addData.categorySysSiteMappingArray.splice(index + 1, 0, {
        parentCategoryId: null,
        categorySysSite: [],
        show: false
      })
    },
    handleMinus(item, index) {
      this.addData.categorySysSiteMappingArray.splice(index, 1)
    },
    // validate() {
    //   if (this.flag) {
    //     return this.$refs.form.validate()
    //   } else {
    //     return this.$refs.crowd.validate()
    //   }
    // },
    setData(data1) {
      this.show = false
      let {
        categoryName,
        categorySysCrowdArray,
        lastLevel,
        parentCategoryId,
        categorySysSiteMappingArray,
        categorySysId,
        used
      } = data1
      this.disabledId = categorySysId.slice(0).pop()
      try {
        this.getList().then(data => {
          this.show = true
          categorySysSiteMappingArray.map(el => {
            let { categorySysId, categoryMap, platformSiteId, categoryId } = el
            // debugger
            if (categoryMap) {
              let arr = categoryMap[categoryId] || []
              el.categoryId = arr.concat([categoryId])
            } else {
              el.categoryId = [categoryId]
            }
            // el.categoryId = el.categoryId

            let platList = data,
              current = []
            platList.forEach(el => {
              el.childArray.forEach(_el => {
                if (_el.platformSiteId === platformSiteId) {
                  current = [el.enName, platformSiteId]
                  return false
                }
              })
              if (current[0]) {
                return false
              }
            })
            el.platformSiteId = current
            el.show = true
          })

          if (!categorySysSiteMappingArray.length) {
            categorySysSiteMappingArray = [
              {
                parentCategoryId: null,
                categorySysSite: [],
                show: false
              }
            ]
          }

          parentCategoryId = categorySysId.slice(0, -1)
          this.addData = {
            used,
            categorySysId,
            lastLevel,
            categoryName,
            parentCategoryId,
            categorySysSiteMappingArray
          }
          this.$refs.crowd.setArray(categorySysCrowdArray)
        })
      } catch (error) {}

      //
    },
    clear() {
      Object.assign(this.$data, this.$options.data())
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      // })
    },
    getList() {
      return this.$api[`main/platformSiteDropdownList`]({})
        .then(data => {
          let res = []
          data.forEach(el => {
            el.platformSiteId = el.enName
            if (el.childArray) {
              el.childArray.forEach(_el => {
                _el.code = el.code + '-' + _el.code
              })
            }
          })
          this.options = data
          return data
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="scss"  scoped>
.bg {
  background: #f4f4f6;
  padding: 0 20px;
}
</style>
