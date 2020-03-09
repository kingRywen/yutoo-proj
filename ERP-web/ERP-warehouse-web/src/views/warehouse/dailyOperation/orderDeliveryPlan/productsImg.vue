<template>
    <!-- sku图片 -->
    <!-- <el-row :gutter="10" class="productsImglist" v-loading="loading" element-loading-text="图片加载中..." element-loading-spinner="el-icon-loading">
    <el-col :span="8" class="productsImgitem" v-for="(i,index) in list" :key="index">
      <div class="imgbox" :style="{backgroundImage: 'url('+i.productImg +')' }">
        <ul>
          <li>sku：{{i.storeSku}}</li>
          <li>数量：{{i.amount}}</li>
        </ul>
      </div>
    </el-col>
    </el-row>-->

    <el-carousel :interval="3000" height="380px" v-loading="loading" element-loading-text="图片加载中..." element-loading-spinner="el-icon-loading">
        <el-carousel-item v-for="(i,index) in list" :key="index">
            <div class="img-warp">
                <img :src="i.productImg" width="auto" height="100%">
                <ul class="img-info">
                    <li>sku：{{i.customSku || '-'}}</li>
                    <li>数量：{{i.amount || 0}}</li>
                </ul>
            </div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            list: [],
            loading: false
        };
    },
    methods: {
        getProductList(wmPackageId) {
            this.loading = true;
            this.$api['warehouse/packageSkuProductList']({ wmPackageId }).then(
                res => {
                    this.list = res.rows;
                    this.loading = false;
                }
            );
        }
    }
};
</script>
<style lang="scss" scope>
.el-dialog__body {
    padding-top: 0;
}
.img-warp {
    text-align: center;
    height: 100%;
    position: relative;
    .img-info {
        position: absolute;
        bottom: 0;
        bottom: 35px;
        left: 35px;
        li {
            font-size: 14px;
            font-weight: 600;
            padding: 5px;
            text-align: left;
        }
    }
}
.productsImglist {
    width: 100%;
    max-height: 560px;
    overflow: auto;
}
.productsImgitem {
    height: 192px;
    margin-bottom: 10px;
    .imgbox {
        width: 100%;
        height: 100%;
        border: 1px solid green;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column-reverse;
        ul {
            li {
                line-height: 26px;
                font-size: 14px;
                font-weight: 600;
                padding-left: 10px;
            }
        }
    }
}
</style>
