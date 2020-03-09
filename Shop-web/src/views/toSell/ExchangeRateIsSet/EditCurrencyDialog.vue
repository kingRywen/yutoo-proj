<template>
    <div>
       <yt-form ref="form"  :fields="activeFields" :formData="formData"></yt-form>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            activeFields:[
                 {
                    label: '兑美元汇率',
                    name: 'exchangeRate',
                    required: true,
                    labelWidth:'90px',
                    span: 24,
                    type:'number'
                },
            ],
            formData:{

            },
        };

    },
    methods: {
        _submit() {
            return this.$refs.form.validate().then(() => {
                let params = { currencies : this.params.currencies};
                params.exchangeRate = this.formData.exchangeRate
                return this.$api[`imSaleExchangeRateUpdate`](params).then(data=>{
                    return  Promise.resolve(true);
                })	  
            });
        },
        _initData(){
            if( this.params.currencies && this.params.currencies.length ===1){
                this.$api['imSaleExchangeRateInfo']({
                    currency :this.params.currencies[0]
                })
                .then(data => {
                    let { exchangeRate } = data.data;
                    this.formData.exchangeRate = exchangeRate;
                }).catch(() => {})
            }
        },
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
