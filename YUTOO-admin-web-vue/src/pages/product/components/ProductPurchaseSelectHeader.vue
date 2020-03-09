<template>
  <div>
    <v-data-table rowClickChecked :data='loadData' :columns='columns' check-type="checkbox" ref="table">
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='freightTime'">
          {{props.content}}天
        </div>
        <div v-else-if="props.column.field=='priceType'">
          {{props.content === 1 ? '按体积' : '按重量'}}
        </div>
        <div v-else-if="props.column.field=='col'">
          {{props.item.priceType !== 1 ? `长*宽*高/${props.item.productWeight}` : ''}}
        </div>
        <div v-else-if="props.column.field=='price'">
          {{`${props.item.freightPrice}${props.item.freightPriceUnit}/${props.item.freightPriceTypeUnit}`}}
        </div>
        <span v-else v-html="props.content"></span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { fetchData, showToast, handlerCode } from "common/common";
import apis from "apis";

export default {
  inheritAttrs: false,
  data() {
    let vm = this;
    return {
      loadData() {
        return fetchData({
          ...apis.TRANSPORT_FIRST_LIST,
          data: {
            productId: vm.$attrs.productId,
            sortOrder: "asc",
            pageSize: 10,
            pageNumber: 1
          }
        }).then(res => {
          if (!res.data.rows) {
            showToast("error", res.data.msg);
            return {
              result: []
            };
          }

          setTimeout(() => {
            res.data.rows.forEach((element, index) => {
              if (element.flag) {
                vm.$refs.table.setChecked(index, true);
              }
            });
          });

          return {
            result: res.data.rows,
            totalCount: res.data.total,
            pageSize: res.data.pageSize,
            pageNo: res.data.pageNo
          };
        });
      },
      columns: [
        {
          title: "国家",
          field: "nation"
        },
        {
          title: "运输方式",
          field: "freightType"
        },
        {
          title: "计价方式",
          field: "priceType"
        },
        {
          title: "体积/重量",
          field: "col"
        },
        {
          title: "费用",
          field: "price"
        },
        {
          title: "运输时间",
          field: "freightTime"
        }
      ]
    };
  },
  methods: {
    ok() {
      let vm = this;
      // debugger
      let transportFirstIds = this.$refs.table
        .getCheckedData()
        .map(el => el.transportFirstId);
      if (!transportFirstIds.length) {
        showToast("warning", "请至少选择一条数据");
        return;
      }
      fetchData({
        ...apis.PRODUCT_TRANSPORT_REL_SELECT,
        data: {
          transportFirstIds,
          productId: vm.$attrs.parentId || vm.$attrs.productId
        }
      }).then(res => {
        handlerCode(res, () => {
          vm.$listeners.set();
          vm.cancel();
        });
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
