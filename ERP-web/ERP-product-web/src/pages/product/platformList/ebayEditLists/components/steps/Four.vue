<template>
  <UeEditor :disabled="review" v-model="data.description" ref="editor"/>
</template>

<script>
import UeEditor from '../UeEditor'
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import mixins from './mixins';

export default {
  components: {
    UeEditor
  },
  mixins: [mixins],
  
  data() {
    return {
      groupCode: 2
    }
  },
  methods: {
    save() {
      const dataMap = this.data
      let data = {
        dataMap
      }
      this.saveData(data)
    },
    validate() {
      if (!this.data.description ||this.data.description === '') {
        showToast('warning', '请输入描述信息')
        return Promise.reject()
      }else {
        return Promise.resolve()
      }
      
    }
  }
}
</script>

<style>
</style>
