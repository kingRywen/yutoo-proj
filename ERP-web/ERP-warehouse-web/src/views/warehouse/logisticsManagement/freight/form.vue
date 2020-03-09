<template>
  <div class="yt-form">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      class="twp-form"
      :inline="false"
      :size="formArr.size || 'small'"
      :label-width="formArr.labelWidth || '90px'"
      :style="{width: formArr.width || '100%'}"
    >
      <ElRow v-for="i in formArr.opt" :key="i.id">
        <ElCol :span="24">
          <ElFormItem v-if="i.child" :label="i.label" :rules="[{required: i.required || false}]">
            <div class="elcol">
              <ElFormItem
                v-for="item in i.child"
                :key="item.id"
                :prop="item.value"
                :label-width="item.labelWidth"
                style="margin-bottom: 0"
              >
                <div style="display:flex;">
                  <span style="padding: 0 4px;" v-if="item.label">{{item.label}}</span>
                  <!-- input -->
                  <ElInput
                    v-if="item.type == 'input'"
                    v-model="form[item.value]"
                    :placeholder="item.placeholder"
                    :style="{width: item.width || '167px'}"
                  ></ElInput>
                  <!-- select -->
                  <el-select
                    v-else-if="item.type == 'select'"
                    v-model="form[item.value]"
                    :placeholder="item.placeholder"
                    :style="{width: item.width || '167px'}"
                    :multiple="item.multiple || false"
                    :disabled="item.disabled || false"
                    :clearable="item.clearable || true"
                    @change="change($event, item.change)"
                  >
                    <template v-if="item.list || []">
                      <el-option v-for="op in item.list" :key="op.id" :label="op.label" :value="op.value"></el-option>
                    </template>
                  </el-select>
                  <span style="padding: 0 4px;" v-if="item.backLabel">{{item.backLabel}}</span>
                  <span style="padding: 0 4px" v-else></span>
                </div>
              </ElFormItem>
            </div>
          </ElFormItem>
          <ElFormItem v-else :label="i.label" :prop="i.value">
            <!-- input -->
            <ElInput
              v-if="i.type == 'input'"
              :clearable="i.clearable || true"
              v-model="form[i.value]"
              :placeholder="i.placeholder"
              :style="{width: i.width || '400px'}"
            ></ElInput>
            <!-- input -->
            <ElInput
              v-if="i.type == 'textarea'"
              v-model="form[i.value]"
              type="textarea"
              :placeholder="i.placeholder"
              :style="{width: i.width || '400px'}"
            ></ElInput>
            <!-- select -->
            <el-select
              v-else-if="i.type == 'select'"
              v-model="form[i.value]"
              :placeholder="i.placeholder"
              :style="{width: i.width || '400px'}"
              :multiple="i.multiple || false"
              :disabled="i.disabled || false"
              :clearable="i.clearable || true"
              @change="change($event, i.change)"
            >
              <template v-if="i.list || []">
                <el-option v-for="op in i.list" :key="op.id" :label="op.label" :value="op.value"></el-option>
              </template>
            </el-select>
            <!-- 是否激活 -->
            <el-checkbox
              v-else-if="i.type == 'active'"
              :data="form[i.value] || (form[i.value] = 0)"
              v-model="form[i.value]"
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
            <span style="padding: 0 4px;" v-if="i.backLabel">{{i.backLabel}}</span>
            <span style="padding: 0 4px" v-else></span>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem>
        <ElButton type="default" @click="submit">提交</ElButton>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formArr: {
      default: () => {
        return {
          labelWidth: '100px',
          opt: [
            {
              type: 'input',
              value: 'aaa',
              label: '名字',
              placeholder: '请输入内容',
              required: true,
              child: [
                {
                  type: 'select',
                  value: 'aaa1',
                  label: '前面文字',
                  backLabel: '后面文字',
                  multiple: true,
                  placeholder: '请输入内容',
                  disabled: false,
                  clearable: true,
                  change: val => {
                    console.log(val)
                  },
                  list: [
                    {
                      label: '名字',
                      value: 'name1'
                    },
                    {
                      label: '名字2',
                      value: 'name2'
                    }
                  ]
                },
                {
                  type: 'input',
                  value: 'aaa2',
                  placeholder: '请输入内容'
                }
              ]
            },
            {
              type: 'select',
              value: 'aaa3',
              label: '名字1',
              placeholder: '请输入内容'
            },
            {
              type: 'input',
              value: 'aaa4',
              label: '名字2',
              placeholder: '请输入内容',
              required: true
            },
            {
              type: 'textarea',
              value: 'aaa5',
              label: '名字3',
              placeholder: '请输入内容',
              required: true
            },
            {
              type: 'active',
              value: 'activateFlag',
              label: '是否激活'
            }
          ]
        }
      }
    }
  },
  data() {
    let vm = this
    let validArr = []
    vm.formArr.opt &&
      vm.formArr.opt.map(item => {
        vm.$nextTick(() => {
          item.multiple && vm.$set(vm.form, item.value, [])
          vm.$refs['form'].clearValidate()
        })
        if (item.required) {
          validArr.push({
            label: item.label,
            value: item.value
          })
          if (item.child && item.child.length) {
            item.child.map(el => {
              vm.$nextTick(() => {
                el.multiple && vm.$set(vm.form, el.value, [])
                vm.$refs['form'].clearValidate()
              })
              validArr.push({
                label: el.label,
                value: el.value
              })
            })
          }
        }

        return item
      })
    return {
      formLabWid: '90px',
      form: {},
      // formArr: {
      //   type: 'input',
      //   value: 'aaa',
      //   label: '名字',
      //   placeholder: '请输入内容'
      // },
      rules: vm.$formValidate([...vm.$clone(validArr)])
    }
  },
  mounted() {},
  methods: {
    change(val, change) {
      if (change) {
        change(val)
      }
    },
    format(num) {
      return parseInt('100%') - parseInt(num) + '%'
    },
    submit() {
      let vm = this
      vm.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('submit', vm.form)
        } else {
          console.log(vm.form)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.yt-form {
  background: #fff;

  .elcol {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>