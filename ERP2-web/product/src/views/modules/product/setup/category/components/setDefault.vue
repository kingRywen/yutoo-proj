<template>
    <new-form style="margin-right: 100px" v-if="show" label-width="250px" :key="propertyId" v-model="value" ref="form" :form-schema="formSchema"></new-form>
</template>
<script>
import FormInputs from 'Components/NewForm/form-inputs.vue';
import { setForm } from '@/views/modules/product/amazon/utils.js';

export default {
    components: { FormInputs },
    data() {
        return {
            //
            show: true,
            value: {},
            formSchema: {
                item: {}
            },
            propertyId: null
        };
    },
    methods: {
        init(item) {
            console.log(item);
            
            this.propertyId = item.propertyId;
            let fieldTypeList = [
                { label: 9, value: 1 },
                { label: 1, value: 2 },
                { label: 1, value: 3 },
                { label: 6, value: 4 },
                { label: 10, value: 5 },
                { label: 5, value: 6 },
                { label: 2, value: 7 },
                { label: 3, value: 8 },
                { label: 11, value: 9 },
                { label: 7, value: 10 },
                { label: 4, value: 11 },
                { label: 8, value: 12 }
            ];
            let obj = setForm({
                controlType: fieldTypeList.find(i => i.value == item.fieldType)
                    .label,
                controlValue: item.controlValue,
                dataType: item.fieldType == 2 ? 1 : item.fieldType == 3 ? 5 : 2,
                decimalPlaces: item.decimalPlaces,
                propertyDesc: item.propertyDesc,
                propertyNameEn: item.propertyNameCn,
                required: item.mustFlag ? true : false,
            },24);
            this.formSchema.item = obj;
            this.formSchema = {...this.formSchema}
        },
        submitForm(cb) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    cb && cb(this.value, this.propertyId);
                }
            });
        }
    }
};
</script>