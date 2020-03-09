<template lang="html">
    <section class="uploading">
        <h3 class="title">上传模板</h3>
        <el-form :inline="true" :model="uploadingForm" class="demo-form-inline uploadingForm" size="medium">
            <el-form-item label="名称：">
                  <el-input v-model='uploadingForm.name'/>
            </el-form-item>
            <el-form-item label="站点：">
                    <el-select v-model="uploadingForm.site">
                      <el-option label="区域一" value="shanghai"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="类目：">
                    <el-select v-model="uploadingForm.category">
                      <el-option label="区域一" value="shanghai"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item>
                  <el-upload class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="fileList2"
                      list-type="picture">
                      <el-button size="medium" type="primary">上传模板</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
            </el-form-item>
        </el-form>

        <el-table :data="tableData"  style="width: 100%" border class="uploadingTable">
            <el-table-column  type="index" label="序号" width="200" align="center"/>
            <el-table-column  property="date" label="模板字段" width="200" align="center"/>
            <el-table-column  property="name" label="字段类型" width="200" align="center"/>
            <el-table-column  property="address" label="是否店铺差异" width="200" align="center">
                <template slot-scope="scope">
                    <img src="../../icon/u91275.png" width="27" height="27" alt="">
                </template>
            </el-table-column>
            <el-table-column  property="address" label="是否变体差异" width="200" align="center">
                <template slot-scope="scope">
                    <img src="../../icon/u91267.png" width="27" height="27" alt="">
                </template>
            </el-table-column>
            <el-table-column  property="address" label="关联对应字段" width="200" align="center"/>
            <el-table-column  property="address" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text">设置关键字段</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="submitBtn">
            <el-button type="primary" >翻 译</el-button>
            <el-button type="primary" >保存模板</el-button>
        </div>

    </section>
</template>

<script>
export default {
    name:"uploading",
    data() {
        return {
            uploadingForm:{
                name:'',
                site:'',
                category:''
            },
            fileList2: [],
            tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }

    }
}
</script>

<style lang="scss">
    .uploading{
        // position: relative;
    }
    .title{
        height: 38px;
        line-height: 38px;
        background: rgb(110, 123, 155);
        text-indent:20px;
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        color: rgb(255, 255, 255);
    }
    .uploadingForm{
        margin-top: 15px;
        margin-left: 10px;
        border-bottom: 1px solid rgb(220, 223, 230);
        .upload-demo{
            position: relative;
            .el-upload__input{
                display: none;
            }
            .el-upload-list{
                position: absolute;
                left:120px;top:-15px;
                z-index: 10;
                display: flex;
                li{
                    height: 50px;
                    width: 110px;
                    padding: 10px 10px 10px 10px;
                    img{
                        height: 34px;
                        width: 34px;
                        margin-left: 0;
                    }
                    a{
                        width: 48px;
                        height: 16px;
                        line-height: 16px!important;
                    }
                }
            }
        }

    }
    .uploadingTable{
        margin-top: 15px;
    }
    .submitBtn{
        position:absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        text-align: center;
    }
</style>
