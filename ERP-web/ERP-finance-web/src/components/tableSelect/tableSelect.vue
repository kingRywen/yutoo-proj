<template>
    <div class="tableSelect" :style="size=='small'?{height:'32px'}:{height:'36px'}" v-outside="()=>show=false">
        <div class="table_select_inner" :class="'table_select_'+size" @click="clickSelect" :style="show?{borderColor:'#108ee9'}:{}">
            <div class="select_innerhtml">
                <span class="select_innerhtml_bg" :style="locationName.length?{}:{backgroundColor:'#fff'}">
                    {{locationName[0]}}
                    <span class="el-icon-error clean_up" v-show="locationName.length" @click.stop="cleanUp"></span>
                </span>
                <span class="length" v-show="locationName.length>1">{{'+'+(locationName.length-1)}}</span>
            </div>
            <span class="table_select_suffix">
                <i class="icon" :class="show?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
        </div>
        <!--  -->
        <transition name="el-zoom-in-top">
            <!-- -->
            <div v-show="show" class="table_box" v-loading="loading" element-loading-text="正在获取信息..." element-loading-spinner="el-icon-loading">
                <div style="overflow-y: auto;">
                    <yt-table :data="evalFunc ? tableTreeList : list" ref="table" :columns="columns" reserveSelection="wmLocationId" :border="true" @selectChange="selectChange"></yt-table>
                    <el-pagination class="table_select_pagination" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
                </div>
                <div class="arrow"></div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: {
        evalFunc: {
            type: Function
        },
        size: {
            type: String,
            default: 'small'
        },
        columns: {
            type: Array,
            default: () => {
                return [
                    { value: 'divisionName', label: '区域' },
                    { value: 'locationName', label: '库位' },
                    { value: 'locationNormName', label: '规格' }
                ];
            }
        },
        wmWarehouseIds: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        tableTreeList() {
            let tmp;
            if (!Array.isArray(this.list)) {
                tmp = [this.list];
            } else {
                tmp = this.list;
            }
            const func = this.evalFunc;
            const args = [tmp, false];
            return func.apply(null, args);
        }
    },
    data() {
        return {
            show: false,
            total: 0,
            currentPage: 1,
            pageSize: 5,
            value: '',
            loading: false,
            list: [],
            locationIds: [],
            locationName: []
        };
    },
    watch: {
        show(bool) {
            // eslint-disable-next-line
            if (bool) {
            } else {
                this.$emit('handleselect', this.locationIds);
            }
        },
        wmWarehouseIds: {
            handler() {
                this.cleanUp();
            },
            immediate: true
        }
    },
    methods: {
        clickSelect() {
            if (this.wmWarehouseIds.length) {
                this.show = !this.show;
                !this.list.length && this.getStorehouse(this.wmWarehouseIds);
            } else {
                this.$message.warning('请先选择仓库');
            }
        },

        cleanUp() {
            // this.findRow(this.locationIds[0]);

            // this.locationIds.splice(0, 1);
            // this.locationName.splice(0, 1);
            // console.log(this.locationName, this.locationIds);
            this.locationIds = [];
            this.locationName = [];
            this.$nextTick(() => {
                this.$refs.table.clearSelection();
            });
        },
        findRow(wmLocationId) {
            let index = this.list.findIndex(
                item => item.wmLocationId == wmLocationId
            );
            this.$refs.table.toggleRowSelection(this.list[index], false);
            // if (index != -1) {
            //     this.$refs.table.toggleRowSelection(this.list[index], false);
            // } else {
            //     this.$refs.table.clearSelection();
            // }
            console.log(index);

            //
        },

        selectChange(val) {
            console.log(val);
            this.locationIds = val.map(item => item.wmLocationId);
            this.locationName = val.map(item => item.locationName);
        },

        handleCurrentChange(val) {
            this.currentPage = val;
            this.getStorehouse(this.wmWarehouseIds);
        },

        //获取库位
        getStorehouse(wmWarehouseIds) {
            this.loading = true;
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.currentPage,
                wmWarehouseIds
            };
            this.$api['warehouse/WmLocationGlobalList'](params).then(res => {
                let { pageNo, total, rows, pageSize } = res.page;
                this.total = total;
                this.currentPage = pageNo;
                this.pageSize = pageSize;
                this.list = rows;
                this.loading = false;
            });
        }
    }
};
</script>
<style lang="scss" scope>
.table_select_medium {
    height: 36px;
    line-height: 36px;
}
.table_select_small {
    height: 32px;
    line-height: 32px;
}

.tableSelect {
    width: 180px;
    position: relative;
    font-size: 14px;
    display: inline-block;
    &:hover {
        cursor: pointer;
    }
    .table_select_inner {
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        outline: none;
        padding: 0 30px 0 2px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        position: relative;
        .table_select_suffix {
            position: absolute;
            height: 100%;
            width: 25px;
            right: 5px;
            top: 0;
            text-align: center;
            color: #c0c4cc;
            transition: all 0.3s;
            pointer-events: none;
            .icon {
                width: 17px;
                vertical-align: baseline;
            }
        }
        .select_innerhtml {
            height: 100%;
            .select_innerhtml_bg {
                box-sizing: border-box;
                border-color: transparent;
                margin: 2px 0 2px 6px;
                background-color: #f0f2f5;
                color: #909399;
                border-radius: 3px;
                padding: 3px;
                .clean_up {
                    background-color: #fff;
                    color: #c4c7cc;
                    &:hover {
                        color: #909399;
                    }
                }
            }
            .length {
                box-sizing: border-box;
                border-color: transparent;
                margin: 2px 0 2px 6px;
                background-color: #f0f2f5;
                color: #909399;
                border-radius: 3px;
                padding: 3px;
            }
        }
    }
    .table_box {
        position: absolute;
        margin-top: 10px;
        z-index: 2001;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        text-align: justify;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        min-width: 180px;
        padding: 18px 20px 0;
        max-height: 430px;
        .arrow {
            width: 0;
            height: 0;
            border-width: 0 6px 6px;
            border-style: solid;
            border-color: transparent transparent #fff;
            position: absolute;
            top: -6px;
            left: 10%;
        }
    }
    .table_select_pagination {
        text-align: right;
        margin-top: 15px;
    }
}
</style>