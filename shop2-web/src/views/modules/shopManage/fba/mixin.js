import dailyBox from "./components/dailyBox";
export default {
  components: {
    dailyBox
  },
  data() {
    return {
      // 选中的运输方式
      selectTran: {}
    };
  },
  computed: {
    // 运输方式列表
    transportList() {
      return this.$store.state.fba.transportList;
    }
  },
  created() {
    this.$store.dispatch("fba/getTransportList");
  },
  methods: {
    // 平均销量列渲染
    renderAva(h, scope) {
      return (
        <el-popover
          trigger="hover"
          placement="top"
          onShow={() => {
            if (!scope.row.__hasAvaList) {
              const { storeId, sellerSku } = scope.row;
              let params = {
                storeId,
                sellerSku
              };
              this.$set(scope.row, "__loading", true);
              this.$api[`fba/FbaReplenishProductGetDailySales`](params).then(
                data => {
                  this.$set(scope.row, "__loading", false);
                  this.$set(scope.row, "__avaList", data.list);
                  this.$set(scope.row, "__hasAvaList", true);
                }
              );
            }
          }}
        >
          <dailyBox tableData={scope.row.__avaList} />
          <el-button slot="reference" type="text">
            {32}
          </el-button>
        </el-popover>
      );
    },
    // 运输方式列渲染
    renderTrans(h, { column, $index }) {
      return (
        <div>
          <el-dropdown
            style="padding-left: 0"
            onCommand={command => {
              console.log(command);
              this.selectTran = command;
            }}
          >
            <span class="el-dropdown-link">
              {this.selectTran.label || "运输方式"}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              {this.transportList.map(e => (
                <el-dropdown-item command={e}>{e.label}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          {this.selectTran.label && (
            <el-tag
              size="mini"
              type="warning"
              closable
              on-close={() => {
                this.selectTran = {};
              }}
            >
              清空
            </el-tag>
          )}
        </div>
      );
    }
  }
};
