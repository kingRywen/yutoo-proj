<template lang="html">
    <!-- 批量设置产品状态 -->
    <el-form :model="form"  ref="form" label-width="120px">
        <el-form-item label="选择产品状态：">
            <el-select v-model="form.state" placeholder="请选择活动区域" style="width:100%;">
                <el-option label="正常" value="1"/>
                <el-option label="仅批量" value="2"/>
                <el-option label="暂时缺货" value="3"/>
                <el-option label="停产" value="4"/>
                <el-option label="锁定" value="5"/>
                <el-option label="清库" value="6"/>
            </el-select>
        </el-form-item>
        <el-form-item label="备注：">
            <el-input type="textarea" v-model.trim="form.remark" class="textarea"/>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            form:{
                state:"1",
                remark:null
            }
        };
    },
    methods:{
        submitForm(callback){
            callback && callback(this.form)
        },
        resetForm(){
            this.form.state = "1"
            this.form.remark = null
        }
    }
}
</script>

<style lang="scss">

</style>
