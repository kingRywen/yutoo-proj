<template>
    <transition name="el-fade-in">
        <div class="UniversalLayout" v-show="show">
            <!--  -->
            <slot>
                <header class="search">
                    <slot name="search"></slot>
                </header>
                <!--  -->
                <section class="allbtn">
                    <slot name="allbtn">
                        <div class="btnList" v-if="btnList.length">
                            <template v-for="(i,index) in btnList">
                                <!--  -->
                                <template v-if="!i.hidden">
                                    <el-button
                                        class="margin10"
                                        style="margin-left:0"
                                        :size="i.size || 'small'"
                                        :type="i.type || 'primary'"
                                        :key="index"
                                        :icon="i.icon || null"
                                        :disabled="typeof i.disabled === 'function' ? !!i.disabled() : i.disabled"
                                        v-if="!i.hasOwnProperty('children')"
                                        @click="i.fn && i.fn(i.name)"
                                    >
                                        {{i.name}}
                                        <i v-if="i.turn || false" class="el-icon-refresh el-icon--right" :class="{inconTurn: i.turnFlag}"></i>
                                    </el-button>
                                    <!-- 按鈕点击否有选项 -->
                                    <el-dropdown class="margin10" :key="index" v-if="i.hasOwnProperty('children') && i.children.length" @command="clickBtn">
                                        <el-button :type="i.type || 'primary'" :size="i.size || 'small'">
                                            {{i.name}}
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item v-for="(j) in i.children" :command="j.name" :key="j.name">{{j.name}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
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
                <section v-if="pagination" class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[10,30,60,80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </section>
            </slot>
            <!--  -->
        </div>
    </transition>
</template>

<script>
export default {
    name: 'UniversalLayout',
    props: {
        pagination: {
            type: Boolean,
            default: true
        },
        pageNo: Number,
        pageSize: Number,
        total: Number,
        btnList: {
            type: Array,
            default: () => [
                // {
                //     name:"添加",
                //     value:'点击的是添加',
                //     size:'small',
                //     type:'primary'
                // },
                // {
                //     name:"批量修改",
                //     value:'点击的是批量修改',
                //     type:'success',
                //     children:[
                //         {
                //             name:"修改运输方式",
                //             value:'修改运输方式',
                //         },
                //         {
                //             name:"修改延迟发货原因",
                //             value:'修改延迟发货原因',
                //
                //         }
                //     ]
                // }
            ]
        }
    },
    data() {
        return {
            show: false
        };
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('handleSizeChange', val);
        },
        handleCurrentChange(val) {
            this.$emit('handleCurrentChange', val);
        },
        clickBtn(value) {
            this.$emit('clickBtn', value);
            // if (name) {
            //   this.$emit(name, value)
            // }
        }
    },
    mounted() {
        this.show = true;
    }
};
</script>

<style lang="scss" >
.pad10 {
    padding: 10px;
}
.margin10 {
    margin-right: 10px;
}
.inconTurn {
    animation: truns 2s linear infinite;
}
@keyframes truns {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
$bgcolor: rgba(242, 242, 242, 1);

.UniversalLayout {
    @extend .pad10;
    position: absolute;
    // box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding: 16px;
    .search {
        @extend .pad10;
        background: $bgcolor;
        border-radius: 5px;
    }
    .allbtn {
        margin: 10px 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .pagination {
        text-align: right;
        margin-top: 10px;
        // position: absolute;
        // bottom: 10px;
        // left: 0;
        // right: 0;
    }
}
</style>
