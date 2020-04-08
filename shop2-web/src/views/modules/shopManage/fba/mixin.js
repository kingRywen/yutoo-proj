import dailyBox from "./components/dailyBox";
export default {
  components: {
    dailyBox
  },
  data() {
    return {
      // 选中的运输方式
      selectTran: {
        value: this.$route.query.transportId || null,
        label: this.$route.query.transportLabel || null
      },
      tranSelected: false
    };
  },
  watch: {
    "selectTran.value"(val) {
      let tranSelected = this.$refs.layout.tableList.filter(el => el._expanded);
      this.$refs.layout.clearSelection()
      this.$refs.layout.getList({ transportId: val }).then(() => {
        this.getVariant(tranSelected)
      })
    }
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
    handleRequestSuccess() {
      this.isMount = true
      if (this.tranSelected) {
        this.tranSelected = false
        this.getVariant(this.tranSelected);
      }
    },
    getVariant(expands) {
      if (expands.length && this.asyncFunc) {
        Promise.all(
          expands.map(e => {
            return this.asyncFunc(e);
          })
        ).then(res => {
          let tableList = this.$refs.layout.tableList;

          res.forEach(childs => {
            let p = tableList.find(e => e.asin == childs[0].parentAsin);
            p._expanded = true;
            this.$set(p, "childs", childs);
            // expands[index].childs = e;
          });
        });
      }
    },
    // 平均销量列渲染
    renderAva(h, scope, str) {
      let { salesAvg, avgSales } = scope.row;
      let num = str && typeof str === 'string' ? scope.row[str] : salesAvg || avgSales;
      if (num == null) {
        return <span>-</span>;
      }
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
          <dailyBox
            type={typeof str === "string" ? "salesDay" : "ava"}
            tableData={scope.row.__avaList}
          />
          <el-button slot="reference" type="text">
            {num}
          </el-button>
        </el-popover>
      );
    },
    renderSalesDay(h, scope) {
      return this.renderAva.call(this, h, scope, 'salesDay')
    },
    // 运输方式列渲染
    renderTrans(h, { column, $index }) {
      return (
        <div>
          <el-dropdown
            style="padding-left: 0"
            onCommand={command => {
              // console.log(command);
              if (this.$route.path == "/shopManage/fba/rep") {
                this.$router.replace({
                  path: this.$route.path,
                  query: {
                    ...this.$route.query,
                    transportId: command.value
                  }
                });
              }
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
          {this.$route.path !== "/shopManage/fba/rep" && this.selectTran.label && (
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
