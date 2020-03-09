<template>
  <div>
    <el-page-header v-if="!dialog" @back="$router.go(-1)" content="任务反馈"></el-page-header>

    <new-form label-width="80px" ref="form" class="mt20" :form-schema="formSchema" v-model="value"></new-form>
    <div class="txc" v-if="!dialog">
      <el-button type="primary" :loading="loading" @click="submitRep">提交反馈</el-button>
      <el-button type="primary" @click="$router.go(-1)" plain>返回</el-button>
    </div>
    <div v-if="feedbacks.length && !dialog" class="mt20" style="height: 20px;background: #f8f8f8;margin: 0 -20px"></div>
    <WidgetCardWrapper v-if="feedbacks.length" :isCollapse="false" :defaultHide="false" title="反馈记录">
      <div class="feedback mb10">
        <ul>
          <li class="feedback-item flex-t-b" v-for="(item, index) in feedbacks" :key="index">
            <div :class="['feedback-left', {'reply': item.type == 1}]">
              <div class="feedback-left__type">{{item.type == 0 ? '反馈' : '回复'}}</div>
              <div class="feedback-left__time">{{item.createTime}}</div>
            </div>
            <div class="feedback-mid">
              <el-input :value="item.content" :disabled="true" type="textarea" :rows="4"></el-input>
            </div>
            <div class="feedback-right">
              <ElButton v-if="!item.updateTime" @click="deleteRep(item)" type="text">删除</ElButton>
            </div>
          </li>
        </ul>
      </div>
    </WidgetCardWrapper>
  </div>
</template>

<script>
export default {
  props: ['dialog'],
  data() {
    return {
      taskSourceId: this.dialog
        ? this.$attrs.taskSourceId
        : +this.$route.query.taskSourceId,
      feedbacks: [],
      loading: false,
      formSchema: {
        content: {
          label: '反馈内容',
          required: true,
          max: 1024,
          widget: 'textarea',
          rows: 8,
          placeholder: '还能输入1024个字符'
        }
      },
      value: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api[`agent/taskSourceFeedbackList`]({
        id: this.taskSourceId
      }).then(data => {
        this.feedbacks = data.rows
      })
    },
    deleteRep(item) {
      this.showTips({ msg: '请确认是否删除？' }, () => {
        return this.$api[`agent/taskSourceFeedbackRemove`]({
          id: item.taskSourceFeedbackId
        }).then(() => this.getData())
      })
    },
    _submit() {
      return this.submitRep(true)
    },
    submitRep(go) {
      return this.$refs.form.validate().then(() => {
        this.loading = true
        return this.$api[`agent/taskSourceFeedbackSave`]({
          content: this.value.content,
          taskSourceId: this.taskSourceId
        }).then(() => {
          this.loading = false
          if (go) {
            return Promise.resolve(true)
          }
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.feedback {
  &-item {
    align-items: flex-start;
    margin-bottom: 20px;
  }
  &-mid {
    /deep/.el-textarea.is-disabled .el-textarea__inner {
      color: #333;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
  }
  &-left {
    font-size: 14px;
    text-align: right;
    margin-right: 10px;
    color: blue;
    &.reply {
      color: green;
    }
    &__type {
      text-align: right;
      margin-top: 8px;
    }
    &__time {
      margin-top: 0;
      text-align: right;
      font-size: 12px;
      color: #909399;
    }
  }
  &-mid {
    flex: 1;
  }
  &-right {
    line-height: 96px;
    margin-left: 10px;
  }
}
</style>

