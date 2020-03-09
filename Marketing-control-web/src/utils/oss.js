import {httpPost,uploadFileToOSS} from '@/api/index'

// 不支持批量上传文件
export function uploadFile(file,folder) {
    return new Promise((resolve, reject)=>{
        //files 文件可以是多文件
        //dir 保存到oss 目录及文件名
        let reqData={
            url:'/img/getSign',
            params:{objectName:folder}
        }
        httpPost(reqData).then(res => {
            let {accessid,code,dir,expire,host,policy,signature} =res
            if(code===0){
                let formData = new FormData();
                formData.append("policy", policy);
                formData.append("OSSAccessKeyId", accessid);
                formData.append("success_action_status", '200');
                formData.append("signature", signature);

                let fileStrArr =file.name.split('.') 
                //获取文件后缀名
                let extFileName = fileStrArr[fileStrArr.length-1]
                //文件名为时间戳
                let fileName =new Date().getTime()+'.'+extFileName
                formData.append("key", dir+fileName);
                formData.append('file', file.raw) 

                reqData={
                    url:host,
                    params:formData
                    }
                uploadFileToOSS(reqData).then(res => {
                    // 正常返回没有 res 
                    resolve(host+'/'+dir+fileName)
                }).catch(err=>{
                    reject(err)
                })
            }else{
                reject('/img/getSign API response code is not 0')
            }
        }).catch(err=>{
            reject(err)
        })
        
        
         
        //成功后并返回文件存放路径
       
        
    })
  }
  /*
  使用demo
 <el-upload
    class="upload-box"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="handleChange"
    :file-list="fileList"
    list-type="picture">
    <el-button size="small" type="primary">点击上传(是上传到浏览器，不是上传到服务器)</el-button>
</el-upload>

handleChange(file, fileList){
    // 单文件上传
    this.fileList = fileList.slice(-1);
},

  uploadFiles(this.fileList[0],'marketimg/admin/img/').then(res =>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
  
  */