<template>
  <div class="transports">
    <el-button type="primary" @click="handleClick">选择运输方式</el-button>
    <yt-dialog :options="options">
      <el-form>
        <el-form-item label-width="86px" label="运输方式：" prop="transports">
          <el-select v-model="transports1" style="width: 100%" multiple collapse-tags placeholder="请选择" size="small">
            <el-option v-for="item in transportsList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label-width="0px" class="saveBtn">
          <el-button size="small" type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  props: {
    transports: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        visible: false,
        title: '选择运输方式',
        width: '360px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      transports1: [],
      transportsList: []
    }
  },
  watch: {
    transports: {
      immediate: true,
      handler(val) {
        let vm = this
        val = vm.$.deepClone(val) || []
        this.transports1 = val
      }
    }
  },
  methods: {
    handleClick() {
      let vm = this
      vm.options.visible = true
      vm.$api['order/getTransportTypeList']({
        type: 3
      })
        .then(data => {
          if (!data && !data.rows) {
            return
          }
          vm.transportsList = data.rows.map(item => {
            return {
              label: item.transportTypeName,
              value: item.transportTypeId
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSubmit() {
      let vm = this
      let arr = vm.transports1.map(item => {
        return vm.transportsList.find(el => el.value === item)
      })
      console.log(arr)

      this.$emit('close', arr)
      vm.options.visible = false
    }
  }
}
</script>

<style lang="scss">
.transports {
  display: inline-block;
}
</style>
