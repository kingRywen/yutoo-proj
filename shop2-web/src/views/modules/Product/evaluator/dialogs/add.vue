<template>
  <div>
    <addTasks :addOptions="addOptions" @clearInput="clearInput" :noAsin="formData.dataType !== 0" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item label-width="90px" prop="dataType" label="数据类型" :rules="[{required:true,message:'请输入关键词'}]">
            <el-select class="w100" v-model="formData.dataType" placeholder="请选择数据类型">
              <el-option v-for="item in evaType" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.dataType == 1"
            label-width="90px"
            prop="pcId"
            label="Top100类目"
            :rules="[{required:true,message:'请输入关键词'}]"
          >
            <el-cascader @change="activeItemChange" ref="cas" class="w100" :props="props" v-model="formData.pcId"></el-cascader>
          </el-form-item>
          <el-form-item prop="keyword" v-if="formData.dataType == 0">
            <el-input v-model="formData.keyword" placeholder="多个换行输入ASIN，最多限制200个..." type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'
export default {
  data() {
    let vm = this
    return {
      props: {
        // value: 'pcid',
        // label: 'name',
        // leaf: 'haveChildren',
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          // const { level } = node
          setTimeout(() => {
            let parentId = node.value || 0
            let nodes = []
            vm.$api['productAnalysis/categoryGetCategory']({
              ...vm.storeInfo,
              parentPcid: parentId
            }).then(res => {
              nodes = res.data.map(e => ({
                value: e.pcid,
                label: e.name,
                leaf: !e.haveChildren
              }))
              resolve(nodes)
            })
          })
        }
      },
      evaType: this.$const['PRODUCTANALYSIS/evaDataType'],
      //传给子组件参数
      addOptions: {
        num: 200,
        rightTitle: 'ASIN', //右侧表格标题
        regText: this.$const['OTHER/asinExp'] //验证规则,现在是逐个验证;
      },
      formData: {
        dataType: 0,
        keyword: null
      }
    }
  },
  watch: {
    'formData.dataType'(val) {
      if (val == 0) {
        this.addOptions.rightTitle = 'ASIN'
      } else if (val == 1) {
        this.addOptions.rightTitle = 'TOP100链接'
      } else if (val == 2) {
        this.addOptions.rightTitle = 'Review TOP10000'
      }
    }
  },
  methods: {
    getNode(menu, id) {
      let child = []
      ;[].forEach.call(menu, el => {
        child.push(...el.$children[0].$children)
      })
      child = child.filter(el => el.$options._componentTag === 'cascader-node')
      return child.find(
        el => el.value && el.value.slice().pop() === id.slice().pop()
      )
    },
    activeItemChange(val) {
      let panal = this.$refs.cas.$refs.panel.$refs.menu
      let el = this.getNode(panal, val)
      if (el) {
        el.handleExpand()
      }
    },
    //判断是否需要清空input,如果全部验证通过需要清空input,反之则留下未验证通过的;
    clearInput(data) {
      if (data) {
        this.formData.keyword = data
      } else {
        this.formData.keyword = null
        this.$nextTick(() => {
          this.$refs.formData.clearValidate()
        })
      }
    },
    _submit() {
      let [...childData] = this.$refs.child.formList
      if (this.formData.dataType == 0 && childData && childData.length == 0)
        return this.$message.warning('请添加ASIN!')
      let params = {
        ...this.storeInfo,
        dataType: this.formData.dataType,
        pcId: this.formData.pcId && this.formData.pcId.slice(0).pop(),
        dataSource: childData
      }
      return this.$refs.formData
        .validate()
        .then(() => this.$api['productAnalysis/reviewerSaveTask'](params))
    }
  },
  components: {
    addTasks
  }
}
</script>

<style>
</style>
