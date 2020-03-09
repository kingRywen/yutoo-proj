<template>
  <div class="asin">
    <el-button type="primary" @click="handleClick">选择Asin</el-button>
    <el-tooltip placement="top" effect="light">
      <div slot="content" style="line-height:2">
        <h4>已选择的ASIN:</h4>
        <p v-for="(i, j) in asin1" :key="j">{{i}}</p>
      </div>
      <i style="margin-left:10px" class="el-icon-view"></i>
    </el-tooltip>
    <yt-dialog :options="options">
      <el-form label-width="56px">
        <el-form-item label="Asin：" prop="asin">
          <el-select style="width:100%" v-model="asin1" placeholder="请选择" collapse-tags multiple size="small">
            <el-option v-for="item in asinList" :label="item.label" :value="item.value" :key="item.id"></el-option>
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
    asin: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      asin1: [],
      options: {
        visible: false,
        title: '选择Asin',
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
      asinList: []
    }
  },
  watch: {
    asin: {
      immediate: true,
      handler(val) {
        let vm = this
        val = vm.$.deepClone(val) || []
        this.asin1 = val
      }
    }
  },
  methods: {
    handleClick() {
      let vm = this
      vm.options.visible = true
      vm.$api['email/getStoreProductAsin']({
        platformIds: [1, 2, 3]
      })
        .then(data => {
          if (!data && !data.rows) {
            return
          }
          vm.asinList = data.rows.map(item => {
            return {
              label: item.asin,
              value: item.asin
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSubmit() {
      let vm = this
      this.$emit('close', vm.asin1)
      vm.options.visible = false
    }
  }
}
</script>

<style lang="scss">
.asin {
  display: inline-block;
  padding-left: 10px;
}
</style>
