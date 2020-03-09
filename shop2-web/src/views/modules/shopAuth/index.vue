<template>
  <div>
    <el-tabs class="shopauth-tabs">
      <el-tab-pane :key="index" v-for="(item, index) in platforms" :label="platMap[item.platformName].name" lazy>
        <span slot="label">
          <img :src="platMap[item.platformName].img" />
        </span>
        <div class="hr"></div>
        <component :is="item.platformName" :platformId="item.platformId" />
      </el-tab-pane>
      <!-- <el-tab-pane label="eBay" lazy>
        <span slot="label">
          <img src="./ebay.png" />
        </span>
        <div class="hr"></div>
        <ebay />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {
    Amazon: () => import('./amazon'),
    eBay: () => import('./ebay')
  },
  data() {
    return {
      platMap: {
        Amazon: {
          name: '亚马逊',
          code: 'Amazon',
          img: require('./amazon.png')
        },
        eBay: {
          name: '易贝',
          code: 'eBay',
          img: require('./ebay.png')
        }
      }
    }
  },
  computed: {
    platforms() {
      return this.$store.state.storeInfo.allData
    }
  }
}
</script>
<style lang="scss">
.shopauth-tabs {
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item {
    padding: 0;
    margin-right: 10px;
    border: 1px solid #eee;
    overflow: hidden;
    transition: 0.25s;
    &.is-active {
      border-color: $bghoverColor;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        background-color: $bghoverColor;
        width: 50px;
        height: 50px;
        transform: rotate(45deg);
        right: -33px;
        bottom: -33px;
      }
      &:after {
        bottom: 1px;
        right: 2px;
        display: block;
        color: #fff;
        font-size: 12px;
        position: absolute;
        content: '\e6da';
        width: 10px;
        height: 10px;
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>