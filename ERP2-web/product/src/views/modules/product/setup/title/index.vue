<template>
    <div style='position:relative;'>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="标题规则" name="1">
                <SuTitleRule />
            </el-tab-pane>
            <el-tab-pane label="标题词库" name="2" :lazy='true'>
                <TitileRule  :languageId='value' />
            </el-tab-pane>
        </el-tabs>
        <div class='select' v-if="activeName === '2'">
            <el-select v-model="value" placeholder="请选择" size='small'>
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
export default {
    components:{
		SuTitleRule:()=>import('./SuTitleRule/index'),
        TitileRule:()=>import('./TitileRule/index')
    },
    data() {
        return {
            activeName:'1',
            value:'',
            options:[]
        };
    },
    methods: {
        getLanguge(){
            this.$api[`product/TITGlLanguageList`](
                {}
            )
            .then((data) => {
                let {row} = data
                //console.log(data);
                this.options = row.map(i=>{
                    return {label: i.name, value:i.id}
                })
                this.value = this.options[0].value 
            })

        }
    },
    created() {
        this.getLanguge()
    },
};
</script>

<style scoped lang="scss">
.select{
    position: absolute;
    top:10px;
    right:0;
}
</style>
