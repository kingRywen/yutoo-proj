<template>
	<div>
		<!-- 导入组件 -->
		<importFile
			v-bind = "options"
			v-on = "events"
		>
		</importFile>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				options:{
					filename:'test',   //成功下载模板文件名称,
					downloadParams:{name:1},  //下载模板文件调接口传入的参数
					data:{name:1},		//导入调接口传入的参数
					downloadApi:'/keyword/test',   //传入此参数则支持下载模板文件,并且该参数为下载模板文件的api接口
					action:'http://192.168.0.32:8003/importLog/importData',	//导入所传的api,必须为全路径
					
					//以上部分建议都传    以下部分根据需求决定是否传
					
					tips:'test',	//左下方的提示文字,不传则展示   '只能上传excel文件',
					type:1,//文件格式   0是zip文件   1是excel文件
					single:true,   //为true则限制上传文件为1个,false则多个
					autoUpload:true,  // 为true则在选取文件后立即进行上传,false则反之
				},
				events:{
					//success()  导入成功的回调
					success(data){
						console.log(data)  //下载的文件详情
						console.log(data.file)  //下载的文件详情
						console.log(data.res)  //后端返回的结果
					},
					
					//error()  导入失败的回调
					error(data){
						console.log(data)  //后端返回的结果
					}
				}
			}
		}
	}
</script>
