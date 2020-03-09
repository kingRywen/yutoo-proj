<template lang="html">

    <section class="templateManagement">
        <h3 class="title">模板管理</h3>
        <div class="switchoverBtn">
            <el-button type="info" plain>Amazon</el-button>
            <el-button type="info" plain>Eabay</el-button>
            <el-button type="info" plain>速卖通</el-button>
            <el-button type="info" plain>wish</el-button>
        </div>
        <div class="selectbox">
            <el-form :inline="true" :model="selectForm" class="demo-form-inline" size="medium">
                <el-form-item label="站点：">
                    <el-select v-model="selectForm.site">
                          <el-option label="一" value="1"></el-option>
                          <el-option label="二" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目：">
                    <el-select v-model="selectForm.category">
                          <el-option label="一" value="1"></el-option>
                          <el-option label="二" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板名称：">
                    <el-input v-model='selectForm.tempName'/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSelectSubmit()">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <p class="ml0">
            <el-button type="primary" size="mini">
                <router-link :to="{ name: 'uploading', params: {} }" tag='span'>导入模板</router-link>
            </el-button>
            <el-button type="primary" size="mini">批量导入模板</el-button>
        </p>

        <el-table class="tampTable" :data="tableData"  stripe  style="width: 100%" border>
            <el-table-column  prop="date"  label="模板名称"  width="224" align="center"/>
            <el-table-column  prop="name"  label="站点"  width="150" align="center">
                <template slot-scope="scope">
                    <img src="../icon/ebey.png" alt="" width="67" height="37">
                </template>
            </el-table-column>
            <el-table-column  prop="address" label="类别" align="center"></el-table-column>
            <el-table-column  prop="address" label="创建人" width="130" align="center"></el-table-column>
            <el-table-column  prop="address" label="增加时间" width="160" align="center"></el-table-column>
            <el-table-column  prop="address" label="更新人" width="160" align="center"></el-table-column>
            <el-table-column  prop="address" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text">查看</el-button>
                    <el-button type="text">删除</el-button>
                    <el-button type="text">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"  :page-size="1" layout="prev, pager, next, jumper" :total="10"/>
    </section>
</template>
<script>
export default {
    name:'templateManagement',
    data() {
        return {
            selectForm:{
                site:'',
                category:'',
                tempName:''
            },
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
        }]
        }
    },
    methods: {
        onSelectSubmit() {
            alert('select')
        }
    }

}
</script>

<style lang="scss">
    .templateManagement{
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
        .selectbox{
            margin:10px;
            padding:10px 15px;
            border: 1px solid rgb(220, 223, 230);
            border-radius: 4px;
            .el-form-item{
                margin-bottom: 0;
            }
        }
        .ml0{
            margin-left: 10px;
        }
        .tampTable{
            margin:10px 10px 0 10px;
        }
    }

</style>
