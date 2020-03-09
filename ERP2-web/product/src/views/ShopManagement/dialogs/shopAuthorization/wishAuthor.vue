<template>
    <div>
        <div>
            <div class="accreditWarp">
                <el-collapse accordion v-model="activeName1" style="width:99%">
                    <el-collapse-item title="Step 1 : 登入后台" name="1" class="collapse1">
                        <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
                        <p>
                            <span class="red">注意：可在常登陆的电脑上登陆或者复制URL，然后在卖家的vps上登录授权，不能随意直接在我们的系统上点击URL登录。可能会照成店铺关联。</span>
                        </p>
                        <p>1.选择的商城是：
                            <el-select :popper-append-to-body="false" v-model="accreditObj.name" disabled size="mini">
                            <el-option :label="accreditObj.name" :value="accreditObj.name"></el-option>
                            </el-select>
                        </p>
                        <p>2.点击下列连结并且登入login</p>
                        <a target='_blank' href="https://www.wdgj.com">https://www.wdgj.com </a>
                    </el-collapse-item>
                    <el-collapse-item title="Step 2 : 获得【APPkey】和【APPsecret】" name="2" class="collapse1">
                        <!-- <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p> -->
                        <p>
                            <span class="red">登录wish店铺后台，【设置】-【API设置】填写App Name(任意英文字母)</span>
                        </p>
                        <img src="./11.png" alt="">
                        <p><span class="red">必须填写Redirect  URL：</span><a target='_blank' href="https://www.wdgj.com">https://www.wdgj.com</a></p>
                    </el-collapse-item>
                    <el-collapse-item title="Step 3 : 复制【APPkey】和【APPsecret】" name="3" class="collapse1">
                        <!-- <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p> -->
                        <p>
                            <span class="red">将获取到的【ClintID】 和【Clintsecret】两个参数分别填入API店铺授权界面【APPkey】和【APPsecret】处，ClintID 复制到AppKey ，Clintsecret复制到AppSecret。</span>
                        </p>
                        <div style='position:relative;'>
                            <new-form ref="form"  v-model="formData" label-width="100px" :form-schema="dataFormSchema"></new-form>
                            <ElButton type="primary" @click="startAuth" style='position:absolute;left:540px;top:46px;'>开始授权</ElButton>
                        </div>
                        <p>
                            <span class="red">然后选择【开始授权】</span>
                        </p>
                        <p>
                            <span class="red">登录用户名密码</span>
                        </p>
                        <img src="./22.png" alt="">
                        <p>
                            <span class="red">选择Accept，然后确认授权</span>
                        </p>
                        <img src="./33.png" alt="">
                        <p>
                            <span class="red">继续选择Accept</span>
                        </p>
                        <img src="./44.png" alt="">
                        <p>
                            <span class="red">跳转到https://www.wdgj.com开头的网址</span>
                        </p>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeName1: "1",
            accreditObj: {
                name: "qwe"
            },
            info: {},
            dataFormSchema:{
                APPkey:{
                    type: 'normal', 
                    widget: 'input', 
                    label: 'APPkey', 
                    width:200,
                },
                APPsecret:{
                    type: 'normal', // 数据类型，默认为normal，即单个输入框
                    widget: 'input', // 控件类型，对应element控件
                    label: 'APPsecret', // 标签内容
                    width:200,
                }
            },
            formData:{}
        };
    },
    methods: {
        startAuth(){
          
        }
    },
    created() {

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
