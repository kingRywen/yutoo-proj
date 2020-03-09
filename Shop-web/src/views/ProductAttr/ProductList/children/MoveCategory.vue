<template>
  <yt-form ref="form" label-width="100px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      formData: {},
      options: [],
      activeFields: [
        {
          label: '类目',
          // name: 'productCategoryGetCategory',
          name: 'pcId',
          span: 24,
          placeholder: '请选择类目',
          every: true,
          options: [],
          bind: {
            label: 'name',
            value: 'cateId',
            children: 'childList',
            enabled: 'enabled'
          },
          type: 'cascader',
          required: true,
          width:'280px'
        }
      ]
    }
  },
  methods: {
    _initData() {
      this.getTree()
    },
    getTree() {
      const params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        cateId: this.params.cateId,
        platformId: this.platformId
      }
      this.$api[`taskSelAttrListCategoryMoved`](params)
        .then(data => {
          // this.options = data.data
          this.activeFields[0].options = data.data
        })
        .catch(() => {})
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { platformId, sellerId, siteId } = this.sellerData
        let { parentAsins } = this.params
        let options = this.activeFields[0].options, current
        let {pcId} = this.formData
        pcId = pcId.slice(0).pop()
        let el = this.findItem(options, pcId)
        console.log(el);
        const {cateId, cateFlag} = el
        
        // let { cateId, cateFlag } = this.formData
        let params = {
          platformId,
          sellerId,
          siteId,
          cateId,
          cateFlag,
          parentAsins
        }
        return this.$api[`selAttrProductMoveCategory`](params)
      })
    },
    findItem(list, id) {
      list.forEach(el => {
        if (el.cateId === id) {
          this.findItem.el = el
          return false
        } else {
          if (el.childList) {
            this.findItem(el.childList, id)
          }
        }
      })
      return this.findItem.el
    }
  }
}
</script>

<style>
</style>
