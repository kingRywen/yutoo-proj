<template>
    <div>
        <div class='top'>
            <div class='logo'>
                <div class='img' @click='$router.push("/dash")' style='cursor:pointer'>
                    <img  src="~@/assets/images/yutooPicture.png" key="1" height="65">
                </div>
                <div class='word'>
                    <span>邮箱授权</span> 
                    <span>帮助手册</span> 
                </div>
            </div>
            <div class='search'>
                <el-input v-model="input" placeholder="请输入内容" style='width: 80%;' size='large' type='text'>
                    <el-button slot="append" type="primary" icon="el-icon-search" style='font-size:22px;'></el-button>
                </el-input>
                <!-- <el-button type="primary" icon="el-icon-search" style='display: inline-block;' size='large'>搜索</el-button> -->
            </div>
        </div>
        <div class='cont'>
           <el-tabs tab-position="left" style="margin-left: 100px;margin-right: 100px;margin-top:60px;"  @tab-click='tabClick'  type="border-card">
                <el-tab-pane :label="item.name" v-for='item in emailList' :key='item.name'>
                    <div  class='right'>
                        <div class="crumbs">
                            <span>帮助文档</span> /
                            <span>{{spanHtml}}</span>
                        </div>
                        <div >
                            <component :is="componentId"></component>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
      
    </div>
</template>

<script>
import QQ from "./component/qq";
import outlook from "./component/outlook";
import oneSixThree from "./component/oneSixThree";
import sina from "./component/sina";
import yahoo from "./component/yahoo";
export default {

    data() {
        return {
            input:'',
            emailList:[
                {name:'QQ邮箱'},
                {name:'126/163邮箱授权'},
                {name:'outlook邮箱授权'},
                {name:'sina邮箱授权'},
                {name:'yahoo邮箱授权'},
            ],
            componentId: QQ,
            spanHtml:'QQ邮箱授权',
        };
    },
    methods: {
        tabClick(v){
            //console.log(v);
            let index = v.index *1 ;
            switch(index){
                case 0:
                   this.componentId =  QQ;
                   this.spanHtml = 'QQ邮箱授权';
                break;
                case 1:
                   this.componentId =  oneSixThree;
                   this.spanHtml = '126/163邮箱授权';
                break;
                case 2:
                   this.componentId =  outlook;
                   this.spanHtml = 'outlook邮箱授权';
                break;
                case 3:
                   this.componentId =  sina;
                   this.spanHtml = 'sina邮箱授权';
                break;
                case 4:
                   this.componentId =  yahoo;
                   this.spanHtml = 'yahoo邮箱授权';
                break;
                default:
                break;

            }

        },
    },
    created() {

    },
};
</script>

<style scoped lang="less">
.top{
    background-color: rgba(48, 204, 123, 1);
    height: 60px;
    .logo{
        float: left;
        width: 260px;
        margin-left: 100px;
        &>div{
            float: left;
        }
        .img{
            width: 160px;
            line-height: 60px;
            img{
                display: block;
                width: 100%;
                height: 60px;
            }
        }
        .word{
            width:56px;
            line-height: 30px;
            margin-left:6px;
            border-left: 1px solid white;
            padding-left:6px;
            color:white;
            height:100%;
        }
    }
    .search{
        margin-left: 300px;
        line-height: 60px;
    }
}
.cont{
    /deep/.right{
        margin-left: 20px;
        //border:1px solid #dcdcdc;
        .crumbs{
            line-height: 30px;
            &>span:last-child{
                color:#30CC7B
            }
        }
    }
}


</style>
