<template lang="html">
    <el-form :inline="true" :model="searchForm" class="searchForm">

        <!-- <el-form-item label="活动区域">
          <el-select v-model="searchForm.region" placeholder="活动区域" size="small">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
        <!--  -->
        <template v-for="(item,index) in searchList">
            <el-form-item :label="item.label || null" :key='index'>
                <!-- 输入款 -->
                <el-input
                    v-if="item.type == 'input'"
                    v-model.trim="searchForm[item.value]"
                    :placeholder="item.placeholder || null"
                    :clearable="item.clearable ||true"
                    :style="item.style || ''"
                    :size="item.size || 'small'">
                </el-input>
                <!-- 单选款 -->
                <el-select
                    v-if="item.type == 'select'"
                    v-model="searchForm[item.value]"
                    :placeholder="item.placeholder || null"
                    :clearable="item.clearable ||true"
                    :size="item.size || 'small'">
                        <el-option
                            :disabled="j.disabled || false"
                            :label="j.label"
                            :value="j.value"
                            :key="jindex"
                            v-for="(j,jindex) in item.children">
                        </el-option>
                </el-select>

                <!-- 时间 -->

                <!-- 多选款 -->

            </el-form-item>
        </template>
        <!--  -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">搜 索</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name:"YtSearch",
    props:{
        searchList:{
            type:Array,
            default:()=>[
                {
                    label:'SKU',               //输入款名称
                    value:'skuname',           //需要绑定的值  ==>必传
                    type:'input',              //输入款类型    ==>必传
                    placeholder:'请输入什么鬼', //输入款提示文字
                    size:'small',              //输入款大小，默认small
                    clearable:true,            //默认可清除
                    style:{                    //输入款样式
                        width:"120px",
                    }
                },
                {
                   label:'发货人员',
                   value:'nameId',
                   type:'select',
                   children:[                   //下拉款
                        {
                           label:'发货人员一',
                           value:'18',
                           // disabled:true     //默认不禁用false，可不传
                       },
                       {
                          label:'发货人员二',
                          value:'20',
                       }
                   ]
                },
                {
                    
                }
            ]
        }
    },
    data(){
        return {
            searchForm:{}
        }
    },
    methods:{
        onSubmit(){
            console.log(this.searchForm)
        }
    }
}
</script>

<style lang="scss">
    .searchForm{
        .el-form-item{
            margin-bottom: 0px;
        }
    }
</style>
