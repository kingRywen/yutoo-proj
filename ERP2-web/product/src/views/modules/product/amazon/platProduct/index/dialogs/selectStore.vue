<template>
  <div>
    <div class="__search mar10">
      <ElInput v-model.trim="storeName" size="small" placeholder="输入店铺名称" clearable @click="handleSearch"></ElInput>
      <ElButton type="primary" class="ml10" size="small" @click="handleSearch">搜索</ElButton>
    </div>
    <ul :class="['store-list', {'is-error': notSelect}]">
      <li v-for="(item, index) in storeList" :key="index" @click="handleSelect(item)">
        <span>{{item.name}}</span>
        <i class="el-icon-check" v-if="item.selected"></i>
      </li>
    </ul>
    <div v-if="selected.length" class="selected mar10">已选店铺：{{selected.map(el => el.name).join('； ')}}</div>
  </div>
</template>
<script>
export default {
  props: ['platSiteId', 'productPlatId'],
  data() {
    return {
      storeName: '',
      notSelect: false,
      // 预上架的所有店铺
      storeList: []
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      let params = {productPlatId: this.productPlatId, platSiteId: this.platSiteId, storeName: this.storeName}
      this.$api[`product/platProductSelectStore`](params)
      .then((data) => {
        this.storeList = data.rows.map(el => ({name: el.storeName, id: el.storeId}))
      })
    },
    handleSelect(item) {
      this.$set(item, 'selected', !item.selected)
    },
    valid() {
      let notSelect = !this.selected.length
      this.notSelect = notSelect
      return notSelect
    },
    _submit() {
      if (this.valid()) {
        return Promise.reject('请选择预上架店铺')
      }
      const { platSiteId, productPlatId } = this
      const params = { platSiteId, productPlatId, storeIds: this.selectedId }
      return this.$api[`product/prProductPlatAmzReadyShelfSeller`](params)
    }
  },
  computed: {
    selected() {
      return this.storeList.filter(el => el.selected)
    },
    selectedId() {
      return this.selected.map(el => el.id)
    }
  },
  watch: {
    selected(val) {
      this.notSelect = !val.length
    }
  }
}
</script>
<style lang="scss" scoped>
.__search {
  display: flex;
  justify-content: space-between;
}
.store-list {
  margin-top: 10px;
  border: 1px solid transparent;
  &.is-error {
    border-color: red;
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background-color: #f3f3f3;
    margin: 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    line-height: 16px;
    i {
      font-size: 16px;
    }
  }
}
</style>