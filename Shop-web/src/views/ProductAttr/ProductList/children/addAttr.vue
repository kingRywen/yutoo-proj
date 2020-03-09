<template>
  <div>
    <section style='margin-top: -20px;'>
      <h4>属性列表</h4>
      <span v-for="(tag, index) in arrtList" @click="handleClick(tag, index)">
        <el-tag
          :key="tag.attrKey"
          :type="tag.attrKey !== currentKey ? 'info' : 'success'"
          style="margin-right:10px"
          class="mb10"
          closable
          @close="handleAttrKeyClose(index)"
        >{{tag.attrKey}}</el-tag>
      </span>

      <el-input
        type="textarea"
        :rows="5"
        class="input-new-tag mt10"
        v-model.trim="inputValue"
        ref="saveTagInput"
        size="small"
        placeholder="自定义添加,多个换行输入"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <!-- 添加父 -->
      <el-button class="button-new-tag mt10" size="small" @click="showInput">+</el-button>
    </section>

    <!-- 根据父展示子 -->
    <section style="margin-top:8px">
      <h4>属性值列表</h4>
      <el-tag
        class="mb10"
        style="margin-right:10px"
        :key="tag"
        v-for="(tag, index) in attrValues"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        @click="clickTEvent"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        type="textarea"
        :rows="5"
        placeholder="自定义添加,多个换行输入"
        v-model.trim="inputValue2"
        ref="saveTagInput"
         @keyup.enter.native="handleInputConfirm2"
        @blur="handleInputConfirm2"
        size="small"
      ></el-input>
      <!-- 添加子 -->
      <el-button  class="button-new-tag mt10" size="small" @click="handleInputConfirm2">+</el-button>
    </section>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      currentKey: null,
      arrtList: [],

      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      dynamicTags2: [],
      inputVisible2: false,
      inputValue2: ''
    }
  },
  computed: {
    attrValues() {
      if (!this.arrtList.length) {
        return []
      }
      let el = this.arrtList.find(el => el.attrKey === this.currentKey)
      return (
        el ? el.attrValue : []
      )
    }
  },
  created() {
    this.loadAttr()
  },
  methods: {
    // 请求属性列表
    loadAttr() {
      if (this.params.parentAsins && this.params.parentAsins.length === 1) {
        let params = {
        parentAsin: this.params.parentAsins[0],
        siteId: this.siteId,
        sellerId: this.sellerId,
        platformId: this.platformId
      }
      return this.$api[`selAttrProductListProductAttr`](params)
        .then(data => {
          //   console.log(data, "data");
          if (data.data) {
            this.arrtList = data.data
            this.currentKey = data.data[0].attrKey
            data.data.forEach(el => {
              this.dynamicTags.push(el.attrKey)
            })
          }
        })
        .catch(() => {})
      }
      
    },
    // 父
    handleAttrKeyClose(index) {
      this.$confirm('是否删除此属性及属性值？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.arrtList.splice(index, 1)
          this.currentKey = this.arrtList[0].attrKey

        })
        .catch(() => {})
    },
    handleClick(tag, index) {
      // console.log(123123)
      this.currentKey = tag.attrKey
    },
    // 点击tag事件 点击父，找到子集合
    clickTEvent(arg) {
      //   console.log(arg, "arg");
      let target = arg.target.innerText.trim()
      let child = this.arrtList.find(el => {
        console.log(el.attrKey.length)
        return target == el.attrKey
      })
      console.log(child, 'child')
    },
    handleClose(tag) {
      let current = this.arrtList.find(el => el.attrKey === this.currentKey)
      current.attrValue = current.attrValue.filter(el => el !== tag)
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.textarea.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (this.arrtList.find(el => el.attrKey === inputValue)) {
        this.$message.warning('已存在名字相同的属性，请修改后再试')
        return
      }
      if (inputValue) {
        inputValue = this.$.getAsins(inputValue)
        inputValue.forEach(key => {
          this.currentKey = key
          this.arrtList.push({
            attrKey: key,
            attrValue: []
          })
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 父end
    // 子begin
    handleClose2(tag) {
      this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag), 1)
    },

    showInput2() {
      this.inputVisible2 = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.$refs.textarea.focus()
      })
    },

    handleInputConfirm2(index) {
      //console.log(index);
      let inputValue2 = this.inputValue2
      let current = this.arrtList.find(el => el.attrKey === this.currentKey)
      if (!current) {
        this.$message.warning('请先添加属性')
        return
      }

      // console.log(current);
      // return
      if (inputValue2) {
        if (current.attrValue.indexOf(inputValue2) > -1) {
          this.$message.warning('已存在名字相同的属性值，请修改后再试')
          return
        }
        current.attrValue.push(inputValue2)
      }
      this.inputVisible2 = false
      this.inputValue2 = ''
    },
    // end 子
    _submit() {
      if (this.arrtList.length=== 0) {
        this.$message.warning('请先添加属性')
        return
      }
      let { platformId, sellerId, siteId } = this.sellerData
      return this.$api[`selAttrProductSaveProductAttr`]({
        platformId,
        sellerId,
        siteId,
        parentAsins: this.params.parentAsins,
        cateId: this.params.cateId,
        cateFlag: this.params.cateFlag,
        listAttr: this.arrtList
      }).then(data => {
        return true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  cursor: pointer;
}
</style>
