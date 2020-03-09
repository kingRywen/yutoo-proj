<template>
    <div>
        <new-form ref="form" :valid-success.sync="validSuccess" v-model="formData" label-width="100px" :form-schema="dataFormSchema" ></new-form>
    </div>
</template>

<script>
import { Promise } from 'q';
export default {
    props:['languageId','fn'],
    data() {
        let vm =this
        return {
            formData:{
                groupName:'',
                systemCategoryIdArray:[]
            },
            dataFormSchema: {
                // 字段名
                groupName: {
                    widget: 'input', // 控件类型，对应element控件
                    label: '标题组名称', // 标签内容
                    span: 24, // 布局占用宽度
                    placeholder: '请输入', // 占位字符
                    required:{
                        value:true,
                        errMsg:"请输入"
                    }
                },
                systemCategoryIdArray:{
                    width:'100%',
                    widget: 'cascader',
                    label: '适用类目',
                    span: 24,
                     required:{
                        value:true,
                        errMsg:"请选择"
                    },
                    // 自定义节点内容
                    // render(h, { node, data }) {
                    //     return (
                    //     <span>
                    //         {data.label}({node.level})
                    //     </span>
                    //     )
                    // },
                    // 对应element props
                    props: {
                        lazy: true,
                        label: 'systemCategoryName',
                        value:"systemCategoryId",
                        isLeaf: 'leaf',
                        checkStrictly:true,
                        lazyLoad(node, resolve) {
                            //console.log(node);
                            if (node.level === 0) {
                                vm.getTreeData(0).then(res=>{
                                     resolve(res)
                                }).catch(err=>{
                                    resolve([])
                                })
                            }
                            if (node.level >= 1) {
                                if(node.data.childFlag !== 1){
                                    vm.getTreeData(node.data.systemCategoryId).then(res => {
                                        resolve(res)
                                    }).catch(err=>{
                                       resolve([])
                                    })
                                }
                            }
                        }
                    }
                }
            },
            validSuccess:false
            
        }
    },
    methods: {
        _submit(){
            return this.$refs.form.validate().then(res=>{
                return this.$api[`product/PrConfigTitleWordGroupSave`](this.formData).then(res=>{
                    this.fn()
                    return Promise.resolve(true)
                })
            })
        },
        getTreeData(v){
            return this.$api[`product/CateSystemCategoryTreeTitleWordHasGroup`]({
                //languageId : this.languageId,
                id:v,
            })
            .then((data) => {
                console.log(data);
                let {rows} = data
                rows.forEach(i=>{
                    if(i.childFlag === 1){
                        i.leaf = true
                    }else{
                        i.leaf = false
                    }
                })
                //console.log(rows);
                return rows
            })
        },
    },
    created() {
        this.formData.languageId = this.languageId
    },
};
</script>

<style scoped lang="scss">

</style>
