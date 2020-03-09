<template>
    <div style='width:50%;min-width:450px;margin-top:20px;padding-bottom:10px;'>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="排除品牌" name="1">
                <el-input
                    type="textarea"
                    :rows="25"
                    placeholder="请输入内容"
                    v-model="brands">
                </el-input>
            </el-tab-pane>
            <el-tab-pane label="排除SKU" name="2">
                <el-input
                    type="textarea"
                    :rows="25"
                    placeholder="请输入内容"
                    v-model="asins">
                </el-input>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeName : '1',
            brands: null,
            asins : null,
        };
    },
    methods: {
        saveBtn(){
            let brands = this.brands ? brands.split('\n').map(i => i.trim()).filter( i => i!=='' ) : []
            let asins = this.asins ? asins.split('\n').map(i => i.trim()).filter( i => i!=='' ) : []
            return { brands,asins }
        }
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>
