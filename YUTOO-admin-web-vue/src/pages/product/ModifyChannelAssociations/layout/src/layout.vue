<template lang="html">
    <transition name="el-fade-in">
        <div class="YtLayout" v-show="show">
            <!--  -->
            <slot>
                <header class="search">
                    <slot name="search"></slot>
                </header>
                <!--  -->
                <section class="allbtn" v-if="btnList.length">
                    <slot name="allbtn">
                        <div class="btnList">
                            <template v-for="(i,index) in btnList">
                                <!--  -->
                                <el-button
                                    class="mar10"
                                    :size="i.size || 'small'"
                                    :type="i.type || 'primary'"
                                    :key="index"
                                    v-if="!i.hasOwnProperty('children')"
                                    @click="clickBtn(i.value)">{{i.name}}</el-button>
                                <!-- 按鈕点击否有选项 -->
                                <el-dropdown
                                    class="mar10"
                                    v-if="i.hasOwnProperty('children') && i.children.length"
                                    @command="clickBtn">
                                    <el-button :type="i.type || 'primary'" :size="i.size || 'small'">
                                      {{i.name}}
                                      <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(j,jindex) in i.children" :command="j.value">{{j.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </div>
                        <!--  -->
                        <div class="btnRight">
                            <slot name="btnRight"></slot>
                        </div>
                    </slot>
                </section>
                <!--  -->
                <section class="table">
                    <slot name="table"></slot>
                </section>
                <!--  -->
                <section v-if="pagination">
                    <el-pagination
                        class="pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNo"
                        :page-sizes="[20,30,60,80]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </section>
            </slot>
            <!--  -->
        </div>
    </transition>
</template>

<script>
export default {
    name: 'YtLayout',
    props: {
        pagination: {
            type: Boolean,
            default: true
        },
        pageNo: Number,
        pageSize: Number,
        total: Number,
        btnList:{
            type:Array,
            default:()=>[
                {
                    name:"添加",
                    value:'点击的是添加',
                    size:'small',
                    type:'primary'
                },
                {
                    name:"批量修改",
                    value:'点击的是批量修改',
                    children:[
                        {
                            name:"修改运输方式",
                            value:'修改运输方式',
                        },
                        {
                            name:"修改延迟发货原因",
                            value:'修改延迟发货原因',

                        }
                    ]
                },{
                    name:"修改",
                    value:'点击的是修改',
                    type:'success',
                    children:[
                        {
                            name:"修改运输方式",
                            value:'点击的是修改',
                        },
                        {
                            name:"修改延迟发货原因",
                            value:'修改延迟发货原因',
                        }
                    ]
                }
            ]
        }
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(val)
            this.$emit("handleSizeChange", val)
        },
        handleCurrentChange(val) {
            console.log(val)
            this.$emit("handleCurrentChange", val)
        },
        clickBtn(value){
            console.log(value)
            this.$emit("clickBtn",value)
        },
    },
    mounted() {
        this.show = true;
    }

}
</script>

<style lang="scss">
.pad10 {
    padding: 10px;
}
.mar10{
    margin-right: 10px;
}
$bgcolor: rgba(242, 242, 242, 1);

.YtLayout {
    @extend .pad10;
    position: fixed;
    width: 100%;
    height: 100%;
    .search {
        @extend .pad10;
        background: $bgcolor;
        border-radius: 5px;
    }
    .allbtn{
        margin: 10px 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .pagination{
        text-align: center;
        position: absolute;
        bottom: 25px;
        left: 0;
        right: 0;
    }
}
</style>
