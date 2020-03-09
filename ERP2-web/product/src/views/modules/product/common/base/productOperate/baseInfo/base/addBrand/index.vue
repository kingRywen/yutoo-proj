<template>
  <div class="add-brand">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="form"
      label-width="120px"
      :form-schema="dataFormSchema"
    ></new-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDirty: false,
      form: {
        brandNameEn: null,
        brandNameCn: null,
        inchargeUserId: null,
        brandType: null,
        brandLogo: null,
        categoryLinkAddress: null,
        pageTitle: null,
        pageMateKeyword: null,
        pageMateDesc: null,
        pageTemplate: null,
        brandDetailDesc: null,
        remark: null,
        sort: null,
        activateFlag: null
      },
      dataFormSchema: {
        brandNameEn: {
          label: "英文品牌名称",
          required: true
        },
        brandNameCn: {
          label: "中文品牌名称",
          required: true
        },
        inchargeUserId: {
          label: "品牌负责人",
          widget: "select",
          options: [],
          required: true
        },
        brandType: {
          label: "品牌类型",
          widget: "select",
          options: [],
          required: true
        },
        brandLogo: {
          label: "品牌LOGO",
          widget: "upload",
          action: "https://jsonplaceholder.typicode.com/posts/",
          fileLimit: ["image"],
          required: true,
          limit: 1
        },
        categoryLinkAddress: {
          label: "类别链接地址"
        },
        pageTitle: {
          label: "页面标题"
        },
        pageMateKeyword: {
          label: "页面mate关键词",
          widget: "textarea"
        },
        pageMateDesc: {
          label: "页面mate描述",
          widget: "textarea"
        },
        pageTemplate: {
          label: "类别使用的页面模板"
        },
        brandDetailDesc: {
          label: "品牌详细描述",
          widget: "textarea"
        },
        remark: {
          label: "备注",
          widget: "textarea"
        },
        sort: {
          label: "排序"
        },
        activateFlag: {
          label: "是否激活",
          widget: "switch"
        }
      }
    };
  },
  created() {
    let vm = this;
    // 品牌负责任
    vm.$api[`product/SMpermissionUserList`]({}).then(({ rows }) => {
      rows.forEach(item => {
        if (item.type == "ALL") {
          vm.dataFormSchema.inchargeUserId.options = item.users.map(i => {
            return {
              label: i.userName,
              value: +i.userId
            };
          });
        }
      });
    });
    // 品牌类型
    vm.$api[`product/constantBrandType`]({}).then(({ rows }) => {
      vm.dataFormSchema.brandType.options = rows.map(i => {
        return {
          label: i.name,
          value: +i.id
        };
      });
    });
  },
  methods: {
    edit(params) {
      console.log(params);
    },
    submit() {
      let vm = this;
      let params = vm.utils.clone(vm.form);
      if (vm.utils.isArrLength(params.brandLogo)) {
        params.brandLogo = params.brandLogo[0].url;
      }
      return {
        url: "product/glBrandSave",
        params
      };
    }
  }
};
</script>

<style lang='scss'>
.add-brand {
  background: #fff;
}
</style>