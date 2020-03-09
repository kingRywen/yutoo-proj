<template lang="html">

       <router-view></router-view>
        <!-- <yt-layout>
            <template slot="search">

                <yt-search/>

            </template>

            <template slot="btnRight">
                <el-button plain size="small">自定义列表展示</el-button>
            </template>

            <template slot="table">
                <yt-table :data="tableData" :border="true" :columns="propsArr"></yt-table>
            </template>
        </yt-layout> -->
</template>

<script type="text/javascript">
    // export default {
    //     data(){
    //         return {
    //             tableData: [{
    //               date: '2016-05-02',
    //               name: '王小虎',
    //               address: '上海市普陀区金沙江路 1518 弄',
    //               logo:"http://img-cdn2.luoo.net/pics/vol/5b790f6731f34.jpg!/fwfh/640x452",
    //               herf:'https://www.baidu.com/',
    //             }, {
    //               date: '2016-05-04',
    //               name: '王小虎',
    //               address: '上海市普陀区金沙江路 1517 弄',
    //               logo:"http://img-cdn2.luoo.net/pics/essays/201711/FpqE8HyEENYwLlzNzUdClb_wf2s2.jpg",
    //               herf:'https://www.baidu.com/',
    //             }, {
    //               date: '2016-05-01',
    //               name: '王小虎',
    //               address: '上海市普陀区金沙江路 1519 弄',
    //               logo:"http://img-cdn2.luoo.net/pics/essays/201711/FieYsdHdvHlsnCPjhiXxQwmx3BGL.jpg",
    //               herf:'https://www.baidu.com/',
    //             }, {
    //               date: '2016-05-03',
    //               name: '王小虎',
    //               address: '上海市普陀区金沙江路 1516 弄',
    //               logo:"http://img-cdn2.luoo.net/library/201804/FrpdMjG2GMO2eaIv_q5UCim8HjIh.jpg",
    //               herf:'https://www.baidu.com/',
    //               arr:[
    //                 {a:1},
    //                 {a:2},
    //               ]
    //             }],
    //             propsArr:[
    //                 {
    //                     children:'arr', //如数组传入的table数据对应Arr
    //                     label: "多个数组",
    //                     value:"a", // 数组里面需要显示的值
    //                     style:{
    //                         color:"red"
    //                     }
    //                 },
    //                 {
    //                     value: "logo", //table需要渲染的值
    //                     label: "LOGO",//表头
    //                     width: "300",//当前行宽度
    //                     img:true,   //如图片传
    //                     style:{     //图片宽高
    //                         width:80,
    //                         height:80
    //                     },
    //                     bulkyHeight:180 //鼠标hover图片高，宽度自动
    //                 },
    //                 {
    //                     value: "name",  //a链接显示的值
    //                     label: "姓名",
    //                     width: "300",
    //                     url:'herf', //如a链接table数据的跳转url
    //                     style:{
    //                         color:'#fff',
    //                         background:'green',
    //                     }
    //                 },
    //                 {
    //                     value: "date",
    //                     label: "时间",
    //                     width: "300"
    //                 },
    //                 {
    //                     value: "address",
    //                     label: "地址",
    //                     width: "300"
    //                 },
    //
    //             ],
    //         }
    //     }
    // }
</script>
