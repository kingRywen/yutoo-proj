<template>
    <div>
        <div>
            <div class="accreditWarp">
                <el-collapse accordion v-model="activeName1" style="width:99%">
                    <el-collapse-item title="Step 1 : 选择商城" name="1" class="collapse1">
                    <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
                    <p>
                        <span class="red">注意：可在常登录的电脑上登录或复制URL，然后在卖家的vps上授权，不能随意直接在我们的系统上点击URL进行登录。可能会造成店铺关联。</span>
                    </p>
                    <p>1.选择的商城是：
                        <el-select :popper-append-to-body="false" v-model="accreditObj.name" disabled size="mini">
                        <el-option :label="accreditObj.name" :value="accreditObj.name"></el-option>
                        </el-select>
                    </p>
                    <p>2.点击下列连结并且登入login</p>
                    <a target='_blank' :href="url">{{url}}</a>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['opt'],
    data() {
        return {
            activeName1: "1",
            accreditObj: {
                name: "qwe"
            },
            info: {},

            url:'',
        };
    },
    methods: {
        getUrl(){
          this.$api[`product/GlStoreAuthEbay`]({
              storeId : this.opt.storeId
          })
          .then((data) => {
              //console.log(data);
              let {rows} = data
              this.url = rows
          })
        }
    },
    created() {
        this.getUrl()
    },
};
</script>

<style scoped lang="scss">
//授权弹框
.accreditWarp {
  overflow-y: auto;
  /deep/{
    .el-collapse-item__header {
      color: #0079c6 !important;
      font-size: 16px;
      font-weight: 700;
    }
    .el-collapse-item {
      background: #f5f5f5;
    }
    .el-form-item {
      display: flex;
      flex-direction: row;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      .el-input {
        width: 400px;
      }
    }

    p {
      line-height: 30px;
      word-wrap: break-word;
    }
    .red {
      color: red;
    }
    .blod {
      font-weight: 800;
    }
    .collapse1 {
      a {
        color: #0079c6;
        margin-left: 50px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
