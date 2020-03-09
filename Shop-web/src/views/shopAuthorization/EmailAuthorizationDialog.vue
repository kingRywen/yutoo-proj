<template>
    <div>
        <div class="box __box_wrapper" style="position:relative">
          <el-form :rules="rules" :model="form" ref="ruleForm" >
            <el-form-item prop="emailAccount" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入邮箱" v-model.trim="form.emailAccount" size="mini" type='email'>
                <template slot="prepend" style=" width:80px;">
                  店铺邮箱账号
                  <el-tooltip cplacement="top" effect="light">
                    <div slot="content">用于监控店铺预警消息和客户消息</div>
                    <i class='el-icon-question' style='margin-left:6px;font-size:16px;vertical-align: text-bottom;position: absolute;'></i>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="emailProtocol" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
                <div class='el-input el-input--mini el-input-group '>
                  <div class='el-input-group__prepend' style='line-height:26px;'>
                    接收邮件协议
                  </div>
                  <div style='border:1px solid #dcdcdc;height:28px;'>
                      <el-radio-group v-model="form.emailProtocol"  style='margin-top:8px;margin-left:10px;'>
                        <el-radio label="imap">IMAP</el-radio>
                       
                      </el-radio-group>
                  </div>
                </div>
            </el-form-item>
            <el-form-item prop="emailAuthCode" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入邮箱授权码" v-model.trim="form.emailAuthCode" size="mini" type='email'>
                <template slot="prepend" style=" width:80px;">
                  邮箱授权码
                  <!-- <el-tooltip cplacement="top" effect="light">
                    <div slot="content"> <a style='text-decoration: underline;color:#40a5ed;' @click='$router.push("/EmailAuthorizationHelp")'>查看授权教程</a> </div>
                    <i class='el-icon-question' style='margin-left:6px;font-size:16px;vertical-align: text-bottom;position: absolute;'></i>
                  </el-tooltip> -->
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="secondaryAuthorizationLink" :label-width="formLabelWidth" v-if='secondaryAuthorizationLinkShow'>
              <div class=" smallStarBox smallStar">*</div>
              <el-tooltip :content="form.secondaryAuthorizationLink" placement="top" effect="light">
                <el-input placeholder="请输入邮箱授权码" v-model.trim="form.secondaryAuthorizationLink" size="mini" type='text' class='secondaryAuthorizationLink' 
                  @click.native='secondaryAuthorizationLinkClick'>
                    <template slot="prepend" style=" width:80px;">
                      二次授权链接
                    </template>
                </el-input>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
export default {
    props:['adToAuthParams','areaId'],
    data() {
        let vm = this;
        let emailValidatePass  = (rule, value, callback) => {
            console.log(value);
            if( !vm.reg.test(value)){
                vm.secondaryAuthorizationLinkShow = false ;
                vm.form.secondaryAuthorizationLink = ''
                return   callback(new Error('请正确输入邮箱'));
            }else{
              let emailType = vm.form.emailAccount.split('@')[1].slice(0,3)
              if(emailType==='163'){
                  vm.secondaryAuthorizationLinkShow = true ;
                  vm.form.secondaryAuthorizationLink = 'http://config.mail.163.com/settings/imap/login.jsp?uid='+vm.form.emailAccount
              }else if( emailType==='126' ){
                  vm.secondaryAuthorizationLinkShow = true ;
                  vm.form.secondaryAuthorizationLink = 'http://config.mail.126.com/settings/imap/login.jsp?uid='+vm.form.emailAccount
              }else{
                  vm.secondaryAuthorizationLinkShow = false ;
                  vm.form.secondaryAuthorizationLink = ''
              }   
            };
            callback()
        }
        return {
            form:{
                emailAccount:'',
                emailProtocol:"imap",
                emailAuthCode:""
            },
            reg:new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"),
            secondaryAuthorizationLinkShow:false,
            formLabelWidth: "50px", //label宽度
            rules:{
               emailAccount:[
                    {
                        required: true,
                        validator: emailValidatePass,
                        trigger: "change"
                    },
                ],
                emailProtocol:[
                    {
                        required: true,
                        message: "请选择接收邮件协议",
                        trigger: "blur"
                    },
                ],
                emailAuthCode:[
                    {
                        required: true,
                        message: "请输入邮箱授权码",
                        trigger: "blur"
                    },
                ]
            }
        };
    },
    methods: {
        submit(){
            //console.log(1);
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.form));
                    params.areaId = this.areaId;
                    params.sellerAuthId = this.adToAuthParams.sellerAuthId;
                    this.$api['sellerAuthEmailAuth'](params)
                    .then(data => {
                        this.$emit('resquestEmaillSuccess',true)
                    }).catch(() => {})
                }else{

                }
            
            })
        },
        secondaryAuthorizationLinkClick(){
            //console.log(6);
            window.open(this.form.secondaryAuthorizationLink)
        }
    },
    created() {
        // console.log(this.adToAuthParams);
        // console.log(this.areaId);
        this.form.platformId = this.platformId;
    },
    beforeDestroy(){
         this.$refs.ruleForm.clearValidate()
    },
};
</script>

<style scoped lang="less">
.box{
  /deep/.el-form-item__content {
  margin-left: 0 !important;
}
.secondaryAuthorizationLink{
  &:hover{
    /deep/input{
      color: #0094E9;;
      cursor: pointer;

    }
  }
}

}

</style>
