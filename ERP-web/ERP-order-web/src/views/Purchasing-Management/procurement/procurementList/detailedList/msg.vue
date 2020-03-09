<template>
  <div class="msg">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" size="small">
      <!-- <el-form-item label="发送类型" prop="type">
        <el-select v-model="ruleForm.type">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item
        label="手机号码"
        prop="phone"
        :rules="[
             { pattern:/^1[34578]\d{9}$/, required: true,  message: '请输入正确的手机号码',  trigger: 'change' }  
        ]"
      >
        <el-input v-model="ruleForm.phone" placeholder="手机号码不能为空,发送多人请用英文逗号分隔"></el-input>
      </el-form-item>
      <el-form-item
        label="发送网址"
        prop="website"
        :rules="[
             { pattern:/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, 
             required:ruleForm.website?true:false,  message: '请输入正确的网址',  trigger: 'change' }  
        ]"
      >
        <el-input v-model="ruleForm.website" placeholder="如有网地址发送请写在此处,字数不超过60"></el-input>
      </el-form-item>
      <el-form-item
        label="发送内容"
        prop="content"
        :rules="[
             { required: true,  message: '请输入短信内容',  trigger: 'change' }  
        ]"
      >
        <el-input v-model="ruleForm.content" type="textarea" class="textarea"></el-input>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker
          clearable
          v-model="ruleForm.time"
          type="datetime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="时间为空则立即发送"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            ruleForm: {
                // type: '',
                phone: '',
                website: '',
                content: '',
                time: ''
            }
        }
    },
    methods: {
        submitForm(callback) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.$api['procurement/purchaseSendSms'](this.ruleForm)
                        .then(res => {
                            this.$message.success(res.msg)
                            callback && callback()
                        })
                        .catch(err => {
                            this.$message.error(err.msg)
                        })
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.ruleForm.time = ''
            this.$refs.ruleForm.resetFields()
        }
    }
}
</script>