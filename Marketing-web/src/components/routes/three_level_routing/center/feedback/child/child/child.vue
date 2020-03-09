<!-- 1_tab -->
<template>
    <div>
        <div>
            <!-- {{data}} -->
            <el-card class="box-card" v-for="(item,index) in data.rows" v-if="data.show">
                <div slot="header" class="clearfix">
                    <el-checkbox :label="item.merchantFeedbackId"></el-checkbox>
                    <span>{{item.feedbackType===0?"产品建议":item.feedbackType===1?"程序错误":item.feedbackType===2?"操作疑问":"反馈内容"}}</span>
                    <span class="color_666" style="margin-left:20px;">{{item.createTime}}</span>
                </div>
                <div class="text item">
                    <div class="line">
                        {{item.feedbackContent}}
                    </div>

                    <div v-show="item.show_reply" class="line" style="margin-top:10px;color:#999;">
                        <div>
                            <span>回复时间 ：</span>
                            <span>{{item.replyTime}}</span>
                        </div>
                        <div style="margin-top:10px;">
                            {{item.replyContent}}
                        </div>
                    </div>
                    <div v-if="item.replyContent?true:false">
                        <el-button class="button" type="text" @click="data.showDetail(item,index,data.type)">{{item.btn}}</el-button>
                    </div>
                    <div v-else>
                        <el-button class="button" type="text" disabled>未回复</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
  props: ["data"],
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.line {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
</style>
