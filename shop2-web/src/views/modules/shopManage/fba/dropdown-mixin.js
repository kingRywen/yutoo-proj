export default {
  data() {
    return {
      isMount: false
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          // 生命周期管理
          this.$router.push({
            path: "/shopManage/fba/lifecycle"
          });
          break;
        case "b":
          // 运输方式
          this.$router.push({
            path: "/shopManage/fba/shipping"
          });
          break;
        case "c":
          // 补货记录
          this.$router.push({
            path: "/shopManage/fba/reprecord"
          });
          break;
        case "d":
          // 发货计划
          this.$router.push({
            path: "/shopManage/fba/plan"
          });
          break;

        case "e":
          // 设置滞销预警天数
          this.$_dialog({
            size: "medium",
            title: "设置滞销预警",
            params: {},
            cancelBtnText: "取消",
            okBtnText: "确认",
            component: () => import("./dialogs/warning.vue")
          });
          break;
        case "f":
          // FBA
          this.$router.push({
            path: "/shopManage/fba"
          });
          break;

        default:
          break;
      }
    }
  }
};
