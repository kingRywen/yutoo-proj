<template>
  <div class="add-warehose">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.wmName" prop="wmName" label="仓库名称:"></t-form-item>
      <t-form-item
        :value.sync="form.warehouseType"
        :list="warehouseTypeList"
        type="select"
        prop="warehouseType"
        label="仓库类型:"
      ></t-form-item>
      <t-form-item :value.sync="form.country" prop="country" label="仓库编码:"></t-form-item>
      <t-form-item type="custom" label="所在国家:">
        <t-form-item
          :value.sync="form.province"
          :list="provinceList"
          type="select"
          prop="province"
          placeholder="省"
        ></t-form-item>
        <t-form-item
          :value.sync="form.city"
          :list="cityList"
          type="select"
          prop="city"
          placeholder="市"
        ></t-form-item>
        <t-form-item
          :value.sync="form.area"
          :list="areaList"
          type="select"
          prop="area"
          placeholder="区"
        ></t-form-item>
      </t-form-item>
      <t-form-item :value.sync="form.streetAddress" prop="streetAddress" label="街道地址:"></t-form-item>
      <t-form-item :value.sync="form.zipCode" prop="zipCode" label="邮编:"></t-form-item>
      <t-form-item :value.sync="form.contactName" prop="contactName" label="联系人:"></t-form-item>
      <t-form-item :value.sync="form.contactPhone" prop="contactPhone" label="联系电话:"></t-form-item>
      <t-form-item :value.sync="form.contactEmail" prop="contactEmail" label="联系邮箱:"></t-form-item>
      <t-form-item :value.sync="form.shippingAddress" prop="shippingAddress" label="发货联系地址:"></t-form-item>
      <t-form-item :value.sync="form.shippingPhone" prop="shippingPhone" label="发货联系电话:"></t-form-item>
      <t-form-item :value.sync="form.activatedFlag" prop="activatedFlag" type="check" label="是否激活:"></t-form-item>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this;
    return {
      form: {
        activatedFlag: 0
      },
      rules: vm.$formValidate([
        {
          label: "仓库名称",
          value: "wmName"
        },
        {
          label: "仓库类型",
          value: "warehouseType"
        }
      ]),
      list: [],
      warehouseTypeList: [],
      provinceList: [],
      cityList: [],
      areaList: []
    };
  },
  watch: {
    "form.province"(val) {
      let vm = this;
      if (!vm.utils.isEmpty(val)) {
        vm.getArea(val, "cityList");
      }
    },
    "form.city"(val) {
      let vm = this;
      if (!vm.utils.isEmpty(val)) {
        vm.getArea(val, "areaList");
      }
    }
  },
  created() {
    let vm = this;
    vm.$api[`product/constantWarehouseType`]({}).then(({ rows }) => {
      this.warehouseTypeList = rows.map(item => {
        return {
          label: item.name,
          value: item.id
        };
      });
    });
    this.getArea(17, "provinceList");
  },
  methods: {
    edit(params) {
      console.log(params);
    },
    getArea(id, options) {
      return this.$api[`product/purchaseGlAreaGetChild`]({
        parentAreaId: id
      }).then(data => {
        let { rows } = data;
        this[options] = rows.map(i => {
          return {
            label: i.name,
            value: i.id
          };
        });
      });
    },
    submit() {
      let vm = this;
      console.log(3443);
      return {
        url: "product/glWarehouseSave",
        params: vm.form
      };
    }
  }
};
</script>

<style lang='scss'>
.add-warehose {
  background: #fff;
}
</style>