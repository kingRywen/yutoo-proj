<template>
  <div>
    <el-page-header
      @back="goBack"
      :class="{'no-back': $attrs.view}"
      :content="$attrs.view ? '查看任务 （任务ID：'+ $route.query.id + '）' :$attrs.quick ? '快速发布任务' : $attrs.edit ? '编辑任务'  : '发布任务'"
    ></el-page-header>
    <!-- <div class="mt20 font14">
      平台
      <el-select style="margin-left: 6px" size="small" v-model="curPlat" placeholder="请选择平台">
        <el-option v-for="item in platSite" :key="item.code" :label="item.cnName" :value="item.code"></el-option>
      </el-select>
    </div>-->
    <component v-bind="$attrs" :platformSiteId="platformSiteId" :is="curPlat"></component>
  </div>
</template>
<script>
import amazon from './amazon'
import aliexpress from './aliexpress'
export default {
  name: 'addTask',
  components: {
    amazon,
    aliexpress
  },
  data() {
    return {
      curPlat: 'amazon',
      platformSiteId: 1
    }
  },
  computed: {
    platSite() {
      return this.$store.state.common.platSite
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>