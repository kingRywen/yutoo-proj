<template>
  <div>
    <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
  </div>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      formData: {},
      activeFields: [
		  {
			label: "关键词",
			name: "keywords",
			span: 24,
			type: "textarea",
			required: 'keywords'
		  },
        {
          label: "搜索页数",
          name: "searchPages",
          span: 24,
          type: "select",
          options: [
			{label: "1",value: 1 },
			{label: "2",value: 2},
			{label: "3",value: 3},
			{label: "4",value: 4 },
			{label: "5",value: 5},
			{label: "6",value: 6},
			{label: "7",value: 7 },
			{label: "8",value: 8},
			{label: "9",value: 9},
			{label: "10",value: 10},
		  ],
          required: true
        },
		{
		  label: "抓取频率",
		  name: "frequency",
		  span: 24,
		  type: "input",
		  required: "checkFrequency"
		},
        {
          label: "时间",
          name: "time",
          span: 24,
          type: "dateRange",
          required: "true",
		  pickerOptions:{
			  disabledDate(time) {
			    return time.getTime() < Date.now() - 8.64e7;
			  }
		  }
        },
      ],

    };
  },
  methods: {
    _initData() {
		if (this.params.isControl) {
			this.activeFields.splice(0,1)
		}
      
    },
   
    _close() {
		
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
			this.formData.monitorFrom = this.formData.time[0]
			this.formData.monitorTo = this.formData.time[1]
			
			delete this.formData.time
			if (this.params.isControl) {
				let datas = {
					...this.formData,
					taskIds:this.params.taskIds
				}
				datas.frequency = parseInt(datas.frequency)
				return this.$api[this.params.editControl?'ebTaskAuctionRankUpdateMonitor':'ebTaskAuctionRankAddMonitor'](datas).then(data=>{
					return  Promise.resolve("reset");
				})
			}else{
				let newKeyword = this.formData.keywords.split(/\s+/)
				delete this.formData.keywords
				this.formData.keywords = newKeyword
				let datas={
					...this.formData,
					...this.params,
				};
				datas.frequency = parseInt(datas.frequency)
				return this.$api[`ebTaskAuctionRankSave`](datas).then(data=>{
					return  Promise.resolve("reset");
				})	  
			}
			
      });
    }
  },
  created(){

  }
};
</script>

<style>
</style>

