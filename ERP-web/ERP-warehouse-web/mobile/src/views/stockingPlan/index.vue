<template>
    <page-layout title="盘点计划" :showFooter="false" :topAllLoaded="true" ref="page" @drop-down="dropDown" @pull-up="pullUp">
        <template slot="header-right">
            <div class="right-btn">
                <div @click="add">添 加</div>
                <div class="iconfont icon-search search" @click="search"></div>
            </div>
        </template>
        <ul class="list">
            <li class="item" v-for="item in list">
                <div class="item-left">
                    <h5>批次号：{{item.batchNumber}}</h5>
                    <p>{{item.wmWarehouseName}}</p>
                    <div>
                        申请人：{{item.applicantName}}
                        <span>{{item.typeName}}</span>
                    </div>
                    <div class="item-left-info">
                        <span>{{item.scopeName}}</span>
                        <span>{{item.createTime}}</span>
                    </div>
                </div>

                <div class="item-right">
                    <div class="status">
                        <span>{{item.statusName}}</span>
                        <i class="iconfont icon-right More"></i>
                    </div>
                </div>
            </li>
        </ul>
    </page-layout>
</template>

<script>
import PageLayout from '@/components/Layouts/page-layout';
export default {
    components: {
        PageLayout
    },
    data() {
        return {
            value: '',
            list: [],
            pageSize: 10
        };
    },
    methods: {
        add() {},
        //
        search() {
            this.$router.push({
                path: '/app/search'
            });
        },
        //下拉更新
        dropDown() {
            this.getList();
        },
        //上拉加载
        pullUp() {
            this.pageSize += 10;
            this.getList();
        },
        getList() {
            this.$api['warehouse/InventoryPlanList']({
                pageSize: this.pageSize,
                pageNumber: 1
            }).then(res => {
                console.log(res);
                let { rows } = res;
                this.list = rows;
                this.$refs.page.refreshData();
            });
        }
    },
    mounted() {
        this.getList();
    }
};
</script>

<style lang="scss" scope>
.right-btn {
    display: flex;
    justify-content: flex-end;
    .search {
        height: 100%;
        padding-left: 10px;
    }
}
.list {
    .item {
        background: #efefef;
        padding: 10px 0 10px 10px;
        margin: 1px 1px 12px 1px;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        box-shadow: 0 2px 12px 0 rgba(101, 97, 97, 0.45);
        .item-left {
            .item-left-info {
                span {
                    font-size: 14px;
                    padding: 2px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
            }
        }
        .item-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            .status {
                span {
                    color: #1aad19;
                }
            }
            .More {
                padding: 30px 3px;
            }
        }
    }
}
</style>