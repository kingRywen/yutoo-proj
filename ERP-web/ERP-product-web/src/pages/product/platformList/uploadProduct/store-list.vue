<template lang="html">
    <el-dialog  :title="title"  :visible.sync="_dialog"  width="30%"  center :modal-append-to-body="false">
        <el-input placeholder="输入店铺名称" size="medium" v-model.trim="storeName">
            <el-button slot="append" icon="el-icon-search" @click="select"></el-button>
        </el-input>
        <el-checkbox-group v-model="checkShopArr" class="check_warp">
            <el-checkbox v-for="item in data" :label="item">{{item.storeName}}</el-checkbox>
        </el-checkbox-group>
        <el-button class="submitBtn" slot="footer" type="primary" size="medium" @click="submit">确 认</el-button>
    </el-dialog>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:"选择店铺"
        },
        changeDialogStatus:Function,
        dialog:{
            type:Boolean,
            default:false
        },
        data:{
           type:Array,
           default:()=>[]
        },
        selectedStore:Function
    },
    computed:{
        _dialog:{
            get() {
                return this.dialog
            },
            set(val){
                this.changeDialogStatus(val)
            }
        }
    },
    data() {
        return {
            checkShopArr:[],
            storeName:null,
        }
    },
    methods:{
        submit(){
            this.$emit("onSelectStore",this.checkShopArr)
        },
        select(){
            this.$emit("onSeekStore",this.storeName)
        }
    }
}
</script>

<style lang="scss">
    .check_warp {
        height: 270px;
        overflow-y: auto;
        margin-top: 15px;
        border: 1px dashed #ccc;
        padding: 10px;
        .el-checkbox {
            margin: 0 0 10px;
            padding: 12px 15px 8px 0px;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            background: #f2f2f2;
            border-radius: 3px;
            .el-checkbox__label {
                padding-left: 20px;
            }
        }
    }
    .submitBtn{
        width: 40%;
    }
</style>
