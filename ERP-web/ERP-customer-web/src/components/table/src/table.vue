<template lang="html">
<el-form :model="formModel" ref="form">
    <el-table ref="table" :data="data" :border="border" style="width: 100%" :row-key="reserveSelection" @selection-change="handleSelectionChange" :height="height" :max-height="maxHeight" @ :size="size" :header-cell-class-name="cellClassNameFunc" :cell-class-name="cellClassNameFunc">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="!!reserveSelection" v-if="selection"></el-table-column>
        <slot name="left"></slot>
        <slot></slot>
        
        <!--/* eslint-disable */  -->
        <el-table-column v-for="(item) in columns" :key="item.id"  :width="item.width" :label="item.label" :show-overflow-tooltip="item.showTooltip == false ? false : true" :data-value="item.value" align="center">
            <template slot-scope="scope">
                <!-- 图片 -->
                <el-tooltip  v-if="item['img']" effect="light" placement="right">
                    <div slot="content">
                        <img :src="scope.row[item.value]" width="auto" :height="item.bulkyHeight || 180">                        
                    </div>
                    <el-badge v-if="item.badge" :value="item.badge(scope)" style='z-index:999;margin-top:10px;margin-right: 10px;'>
                        <img :src="scope.row[item.value]" :width="item.style.width || 80" :height="item.style.height || 80">
                    </el-badge>
                    <img v-if='item.style' :src="scope.row[item.value]" :width="item.style.width " :height="item.style.height">
                    <!-- // eslint-disable-next-line -->
                    <img v-else :src="scope.row[item.value]" width="49" height="49">                    
                </el-tooltip>
                <!-- 链接 -->
                <a v-else-if="item['url']" :href="scope.row[item.url]" target="_blank" :style="item.style ||''">{{scope.row[item.value]}}</a>
                <!-- 多个 -->
                <!-- // eslint-disable-next-line -->
                <template  v-else-if="item['children']" v-for="j in scope.row[item.children]">
                  <!-- // eslint-disable-next-line -->
                    <p :style="item.style ||''" v-if="item.value" :key="j.id">{{j[item.value]}}</p>
                    <p :style="item.style ||''" v-else :key="j.id"><b>{{j[item.prop.key]}}:</b>{{j[item.prop.value]}}</p>
                </template>
                <!-- 多个属性合并显示 -->
                <template v-else-if="item['multi']">
    <!-- // eslint-disable-next-line -->
    <p :style="item.style ||''" v-for="i in item['multi']" :key="i.id">
        <span v-if="typeof i === 'object'">{{i.label}}: {{typeof i.value === 'function' ? i.value(scope) : scope.row[i.value]}}</span>
        <span v-else>{{scope.row[i]}}</span>
    </p>
</template>
                <!--  -->

                <!-- 普通 -->
                <p v-else :style="item.style ||{height: '54px','line-height': '54px'}">
                  <table-colvalue :item="item" :scope="scope" />
                  <!-- {{getVal(item, scope)}} --></p>
            </template>
        </el-table-column>
        <!--  -->
        <slot name="right"></slot>
    </el-table>
    </el-form>
</template>

<script>
import Vue from 'vue';

Vue.component('table-colvalue', {
    props: ['item', 'scope'],
    render(h) {
        if (this.item.formatter && typeof this.item.formatter === 'function') {
            return <span>{this.item.formatter(this.scope, this.item)}</span>;
        } else if (this.item.render && typeof this.item.render === 'function') {
            return this.item.render(h, this.scope, this);
        } else {
            return (
                <span>
                    {this.scope.row[this.item.value] === null ||
                    this.scope.row[this.item.value] === '' ||
                    this.scope.row[this.item.value] === undefined
                        ? '-'
                        : this.scope.row[this.item.value]}
                </span>
            );
        }
    }
});

export default {
    name: 'YtTable',
    data() {
        return {
            // formModel: {},
            name: null
        };
    },

    props: {
        cellClassNameFunc: {
            type: Function,
            default: () => {}
        },
        reserveSelection: {
            type: String,
            default: 'id'
        },
        showTooltip: {
            type: Boolean,
            default: () => {
                return true;
            }
        },
        selected: {
            type: Array,
            default: () => []
        },
        rowKey: {
            type: String,
            default: 'skuStore'
        },
        formModel: {
            type: Object,
            default: () => {}
        },

        size: {
            type: String,
            default: 'mini'
        },
        data: {
            type: Array,
            default: () => []
        },
        selection: {
            type: Boolean,
            default: true
        },
        columns: {
            type: Array,
            default: () => [
                //                     children:'arr', //如数组传入的table数据对应Arr
                //                     label: "多个数组",
                //                     value:"a", // 数组里面需要显示的值
                //                     style:{
                //                         color:"red"
                //                     }
                //                 },
                //                 {
                //                     value: "logo", //table需要渲染的值
                //                     label: "LOGO",//表头
                //                     width: "300",//当前行宽度
                //                     img:true,   //如图片传
                //                     style:{     //图片宽高
                //                         width:80,
                //                         height:80
                //                     },
                //                     bulkyHeight:180 //鼠标hover图片高，宽度自动
                //                 },
                //
                //
                //                 {
                //                     value: "name",  //a链接显示的值
                //                     label: "姓名",
                //                     width: "300",
                //                     url:'herf', //如a链接table数据的跳转url
                //                     style:{
                //                         color:'#fff',
                //                         background:'green',
                //                     }
                //                 },
                //                 {
                //                     value: "date",
                //                     label: "时间",
                //                     width: "300"
                //                 },
                //                 {
                //                     value: "address",
                //                     label: "地址",
                //                     width: "300"
                //                 },
            ]
        },

        border: {
            type: Boolean,
            default: false
        },
        height: [String, Number],
        maxHeight: [String, Number]
    },
    watch: {
        selected: {
            immediate: true,
            handler(val) {
                let vm = this;
                val.map(item => {
                    vm.$refs.table.toggleRowSelection(item);
                });
            }
        }
    },
    methods: {
        toggleRowSelection(row) {
            this.$refs.table.toggleRowSelection(row);
        },
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val);
        },
        clearSelection() {
            this.$refs.table.clearSelection();
        }
        // getVal(item, scope) {
        //   if (item.formatter && typeof item.formatter === 'function') {
        //     return item.formatter(scope, item)
        //   } else if (item.render && typeof item.render === 'function') {
        //     getVueComponent(render)
        //   } else {
        //     return scope.row[item.value]
        //   }
        // }
    },
    components: {}
};
</script>

<style lang="scss">
</style>
