<template>
    <div class="correlation">
        <!-- 关联/解除射频 -->
        <page-layout title="关联解除/射频" :footerText="footerText" :showFooter="showFooter" @handleBtn="handleBtn">
            <x-input v-model="uniqueLabel" placeholder="产 品 条 码" placeholder-align="left" class="product-code" :show-clear="false">
                <div slot="right-full-height" class="scanning">
                    <i class="iconfont icon-saoyisao scanningicon" @click="getScanInfo()"></i>
                </div>
            </x-input>
            <x-input v-if="footerText=='绑 定 射 频'" v-model="rfTagCode" placeholder="射 频 编 码" placeholder-align="left" class="product-code" :show-clear="false"></x-input>
            <x-table :full-bordered="true" class="table" v-if="Object.keys(info).length">
                <thead>
                    <tr>
                        <th>主图</th>
                        <th>自定义sku</th>
                        <th>仓库条码</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img :src="info.imgPath" width="90" class="image">
                        </td>
                        <td>{{info.sku}}</td>
                        <td>{{info.uniqueLabel}}</td>
                    </tr>
                </tbody>
            </x-table>
            <div v-else class="nomsg">扫描产品条码获取产品信息</div>
        </page-layout>
    </div>
</template>

<script>
import PageLayout from '@/components/Layouts/page-layout';
import { Toast } from 'vux';
export default {
    components: {
        PageLayout,
        Toast
    },
    data() {
        return {
            footerText: '',
            info: {},
            uniqueLabel: '',
            rfTagCode: '',
            showFooter: false,
            isBind: false
        };
    },
    methods: {
        //扫描射频
        getScanInfo() {
            if (!this.uniqueLabel) {
                return this.$vux.toast.text('请输入产品条码获取', 'middle');
            }
            this.getList();
        },
        getList() {
            this.$api['warehouse/AppRfScan']({
                uniqueLabel: this.uniqueLabel
            }).then(res => {
                let { isBind, product } = res.rows;
                this.isBind = isBind;
                this.info = product;
                isBind
                    ? (this.footerText = '解 除 射 频')
                    : (this.footerText = '绑 定 射 频');
                this.showFooter = true;
            });
        },
        //绑定射频
        bindScan() {
            if (!this.rfTagCode) {
                return this.$vux.toast.text('请输入射频编码再绑定', 'middle');
            }
            this.$api['warehouse/AppRfBind']({
                rfTagCode: this.rfTagCode,
                uniqueLabel: this.uniqueLabel
            }).then(res => {
                this.$vux.toast.text(res.msg, 'middle');
                // this.getList();
                this.uniqueLabel = '';
                this.rfTagCode = '';
                this.footerText = '';
                this.showFooter = false;
                this.info = {};
            });
        },
        //解除射频
        relieveScan() {
            this.$api['warehouse/AppRfUnbind']({
                rfTagCode: this.info.rfCode
            }).then(res => {
                this.$vux.toast.text(res.msg, 'middle');
                // this.getList();
                this.uniqueLabel = '';
                this.rfTagCode = '';
                this.showFooter = false;
                this.info = {};
            });
        },
        handleBtn() {
            if (this.isBind) {
                this.relieveScan();
            } else {
                this.bindScan();
            }
        }
    }
};
</script>

<style lang="scss" scope>
.correlation {
    background: #fff;
    .product-code {
        border: 1px solid #c7c7c7;
        margin-bottom: 10px;
        border-radius: 5px;
        .scanning {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .scanningicon {
                padding: 0 10px;
                font-size: 28px;
            }
        }
    }
    .table {
        margin-bottom: 10px;
        .image {
            margin-top: 10px;
        }
    }
    .nomsg {
        text-align: center;
    }
}
</style>