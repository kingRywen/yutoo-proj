<template>
  <v-popover placement="bottomRight" trigger="click" class="__customList">
    <v-button icon="bars">
      <span></span>
    </v-button>
    <div slot="content">
      <v-checkbox-group
        keyField="field"
        label="title"
        :data="data"
        v-model="arrayValue"
        @change="checkGroup"
        class="group"
      ></v-checkbox-group>
    </div>
  </v-popover>
</template>

<script>
import { _storage } from 'common/common'
import Vue from 'vue'
import 'vue-beauty/package/style/vue-beauty.min.css'

//import components
import vueBeauty from 'vue-beauty'
Vue.use(vueBeauty)

export default {
  props: ['data', 'saveField'],
  created() {
    _storage.remove('local', 'erp_' + this.saveField)
    let columns = _storage._get('local', 'erp_' + this.saveField)
    if (columns && columns.length > 0) {
      this.$emit('update:data', columns)
    }
  },
  data() {
    return {
      arrayValue: []
    }
  },
  methods: {
    checkGroup(e) {
      const arr = []
      this.data.forEach(element => {
        element.show = true
        if (e.indexOf(element.field) === -1) {
          element.show = false
        }
      })

      _storage.set('local', 'erp_' + this.saveField, this.data)
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.arrayValue = val.filter(el => el.show).map(el => el.field)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
}
</style>
<style lang="scss">
.__customList {
  .ant-popover-inner-content {
    padding: 20px;
  }
  .ant-popover-placement-bottomRight {
    width: 200px;
  }
  .ant-checkbox-group-item {
    margin-bottom: 8px;
  }
}
</style>
