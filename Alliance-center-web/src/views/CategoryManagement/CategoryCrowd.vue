<template>
  <div>
    <ElForm ref="form" :model="addData" size="small" label-width="80px">
      <ElRow v-if="title === '人群设置' || title === '编辑类目'">
        <ElCol :span="10">
          <ElFormItem label="类目名称" prop="categoryName" :rules="[{required: true, message:'请输入类目名称'}]">
            <ElInput v-model="addData.categoryName"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="10">
          <ElFormItem label="上级类目">
            <SyncCascader :props="props" disabled v-model="addData.parentCategoryId" :load="loadTree"></SyncCascader>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div class="bg">
        <ElRow>
          <ElCol :span="24">
            <h4>
              类目人群占比
              <el-button style="margin-left: 10px" type="text" @click="options.visible = true">新增人群</el-button>
              <!-- <el-switch v-if="true" v-model="reuseFlag" @change="handleReuse" active-text="是" inactive-text="否">复用父级</el-switch> -->
              <el-button v-if="parentCategoryId.length" style="margin-left: 10px" type="text" @click="handleReuse">复用父级</el-button>
            </h4>
          </ElCol>
        </ElRow>
        <ElRow v-for="(item, index) in addData.categorySysCrowdArray" :key="index">
          <template>
            <ElCol :span="10">
              <ElFormItem
                label="人群"
                :key="must"
                :prop="must ? `categorySysCrowdArray.${index}.crowdId` : null"
                :rules="must ? [{required: true, message:'请选择人群'}] : null"
              >
                <el-select
                  v-model="item.crowdId"
                  @visible-change="handleVisibleChange($event, item.crowdId)"
                  placeholder
                  style="width:100%"
                >
                  <el-option
                    v-for="item in crowdList"
                    :key="item.crowdId"
                    :disabled="item.disabled"
                    :label="item.crowdName"
                    :value="item.crowdId"
                  ></el-option>
                </el-select>
              </ElFormItem>
            </ElCol>
            <ElCol :span="10">
              <ElFormItem
                label="占比"
                :key="must"
                :required="!!must"
                :prop="must ? `categorySysCrowdArray.${index}.rate` : null"
                :rules="must ? rateRule(item, index) : null"
              >
                <ElInputNumber :min="1" :max="100" controls-position="right" v-model="item.rate"></ElInputNumber>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4" class="txc">
              <ElButton size="small" type="text" icon="el-icon-plus" @click="handlePlus(item, index)"></ElButton>
              <ElButton
                size="small"
                type="text"
                icon="el-icon-minus"
                @click="handleMinus(item, index)"
                v-if="addData.categorySysCrowdArray.length > 1"
              ></ElButton>
            </ElCol>
          </template>
        </ElRow>
      </div>
    </ElForm>
    <yt-dialog title="新增人群" :events="events" :options="options">
      <ThrongAdd ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import ThrongAdd from 'Views/AccountManagement/Throng/add.vue'
export default {
  props: {
    parentCategoryId: {
      default: () => []
    },
    must: {
      type: Boolean,
      default: true
    },
    data: {
      default: () => ({})
    },
    title: String
  },
  components: { ThrongAdd },
  data() {
    let vm = this
    let checkRate = (item, index) => (rule, value, cb) => {
      let categorySysCrowdArray = this.addData.categorySysCrowdArray
      if (!value) {
        cb(new Error('请输入占比'))
      }
      if (categorySysCrowdArray.every(el => el.rate)) {
        let total = categorySysCrowdArray.reduce(
          (total, cur) => total + cur.rate,
          0
        )
        if (total !== 100) {
          let arr = this.addData.categorySysCrowdArray
            .map((el, i) => i !== index && `categorySysCrowdArray.${i}.rate`)
            .filter(el => !!el)
          console.log(arr)
          vm.$refs.form.clearValidate()
          cb(new Error(`占比和必须为100% (目前占比和 ${total} %)`))
        } else {
          vm.$refs.form.clearValidate()
        }
      }

      cb()
    }
    return {
      rateRule(item, index) {
        let validator = checkRate(item, index)
        return [
          {
            validator
          }
        ]
      },
      reuseFlag: false,
      events: {
        handleOkClick() {
          let api =
            vm.options.title === '新增人群'
              ? `main/crowdSave`
              : `main/crowdUpdate`
          let data = vm.$refs.add.data
          return vm.$refs.add.validate().then(() => {
            return vm.$api[api](data)
              .then(data => {
                vm.options.visible = false
                vm.getCrowdList()
                // vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
        },
        close() {
          vm.$refs.add.clear()
        },
        handleOpen() {
          vm.$nextTick(() => vm.$refs.add.init())
        }
      },
      options: {
        visible: false,
        title: '新增人群',
        width: '600px',
        okBtnText: '确认',
        cancelBtnText: '取消',
        appendToBody: true
      },
      addData: {
        categoryName: null,
        parentCategoryId: [],
        categorySysCrowdArray: [
          {
            crowdId: null,
            rate: undefined
          }
        ]
      },
      rules: {},
      crowdList: [],
      props: {
        label: 'categoryName',
        value: 'categorySysId',
        children: 'childs',
        enabled: 'enabled'
      }
    }
  },
  watch: {
    'data.categoryName'(val) {
      this.addData.categoryName = val
    }
  },
  created() {
    this.getCrowdList()
  },
  methods: {
    handleReuse(val) {
      this.getReuseCrowd()
    },
    getReuseCrowd() {
      this.$api[`main/categorySysReuseCrowd`]({
        categorySysIdArray: this.parentCategoryId
      })
        .then(data => {
          // console.log(data);
          if (!data || !data.length) {
            this.addData.categorySysCrowdArray = [
              {
                crowdId: null,
                rate: undefined
              }
            ]
            return
          }
          this.addData.categorySysCrowdArray = data
        })
        .catch(err => {})
    },
    setArray(data) {
      if (!data.length) {
        this.addData.categorySysCrowdArray = [
          {
            crowdId: null,
            rate: undefined
          }
        ]
        return
      }
      this.addData.categorySysCrowdArray = data
    },
    handleVisibleChange(show, id) {
      if (show) {
        // console.log(show);
        const selected = this.addData.categorySysCrowdArray.map(
          el => el.crowdId
        )
        this.crowdList.map(el => {
          if (selected.indexOf(el.crowdId) > -1 && el.crowdId !== id) {
            this.$set(el, 'disabled', true)
          } else {
            this.$set(el, 'disabled', false)
          }
        })
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
    handlePlus(item, index) {
      this.addData.categorySysCrowdArray.splice(index + 1, 0, {
        crowdId: null,
        rate: undefined
      })
    },
    setData(data) {
      let {
        categoryName,
        parentCategoryId,
        categorySysCrowdArray,
        categorySysId
      } = data
      this.addData = {
        categoryName,
        parentCategoryId: categorySysId,
        categorySysCrowdArray: categorySysCrowdArray.length
          ? categorySysCrowdArray
          : [
              {
                crowdId: null,
                rate: undefined
              }
            ]
      }
      // if (categorySysCrowdArray.length) {
      //   this.addData.categorySysCrowdArray = categorySysCrowdArray
      // } else {
      //   this.addData.categorySysCrowdArray = [
      //     {
      //       crowdId: null,
      //       rate: undefined
      //     }
      //   ]
      // }
    },
    handleMinus(item, index) {
      this.addData.categorySysCrowdArray.splice(index, 1)
    },
    getCrowdList() {
      // console.log(123123);

      this.$api[`main/crowdDropdownList`]({})
        .then(data => {
          this.crowdList = data
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