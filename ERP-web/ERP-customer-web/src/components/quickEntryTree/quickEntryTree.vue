<template lang="html">
    <div class="treebox">
        <h3>
            产品类目
            <el-button type="text" icon="el-icon-d-arrow-right" class="treeBtn" @click="hide()"></el-button>
        </h3>

        <el-tree
            class="tree"
            :data="data"
            :highlight-current= 'true'
            node-key="id"
            @node-click="nodeClick"
            :default-expanded-keys="[99]"
            :default-checked-keys="[5]"
            :props="defaultProps">
        </el-tree>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>[]
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'childs',
                label: 'name'
            }
        };
    },
    methods:{
        hide(){
            this.$emit('hide')
        },
        nodeClick(item,node){
            console.log(item,node)
            if(!item.hasOwnProperty('id')){
                let listCount = {
                    "keyId":item.keyId,
                    "countState":item.countState
                }
                this.$emit('nodeClick',listCount)
            }

        }
    }
};
</script>

<style lang="scss">
    .treebox{
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0,0.3);
        h3{
            background: #108ee9;
            height: 30px;
            line-height: 30px;
            color: #fff;
            font-size: 15px;
            position: relative;
            .treeBtn{
                height: 30px;
                i{
                    font-size: 22px;
                    color: #fff;
                }
                position: absolute;
                right: 10px;
                top: -8px;
            }
        }
        .tree{
            margin-top: 50px;
            border-top: 1px solid #e6e6e6;
            padding-left: 10px;
            flex:1;
            .el-tree-node__content{
                height: 38px!important;
                letter-spacing: 1px;
            }
        }
    }

</style>
