<template>
	<div>
		<!-- 两列表格 -->
		<dataTable
			v-bind='options'
			v-on = "events"
		></dataTable>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				options:{
					title : 'test',      //表头总标题					
					columns : ['name','num'],      //左右两列的标题名称    不传则不展示
					data : [{label:'test1',value:1},{label:'test2',value:2}]       ,//表格内容部分
					
					//以上部分建议都传    以下部分根据需求决定是否传
					
					showBtn : true,      //为true则右侧内容需要点击事件,需要绑定 tdClick事件,false则不需要事件
					sortable : true,      //为true则表格右侧内容支持排序,false反之
					center : true,      //为true则表格所有内容居中,false反之
				},
				events:{
					tdClick(item,index,prop,columns,title,val){
						console.log(item)   //点击的那一行数据的  label和value
						console.log(index)  //点击的数据对应在data的index索引
						console.log(prop)   //传入子组件的prop,有则返回,无则返回undefined
						console.log(columns)  //左右两列的标题名称
						console.log(title)	//表头总标题
						console.log(val)	//$event	
					},
				}
			}
		}		
	}
</script>