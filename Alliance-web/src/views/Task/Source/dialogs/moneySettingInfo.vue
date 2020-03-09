<template>
  <div v-loading="$store.state.isloading">
    <WidgetCardWrapper v-if="isAmazon" :isCollapse="false" :defaultHide="false" style="margin: 0 0 20px 0" title="买家偏好">
      <new-form ref="form1" :form-schema="formSchema1" style="margin-right:20px" label-width="100px" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" style="margin: 0 0 20px 0" title="任务类型">
      <new-form ref="form2" :form-schema="formSchema2" style="margin-right:20px" label-width="140px" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" style="margin: 0 0 20px 0" title="关联操作">
      <new-form ref="form3" :form-schema="formSchema3" style="margin-right:20px" label-width="70px" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" style="margin: 0 0 20px 0" title="Review内容">
      <new-form ref="form4" :form-schema="formSchema4" style="margin-right:20px" label-width="100px" :value="value1"></new-form>
    </WidgetCardWrapper>
  </div>
</template>
<script>
export default {
  props: ['code'],
  data() {
    return {
      formSchema2: {
        freeReview: {
          label: '免评购买',
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          tip: {
            content: this.isAmazon ? '仅购买、无Review评价' : '仅购买，无评价'
          },
          required: true
        },
        reviewBuy: {
          label: '带评购买',
          innerTips: '/单',
          hidden: () => this.isAmazon,
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          tip: {
            content: this.isAmazon ? '仅购买、无Review评价' : '购买+评价'
          },
          required: true
        },
        wordReview: {
          label: '文字评价',
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          hidden: () => !this.isAmazon,
          tip: {
            content: '购买+文字Reveiw评价'
          },
          required: true
        },
        imgReview: {
          label: '图片评价',
          hidden: () => !this.isAmazon,
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          tip: {
            content: '购买+图片Reveiw评价'
          },
          required: true
        },
        addCart: {
          label: '加购物车',
          hidden: () => !this.isAmazon,
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          required: true
        },
        addWishlist: {
          label: '加Wishlist',
          hidden: () => !this.isAmazon,
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          required: true
        },
        qa: {
          label: '发布QA',
          hidden: () => !this.isAmazon,
          innerTips: '/条',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          required: true
        },
        helpful: {
          label: '评价点Helpful',
          hidden: () => !this.isAmazon,
          innerTips: '/条',
          tipClass: ['custom10'],
          span: 12,
          tip: {
            content: '条数=任务数量*评价数量'
          },
          widget: 'currency',
          required: true
        }
      },
      formSchema3: {
        relScan: {
          label: '浏览',
          innerTips: '/单',
          tipClass: ['custom10'],
          span: 12,
          widget: 'currency',
          required: true
        },
        relAddCat: {
          label: '加购',
          span: 12,
          widget: 'currency',
          hidden: () => !this.isAmazon,
          innerTips: '/单',
          tipClass: ['custom10'],
          required: true
        },
        relBuy: {
          label: '购买',
          span: 12,
          widget: 'currency',
          innerTips: '/单',
          tipClass: ['custom10'],
          required: true
        }
      },
      formSchema1: {
        buyerSex: {
          label: '买家性别',
          widget: 'currency',
          span: 12,
          // innerTips: '/单',
          tipClass: ['custom10'],
          required: true
        },
        age: {
          label: '年龄段',
          // innerTips: '/单',
          tipClass: ['custom10'],
          widget: 'currency',
          span: 12,
          required: true
        },
        primeMemberFlag: {
          label: 'Prime会员',
          // innerTips: '/单',
          tipClass: ['custom10'],
          widget: 'currency',
          span: 12,
          required: true
        }
      },
      formSchema4: {
        reviewSupplyType: {
          span: 12,
          label: '评价内容',
          innerTips: '/条',
          tipClass: ['custom10'],
          widget: 'currency',
          required: true
        },
        reviewTimeType: {
          span: 12,
          label: '人工索评',
          innerTips: '/单',
          tipClass: ['custom10'],
          widget: 'currency',
          required: true
        }
      },
      value1: {}
    }
  },
  computed: {
    isAmazon() {
      return this.code === 'amazon'
    }
  },
  created() {
    this.getBroke()
  },
  methods: {
    getBroke() {
      this.$api[`main/taskSourceBrokerage`]({ platformCode: this.code }).then(
        data => {
          this.value1 = data.rows
        }
      )
    },
    _submit() {
      let vm = this
      let forms = ['form2', 'form3', 'form4']
      if (this.isAmazon) {
        forms.unshift('form1')
      }
      return Promise.all(forms.map(el => this.$refs[`${el}`].validate())).then(
        () => {
          const promises = [
            vm.$api[`main/taskSourceBrokerageUpdate`](vm.value1)
          ]
          return Promise.all(promises).then(() => {
            return Promise.resolve(true)
          })
        }
      )
    }
  }
}
</script>