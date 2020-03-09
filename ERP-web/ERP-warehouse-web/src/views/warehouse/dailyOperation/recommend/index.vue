<template>
    <!-- <div>推荐移动库列表</div> -->
    <div>
        <yt-page
            url="warehouse/recommendList"
            reserveSelection="wmMoveRecommendId"
            :tableConfig="tableConfig"
            :searchConfig="searchConfig"
            :btnConfig="btnConfig"
            :searchData="searchData"
            @submitForm="submitForm"
            @selectChange="selectChange"
            :selectableFunc="selectableFunc"
            ref="page"
        ></yt-page>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import { mixins } from '../mixins';
export default {
    mixins: [mixins],
    data() {
        return {
            tableConfig: [
                {
                    value: 'imageBase',
                    label: '主图',
                    img: true,
                    width: 110,
                    style: {
                        width: 50,
                        height: 50
                    }
                },
                { value: 'skuCus', label: 'SKU' },
                { value: 'nameCh', label: '中文名' },
                { value: 'originalLocationName', label: '库位' },
                { value: 'repertoryAmount', label: '数量' },
                { value: 'recommendLocationName', label: '推荐库位' },
                { value: 'recommendAmount', label: '推荐转库数量' },
                { value: 'ignoreFlagName', label: '备注' }
                // { value: 'remark', label: '备注' }
            ],
            searchConfig: [
                {
                    label: '产品SKU：',
                    value: 'sku',
                    type: 'input'
                },
                {
                    label: '选择仓库：',
                    value: 'wmWarehouseId',
                    type: 'select',
                    children: []
                }
            ],
            btnConfig: [
                {
                    name: '生成移库计划',
                    disabled: () => {
                        return this.wmMoveRecommendIds.length ? false : true;
                    },
                    fn: () => {
                        // if (!this.wmMoveRecommendIds.length) {
                        //     return this.$message.warning(
                        //         '请选择需要生成的数据'
                        //     );
                        // }
                        this.$refs.page.$dialog({
                            title: '生成移库计划',
                            visible: true,
                            component: () => import('./generate'),
                            fnName: 'getInfo',
                            params: this.wmMoveRecommendIds
                        });
                    }
                },
                {
                    name: '忽略',
                    disabled: () => {
                        return this.wmMoveRecommendIds.length ? false : true;
                    },
                    type: 'success',
                    fn: () => {
                        // if (!this.wmMoveRecommendIds.length) {
                        //     return this.$message.warning(
                        //         '请选择需要忽略的数据'
                        //     );
                        // }
                        this.$confirm('是否忽略?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning',
                            center: true
                        })
                            .then(() => {
                                this.$api['warehouse/wmRecommendIgnore']({
                                    wmMoveRecommendIds: this.wmMoveRecommendIds
                                }).then(res => {
                                    this.coincident(res.msg);
                                    this.$refs.page.clearSelection();
                                });
                            })
                            .catch(() => {
                                return false;
                            });
                    }
                }
            ],
            wmMoveRecommendIds: []
        };
    },
    methods: {
        ...mapActions(['getWarehouseList']),
        selectableFunc(row) {
            return row.ignoreFlag == 1 ? false : true;
        },
        searchData(val) {
            return val;
        },
        selectChange(val) {
            this.wmMoveRecommendIds = val.map(item => item.wmMoveRecommendId);
        },
        submitForm(val, title) {
            switch (title) {
                case '生成移库计划':
                    this.generate(val);
                    break;
                default:
                    break;
            }
        },
        generate(params) {
            console.log(params);
            this.$api['warehouse/movePlanCreate'](params).then(res => {
                this.coincident(res.msg);
            });
        }
    },
    mounted() {
        if (this.$store.state.daily.warehouseList.length) {
            return;
        } else {
            this.getWarehouseList(1).then(data => {
                this.searchConfig[1].children = data;
            });
        }
    }
};
</script>
<style lang="scss">
</style>


