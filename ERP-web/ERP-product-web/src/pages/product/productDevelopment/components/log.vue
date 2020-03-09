<template>

  <div>
    <v-form v-if="$attrs.type === 'baseProduct'">
      <v-form-item label="操作时间">
        <el-date-picker style="width:100%;max-width:430px" type="datetimerange" :default-time="['00:00:00', '23:59:59']" size="small" start-placeholder="开始日期" end-placeholder="结束日期" v-model="form.createTime" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <!-- <v-date-picker v-model="form.createTime" range size="lg"></v-date-picker> -->
      </v-form-item>
      <v-form-item label="操作内容">
        <v-input placeholder="" v-model="form.updateValue"></v-input>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="search">搜索</v-button>
      </v-form-item>
    </v-form>
    <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" class="margin-top-25">
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='updateValue_base' && props.item.logDataEntity">
          {{props.item.logDataEntity.desc}}
          <el-tooltip v-if="props.item.logDataEntity.dataList" effect="light" placement="top-start" :open-delay="500">
            <div slot="content">
              <p style="line-height:2" v-for="data in props.item.logDataEntity.dataList">修改字段: {{data.key}}, 旧值: {{data.oldData}}, 新值: {{data.newData}}</p>
            </div>
            <span>
              <i class="iconfont __editBtns" style="cursor:pointer" v-html="`&#xe78f;`"></i>
            </span>

          </el-tooltip>
        </div>
        <div v-else-if="props.column.field=='SKU' && props.item.logDataEntity">
          {{props.item.logDataEntity.sku}}
        </div>
        <span v-else v-html="props.content"></span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";

export default {
  inheritAttrs: false,
  created() {
    if (this.$attrs.type === "baseProduct") {
      this.columns = [
        {
          title: "操作时间",
          field: "createTime",
          width: "160px"
        },
        {
          title: "操作者",
          field: "createName",
          width: "160px"
        },
        {
          title: "SKU",
          field: "SKU",
          width: "160px"
        },
        {
          title: "操作内容",
          field: "updateValue_base"
        }
      ];
    }
  },
  data() {
    let vm = this;
    const { type, item } = vm.$attrs;
    const { productId } = item;
    return {
      lists: data => {
        if (type === "baseProduct") {
          data.pageNumber = data.pageNo;
          delete data.pageNo;
          delete data.sortColumns;
          let reqData = Object.assign(
            {},
            data,
            {
              sortOrder: "asc",
              productId
            },
            vm.searchData
          );

          for (const key in reqData) {
            if (reqData.hasOwnProperty(key)) {
              const element = reqData[key];
              if (element === "" || element == null) {
                delete reqData[key];
              }
            }
          }

          let opts = Object.assign(
            {},
            {
              method: "post",
              url: "/product/log/list"
            },
            { data: reqData }
          );

          return fetchData(opts).then(res => {
            let data = res.data.rows;
            console.log(data);
            return {
              result: data.rows,
              totalCount: data.total,
              pageSize: data.pageSize,
              pageNo: data.pageNo
            };
          });
        } else {
          data.pageNumber = data.pageNo;
          delete data.pageNo;
          let reqData = Object.assign({}, data, this.params);

          let opts = Object.assign(
            {},
            { ...apis.PRODSRCDEVELOPLOG_LIST },
            { data: reqData }
          );

          return fetchData(opts).then(res => {
            let data = res.data;
            console.log(data);
            return {
              result: data.rows,
              totalCount: data.total,
              pageSize: data.pageSize,
              pageNo: data.pageNo
            };
          });
        }
      },
      form: {
        createTime: []
      },
      params: {
        sortOrder: "asc",
        srcType: 1,
        srcId: this.$attrs.item.sourceId
      },
      searchData: {},
      pageNo: 1,
      pageSize: 10,
      columns: [
        {
          title: "操作时间",
          field: "modifyTime"
        },
        {
          title: "操作者",
          field: "nickName"
        },
        {
          title: "操作内容",
          field: "logDesc"
        }
      ],
      treeOption: {
        isAsync: true
      }
      // tableData: []
    };
  },
  methods: {
    search() {
      const { createTime, updateValue } = this.form;
      const [startTime, endTime] = createTime || [];
      this.searchData = {
        updateValue,
        startTime,
        endTime
      };
      this.$refs.table.refresh();
    },
    ok() {
      // this.$listeners.set(this);
      this.cancel();
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
