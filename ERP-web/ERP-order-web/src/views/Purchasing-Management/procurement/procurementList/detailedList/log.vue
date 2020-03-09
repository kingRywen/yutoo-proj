<template lang="html">
    <!-- 采购单管理操作日志 -->
    <yt-table :data="list" :columns="columns" :border="true" :selection="false"/>
</template>
<script>
export default {
    data() {
        return {
            list: [],
            columns: [
                { value: 'operatorTypeName', label: '操作类型' },
                { value: 'modifyTime', label: '操作时间', width: '150px' },
                { value: 'modifyUserName', label: '操作人员', width: '150px' },
                { value: 'purchaseNumber', label: '单号' },
                { value: 'lowerSingleNumber', label: '下单号' },
                { value: 'pinOrderNumber', label: '销单号' },
                { value: 'logDesc', label: '备注', width: '300px' }
            ]
        }
    },
    methods: {
        getLogList(purchaseNumber) {
            this.$api['procurement/logGetLog']({
                purchaseNumber
            })
                .then(res => {
                    this.list = res.rows
                })
                .catch(err => {
                    this.$message.error(err.msg)
                })
        }
        // submitForm(callback){
        //
        // },
        // resetForm(){
        //
        // }
    }
}
</script>

<style lang="scss">
</style>
