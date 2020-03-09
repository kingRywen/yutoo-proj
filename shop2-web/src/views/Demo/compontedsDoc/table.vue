<template>
	<div>
		<!-- 表格组件 -->
		<ytTable
			v-bind = 'options'
		>
		</ytTable>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				options:{
					data:[{id:1,name:'test1'},{id:2,name:'test2'}],     //表格数据,一般是后端返回的;
					columns:[		//表格渲染数组   数组多少个元素就渲染多少列
						{
							label:'NAME',	//列的标题名称
							value:'name',	//列的内容所对应的字段
						}
					],
					
					//以上部分建议都传    以下部分根据需求决定是否传
					
					checkStrictly:true,	// 表格有checkbox时是否遵循父子不关联，默认勾选父不勾选子，如果false则勾选父时会勾选子
					treeStripe:true,		//为true则显示树形斑马线,false则反之
					treeColor:false,    //为true则显示树型表格下子选项颜色,false则反之
					stripe:true,    //为true则为斑马纹 table,false则反之
					treeTable:false,    //为true则为树形表格,false则反之
					treeTableOtions:{    //树形表格的配置
						childs: 'children',   //子数组键值
						expandFunc: row => {   // 是否显示expand按钮的函数
						  return row.count <= 1
						}
					},
					spanMethod: () => {
						//合并行列的计算方法
					},				
				}
			}
		}
	}
</script>
