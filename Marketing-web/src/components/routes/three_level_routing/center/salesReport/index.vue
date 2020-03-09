<template>
  <div class="box" v-if="!showAuthPage">
    <div class="menu-btn">
      <div class="sale-btn" @click="changeBtn('sale')" ref="saleBtn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chanpin"></use>
        </svg>
        产品销售报告
      </div>
      <div class="flux-btn" @click="changeBtn('flux')" ref="fluxBtn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-liuliang"></use>
        </svg>
        产品流量报告
      </div>

      <div class="sites-select">
        <el-select :popper-append-to-body="false"v-model="sellerSalesSiteId" placeholder="请选择" @change="changeSite">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <component :is="componentName" :p-params="pParams" :p-site="salesSite" :p-type="analyseType" v-on:changePage="changePage" v-on:comeBack="comeBack" v-on:restSellerSite="getSalesSellerSite"></component>
  </div>
  <AuthPage v-else>

  </AuthPage>
</template>
<script>
import { SaleReport, FluxReport, Analyse, AuthPage } from "./components";
import "./icon/iconfont";
export default {
  components: {
    SaleReport,
    FluxReport,
    AuthPage,
    Analyse
  },
  data() {
    return {
      showAuthPage: false,
      componentName: "SaleReport",
      pParams: null,
      analyseType: null,
      options: [],
      sellerSalesSiteId: null,
      salesSite: {
        id: null,
        data: null
      }
    };
  },
  created() {
    this.getSalesSellerSite();
  },
  methods: {
    changeBtn(t) {
      let saleBtnStyle = this.$refs.saleBtn.style;
      let fluxBtnStyle = this.$refs.fluxBtn.style;

      let componentName = "SaleReport";
      if (t === "sale") {
        fluxBtnStyle.backgroundColor = "#efefef";
        fluxBtnStyle.color = "#000";
        saleBtnStyle.backgroundColor = "#fff";
        saleBtnStyle.color = "#00c0de";
      } else if (t === "flux") {
        saleBtnStyle.backgroundColor = "#efefef";
        saleBtnStyle.color = "#000";
        fluxBtnStyle.backgroundColor = "#fff";
        fluxBtnStyle.color = "#00c0de";
        componentName = "FluxReport";
      }
      this.componentName = componentName;
    },
    changePage(data) {
      let { type, params } = data;
      this.pParams = params;
      this.analyseType = type;
      this.componentName = "Analyse";
    },
    comeBack(pageType){
      if(pageType==='sale'){
        this.componentName = 'SaleReport';
      }else{
        this.componentName = 'FluxReport';
      }
    },
    getSalesSellerSite() {
      this.$axios.post("/SellerAuth/getSalesSellerSite").then(res => {
        let { code, data, msg } = res.data;
        if (code === 0) {
          if (!data.length) {
            this.showAuthPage = true;
            return;
          }
          this.salesSite.data = data;
          let options = [];
          data.forEach(element => {
            let label = element.sellerAlias;
            if (element.siteName !== null) {
              label = element.siteName + "-" + element.sellerAlias;
            }
            let item = {
              label,
              value: element.sellerSalesSiteId
            };
            options.push(item);
          });
          this.options = options;
          if (data.length > 0) {
            this.sellerSalesSiteId = data[0].sellerSalesSiteId;
            this.salesSite.id = this.sellerSalesSiteId;
          }
        } else {
          this.$message.warning(msg);
        }
      });
    },
    changeSite(val) {
      this.salesSite.id = val;
    }
  }
};
</script>
<style lang="less" scoped>
.icon {
  width: 19px;
  height: 19px;
  vertical-align: -0.27em;
  fill: currentColor;
  overflow: hidden;
}

.box {
  .menu-btn {
    display: grid;
    grid-template: ~"48px / 160px 160px auto";
    border: 1px solid #d7d7d7;
    background-color: #efefef;
    .sale-btn,
    .flux-btn {
      display: flex;
      justify-content: center;
      .icon {
        widows: 14px;
        height: 14px;
        margin-top: 3px;
        margin-right: 2px;
      }

      padding: 13px 10px 13px 10px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
    .flux-btn {
      border-right: 1px solid #dcdfe6;
    }
    .sale-btn {
      background-color: #fff;
      color: #00c0de;
    }
    .sites-select {
      align-self: center;
      justify-self: end;
      .el-select {
        margin-right: 30px;
        width: 220px;
      }
    }
  }
}
</style>
<style scoped>
@import "./icon/iconfont.css";
</style>


