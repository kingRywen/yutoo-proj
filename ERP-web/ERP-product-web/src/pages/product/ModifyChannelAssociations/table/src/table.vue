<template lang="html">
    <el-table :data="data" :border="border" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <slot name="left"></slot>
        <!--  -->
        <el-table-column v-for="(item,index) in columns" :key="item.value"  :width="item.width" :label="item.label" align="center">
            <template slot-scope="scope">
                <!-- 图片 -->
                <el-tooltip  v-if="item['img']" effect="light" placement="right">
                    <div slot="content">
                        <img :src="scope.row[item.value]" width="auto" :height="item.bulkyHeight || 180">
                    </div>
                    <img :src="scope.row[item.value]" :width="item.style.width || 80" :height="item.style.height || 80">
                </el-tooltip>
                <!-- 链接 -->
                <a v-else-if="item['url']" :href="scope.row[item.url]" target="_blank" :style="item.style ||''">{{scope.row[item.value]}}</a>
                <!-- 多个 -->
                <template  v-else-if="item['children']" v-for="j in scope.row[item.children]">
                    <p :style="item.style ||''">{{j[item.value]}}</p>
                </template>
                <!-- 普通 -->
                <p v-else :style="item.style ||''">{{scope.row[item.value]}}</p>
            </template>
        </el-table-column>
        <!--  -->
        <slot name="right"></slot>
    </el-table>
</template>

<script>
export default {
    name:"YtTable",
    props:{
        data:{
            type:Array,
            default:()=>[]
        },
        columns:{
            type:Array,
            default:()=>[]
        },



        border:{
            type:Boolean,
            default:false,
        },

    },
    data(){
        return {

        }
    },
    methods:{
        handleSelectionChange(val){
            console.log(val)
            this.$emit('handleSelectionChange',val)
        }
    }
}
</script>

<style lang="scss">

</style>
