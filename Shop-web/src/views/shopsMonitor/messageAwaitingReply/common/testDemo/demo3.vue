<template>
	<div>
		<div>
			<el-input v-model.trim="msg" @input.native="inputMethod" ></el-input>
		</div>
		{{msg}}
	</div>
</template>

<script>
	export default{
		data(){
			return {
				msg:null
			}
		},
		methods:{
			inputMethod(){
				this.msg = this.msg.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,'')
				console.log(this.msg)
			}
		}
	}
</script>

