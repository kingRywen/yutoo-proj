<template>
	<div>
		<div style="display: flex;">
			<div id="blocklyDiv" style="width: 70%;" :style='{height:parentHeight}'></div>		
			<div style="width: 30%;"  :style='{height:parentHeight}'>
				<pre id="textarea"  style="width: 100%;background:#ffd;margin-top: 0;margin-bottom: 0;" :style="{height:childHeight}">				
				</pre>
				<div  style="height: 80px; width: 100%;position:relative;background:#ffd">
					<el-button @click="evalMethod" size="small" plain type="primary" style="float: right;margin:30px 10px 0 0;" >运行</el-button>
				</div>
			</div>						
		</div>	
		<xml id="toolbox" style="display: none">
			<category name="常用" colour="210">
				<block type="block_common"></block>				
			</category>	
			<category name="固定字段"  colour="30">
				<block type="fixed_statisticalPattern"></block>
				<block type="fixed_adtime"></block>
				<block type="fixed_keywordType"></block>
			</category>
			<category name="指标" colour='250'>
				<block type="index_cost"></block>
				<block type="index_invalidClicks"></block>
				<block type="index_conversion"></block>
				<block type="index_acos"></block>
				<block type="index_orderQuantity"></block>
				<block type="index_ctr"></block>
			</category>
			<category name="运算符"  colour="290">
				<block type="controls_if"></block>
				<block type="logic_operation" ></block>
			</category>
			<category name="处理"  colour="135">
				<block type="index_joinPreciseNegative"></block>
				<block type="index_joinNegativePhrase"></block>
				<block type="index_stopAdvertising"></block>
				<block type="index_artificialSelection"></block>
				<block type="index_joinRuleout"></block>
			</category>
					
			<category name="其他" colour="210">
				<block type="math_number"></block>
				<block type="logic_compare"></block>				
				<block type="logic_boolean" ></block>
				<block type="text"></block>
				<block type="text_print"></block>
			</category>
			
			<category name="变量" colour = '290'>
				<block type="variables_get"></block>
				<block type="variables_set"></block>				
			</category>
			
			<category name="函数" custom="PROCEDURE" colour="%{BKY_PROCEDURES_HUE}">
			</category>
		</xml>
	</div>
</template>
<script>
	import '@/assets/js/blockly/blockly_compressed.js'
	import '@/assets/js/blockly/javascript_compressed.js'
	import '@/assets/js/blockly/blocks_compressed.js'
	import '@/assets/js/blockly/zh-hans.js'
	
	//自定义块
	import 'Views/shopsMonitor/messageAwaitingReply/common/testDemo/blocklyJs/fixedField.js'
	import 'Views/shopsMonitor/messageAwaitingReply/common/testDemo/blocklyJs/indexList.js'
	import 'Views/shopsMonitor/messageAwaitingReply/common/testDemo/blocklyJs/operator.js'
	import 'Views/shopsMonitor/messageAwaitingReply/common/testDemo/blocklyJs/resultList.js'
	import 'Views/shopsMonitor/messageAwaitingReply/common/testDemo/blocklyJs/common.js'
	
	export default{
		data(){
			return {
				parentHeight:'600px',
				childHeight:'520px'
			}
		},
		mounted(){
			this.workspace = Blockly.inject('blocklyDiv',
			    {toolbox: document.getElementById('toolbox')});				
			this.workspace.addChangeListener(this.myUpdateFunction);
		},
		methods:{
			myUpdateFunction(event) {
				let code = Blockly.JavaScript.workspaceToCode(this.workspace);
				document.getElementById('textarea').innerHTML = code;
			},
			evalMethod(){
				//改变外部尺寸时,动态改变blockly
				// Blockly.svgResize(Blockly.mainWorkspace)
				// Blockly.hideChaff(!0);
				let code = document.getElementById('textarea').innerHTML
				try {
					eval(code);
				} catch (e) {
					alert(e);
				}
			},
			echratsResize(type) {
			  if (type) {
			    this.parentHeight = '780px'
				this.childHeight = '700px'
			  } else {
			    this.parentHeight = '600px'
				this.childHeight = '520px'
			  }
			  this.$nextTick(function() {
			    Blockly.svgResize(Blockly.mainWorkspace)
			    Blockly.hideChaff(!0);
			  })
			},
		},
		beforeDestroy(){
			this.workspace.dispose()
			this.workspace = null
		}
	}
</script>

<style>
</style>
