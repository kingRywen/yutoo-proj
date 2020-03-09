<template>
  <div>
    <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      formData: {},
      activeFields: [
        {
          label: "商户编号",
          name: "merchantNo",
          span: 8,
          // disabled: true,
          required: true
        },
        {
          label: '类目',
          name: 'categoryId',
          span: 24,
          placeholder: '请选择类目',
          options: vm.loadTree,
          bind: {
            label: 'name',
            value: 'pcid',
            children: 'childs',
            enabled: 'enabled'
          },
          type: 'cascader',
          last: true,
          required: true,
          hidden(data) {
            return data.dataType === 2
          }
        },
        {
          label: "商户名称",
          name: "merchantName",
          disabled: data => {
            return data.merchantNo !== "" && data.merchantNo != null;
          },
          span: 8,
          required: true
        },
        {
          label: "登陆账号",
          name: "username",
          span: 8,
          required: true
        },
        {
          label: "有效天数",
          name: "effectiveTime",
          span: 24,
          type: "number",
          min: 1,
          required: true
        },
        {
          label: "ASIN",
          name: "effectiveTime1",
          span: 24,
          rows: 5,
          type: "textarea",
          required: "asin",
          /**
           * case 'email':
                rules[el.name].push(this.valids.beEmail)
                break
              case 'number':
                rules[el.name].push(this.valids.number)
                break
              case 'mobile':
                rules[el.name].push(this.valids.mobile)
                break
              case 'post':
                rules[el.name].push(this.valids.post)
                break
              case 'asin':
                rules[el.name].push(this.getValidator('asin'))
                break
              case 'multiUrl':
                rules[el.name].push(this.getValidator('multiUrl'))
           */
          hidden: data => {
            return data.effectiveTime;
          }
        },
        {
          label: "关键词",
          name: "keyword",
          span: 24,
          rows: 5,
          type: "textarea",
          required: "keyword",
        }
      ]
    };
  },
  methods: {
    loadTree(id = [0], selEl, itemDisabled) {
      if (!selEl) {
        selEl = {
          pcid: 0
        }
      }
      let { pcid } = selEl
      let params = {
        parentPcid:pcid,
        siteId: this.siteId,
        platformId: this.platformId
      }
      return this.$api[`productCategoryGetCategory`](params)
        .then(data => {
          if (data && data.code && data.code !== 0) {
            this.$message.error(data.msg)
            return
          }

          return data.data.map(el => {
            return {
              ...el,
              childs: el.haveChildren ? [] : null,
              enabled: true,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {})
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`url`](params).then(res => "reset"); // 关闭弹重置并刷新
        return this.$api[`url`](params).then(res => false); // 不关闭弹窗
        return this.$api[`url`](params); // 关闭弹窗刷新
      });
    }
  }
};
</script>

<style>
</style>
