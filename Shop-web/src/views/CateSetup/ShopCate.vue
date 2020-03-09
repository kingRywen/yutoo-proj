<!--  -->
<template>
  <div class="___common">
    <template>
      <!-- {{siteList}} -->
      <el-search :search="search" :clearfield="clearfield" :clearSearch.sync="clearSearch"></el-search>
    </template>
    <template>
      <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
    </template>
    <template>
      <el-table
        class="custom-eltable"
        ref="Table"
        @selection-change="handleSelectionChange"
        @select="selectMethod"
        :data="table.rows"
        style="width: 100%"
        :row-class-name="rowClassName"
        border
        stripe
        row-key="cusCateId"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" align="center"></el-table-column>
        <el-table-column prop="cusCateId" label="类目ID" width="70" align="center"></el-table-column>
        <el-table-column prop="cusCateName" label="类目名称" width="600">
          <template slot-scope="scope">
            <!-- <i class="__common__space" :style="{width:35*scope.row.floor+'px'}"></i> -->
            <div :style="{ paddingLeft: (scope.row.floor - 1) * 20 + 'px' }">
              <el-button
                type="text"
                icon="el-icon-caret-right"
                v-if="scope.row.childList&&!scope.row.childShow"
                @click="listShowChildCate(scope)"
              ></el-button>
              <el-button
                v-if="scope.row.childList&&scope.row.childShow"
                type="text"
                icon="el-icon-caret-bottom"
                @click="listHiddenChildCate(scope)"
              ></el-button>
              <ElButton
                type="text"
                icon="el-icon-caret-bottom"
                v-if="!scope.row.childList || !scope.row.childList.length"
                :style="{visibility: 'hidden'}"
              ></ElButton>
              <span v-if="scope.row.highlight" v-html="scope.row.cusCateName"></span>
              <span v-else>{{scope.row.cusCateName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="returnRate" label="退货率预警值">
          <template slot-scope="scope">{{percentMethod(scope.row.returnRate)}}</template>
        </el-table-column>
        <el-table-column prop="handle" label="操作">
          <template slot-scope="scope">
            <!-- <el-tooltip
              class="item"
              effect="light"
              content="编辑"
              :open-delay="200"
              placement="top-start"
              :enterable="false"
            >
              <el-button class="__icon" type="text" icon="el-icon-edit-outline" @click="edit__(scope.row,'edit')"></el-button>
            </el-tooltip>-->
            <!-- 底层映射不能新增下级 -->
            <el-tooltip
              :open-delay="200"
              v-if="scope.row.haveChildren===0?false:true"
              class="item"
              effect="light"
              content="新增下级"
              placement="top-start"
              :enterable="false"
            >
              <el-button class="__icon" type="text" icon="el-icon-circle-plus-outline" @click="add__(scope.row)"></el-button>
            </el-tooltip>
            <!-- <el-tooltip v-else class="item" effect="light" content="已是底层类目，不能新增下级" placement="top-start" :enterable="false">
              <el-button :disabled="true" class="__icon" type="text" icon="el-icon-circle-plus-outline" @click="add__(scope.row)"></el-button>
            </el-tooltip>-->
            <el-tooltip
              :open-delay="200"
              class="item"
              effect="light"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button class="__icon" type="text" icon="el-icon-delete" @click="delete__(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 添加产品 -->
    <el-dialog-yt :options="options" :events="events">
      <div class="box __box_wrapper">
        <!-- {{this.form.customCategoryMapList}} -->
        <el-form size="small" :model="form" :rules="rules" ref="ruleForm">
          <el-form-item label="选择类目" prop="ids" label-width="70px" style="width:100%;">
            <div class="flex">
              <el-cascader
                placeholder="搜索/选择类目"
                :options="handlerType ? childrenCate : platCate"
                :show-all-levels="true"
                :props="form.props"
                v-model="form.ids"
                change-on-select
                style="width:90%;"
                size="small"
                :filterable="table.filterable"
              ></el-cascader>
              <ElButton
                v-if="!handlerType"
                class="ml10"
                size="small"
                type="text"
                @click="$router.push('/cate/CateSetup')"
              >添加更多平台类目</ElButton>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog-yt>
    <!-- 亚马逊类目单独弹窗 -->
    <el-dialog-yt :options="options_cate" :events="events_cate">
      <!-- {{form_cate}} -->
      <el-form :model="form_cate" :rules="rules_cate" ref="ruleForm_cate" style="width:94%;">
        <el-form-item prop="category" style="width:100%;margin-bottom:15px">
          <el-cate
            width="100%"
            :Cate.sync="form_cate.category"
            @way="handleWay"
            :HaveChildform.sync="form_cate.haveChildren"
            :CategoryId.sync="form_cate.pcid"
          ></el-cate>
        </el-form-item>
      </el-form>
    </el-dialog-yt>

    <!-- 批量设置 -->
    <el-dialog-yt :options="options_warning" :events="events_warning">
      <!-- {{form_cate}} -->
      <el-form :model="form_warning" :rules="rules_warning" ref="ruleForm_warning" style="width:94%;">
        <el-form-item label="退货率预警值" prop="returnRate" :label-width="formLabelWidth" style="width:100%;">
          <el-input v-model.number="form_warning.returnRate" placeholder="请输入退货率预警值" style="width:90%" size="mini"></el-input>%
        </el-form-item>
      </el-form>
    </el-dialog-yt>
  </div>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      addTask: this.addTask,
      deleteTask: this.deleteTask,
      WarningMethod: this.WarningMethod,
      resetFields_add: this.resetFields_add
    }
  },
  data() {
    //   类目校验
    var category_validate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择类目'))
      } else {
        this.$nextTick(() => {
          if (this.form_cate.haveChildren !== 0) {
            callback(new Error('请选择最后一级类目'))
          } else {
            callback()
          }
        })
      }
    }
    var checkPersent = (rule, value, callback) => {
      if (!value) {
        // return callback(new Error('请填写退货率预警值'));
        callback()
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 100 || value < 0) {
            callback(new Error('请输入0-100的数字'))
          } else {
            callback()
          }
        }
      })
    }
    return {
      childrenCate: [],
      platCate: [],
      clearfield: ['cusCateName', 'date'],
      showAmazonCate: false,
      // 搜索
      search: {
        cusCateName: true,
        date: true
      },
      searchName: '',
      clearSearch: null,
      // 控件
      hander: {
        addTask: true,
        addButton: '添加店铺类目',
        deleteCate: true,
        returnRateWarning: true
      },
      handlerType: null,
      // 添加任务，编辑任务
      formLabelWidth: '100px', //label宽度
      options: {
        loading: false,
        visible: false,
        width: '500px',
        title: '添加店铺类目',
        URL: 'customCategoryAttention', // 添加还是编辑
        okBtnText: '确认'
      },
      events: {
        handleOkClick: this.addTask,
        open: () => {
          this.getList({ plat: true })
        }
      },
      form: {
        cateWidth: '100%',
        haveChildren: false,
        ids: [],
        haveChildCateData: [],
        cusCateName: '',
        returnRate: null,
        siteIds: [],
        customCategoryMapList: [],
        // 保存输入过的
        customCategoryMapList_copy: [],
        props: {
          value: 'cusCateId',
          children: 'childList',
          label: 'cusCateName'
        }
      },
      rules: {
        ids: [
          {
            required: true,
            message: '请选择要添加的类目',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 添加修改监控end
      // 亚马逊类目单独弹窗
      //   formLabelWidth: "110px", //label宽度
      options_cate: {
        loading: false,
        visible: false,
        width: '500px',
        title: '添加店铺类目',
        okBtnText: '确认'
        // resetFields: () => {
        //   // todo
        //   this.$refs.ruleForm_cate.resetFields();
        // }
      },
      events_cate: {
        handleOkClick: this.handler_Amazon_cate,
        close: () => {
          this.$nextTick(() => {
            this.$refs.ruleForm_cate.clearValidate()
          })
        }
      },
      // 点击选择亚马逊类目的时候暂时存放当前数据,赋值在此，index用于找到给哪个form.customCategoryMapList赋值pcid
      form_cate: {
        key: null,
        haveChildren: null,
        category: null,
        pcid: null
      },
      // 点击选择亚马逊类目的时候暂时存放当前数据,赋值在此，index用于找到给哪个form.customCategoryMapList赋值pcid //end
      rules_cate: {
        category: [
          {
            required: true,
            message: '请选择类目',
            trigger: ['blur', 'change']
          },
          { validator: category_validate, trigger: ['blur', 'change'] }
        ]
      },
      form_warning: {
        returnRate: null
      },
      options_warning: {
        loading: false,
        visible: false,
        width: '500px',
        title: '批量设置退货率预警值',
        okBtnText: '确认',
        resetFields: () => {
          this.$refs.ruleForm_warning.resetFields()
        }
      },
      events_warning: {
        handleOkClick: this.handler_Amazon_warning,
        close: () => {
          this.$nextTick(() => {
            this.$refs.ruleForm_warning.resetFields()
          })
        }
      },
      rules_warning: {
        returnRate: [
          {
            validator: checkPersent,
            trigger: 'blur'
          }
        ]
      },

      // 亚马逊类目单独弹窗end
      // 表格
      table: {
        loading: false,
        rows: [],
        count: 0,
        pre_item: null,
        filterable: true
      },
      userSelect: [],
      dialogTable: [],
      // 选择上级类目的时候，根据选出的id（vuex取），取this.table
      el: [],
      copy_rows: '',
      oldDataArr: [],
      allRowsArr: []
    }
  },

  created() {
    this.$store.commit('common/siteId__', 1)
    // 类目设置不用发siteId
    if (this.sellerId) {
      this.getList()
    }
  },
  mounted() {},
  methods: {
    rowClassName({ row }) {
      if (row.floor > 1) {
        return 'child'
      }
    },
    selectMethod(e, row) {
      let vm = this
      if (!row.childShow) {
        if (row.childList) {
          fn(row.childList)
          function fn(data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].childList) fn(data[i].childList)
              vm.$refs.Table.toggleRowSelection(data[i])
            }
          }
        }
      }
    },
    WarningMethod() {
      this.options_warning.visible = true
    },
    handler_Amazon_warning() {
      let data = this.userSelect.map(el => el.cusCateId)
      let params = {
        sellerId: this.sellerId,
        cusCateIds: data,
        returnRate: this.form_warning.returnRate
          ? this.form_warning.returnRate / 100
          : null
      }
      this.$api['customCategorySaveReturnRate'](params).then(res => {
        this.options_warning.visible = false
        this.getList()
      })
    },
    percentMethod(point) {
      if (point == 0 || point) {
        var percent = Number(point * 100).toFixed()
        percent += '%'
        return percent
      } else {
        return '-'
      }
    },
    handleWay() {
      setTimeout(() => {
        this.$nextTick(() => this.$refs.ruleForm_cate.clearValidate())
      })
    },
    // 列表
    getList(arg = {}) {
      
      let vm = this
      function getEl(arr) {
        arr.forEach(el => {
          if (el.cusCateId === vm.nextArg.cusCateId) {
            vm.childrenCate = el.childList || []
            return false
          } else {
            if (el.childList) {
              getEl(el.childList)
            }
          }
        })
      }
      let params = {
        sellerId: this.sellerId
      }
      console.log(params);
      
      if (arg.plat) {
        params = {}
      }
      // 如果搜索了分类名称，则记录分类名称，用于搜索结果高亮
      if (arg.cusCateName) {
        this.searchName = arg.cusCateName
        params.cusCateName = arg.cusCateName
      } else {
        this.searchName = ''
      }
      // 如果与日期，要分开赋值
      if (arg.date) {
        params.startTime = arg.date[0]
        params.endTime = arg.date[1]
      }
      params = this.$.dealObjectValue(params)
      if (params.pageSize) {
        delete params.pageSize
      }
      if (params.pageNumber) {
        delete params.pageNumber
      }
      if (!params.haveChildren && !arg.plat) {
        // 不传haveChildren代表是获取列表，传haveChildren为1表示获取的是可添加下级目录的上级目录集合
        this.table.loading = true
      }
      return this.$api['CustomCategoryList'](params)
        .then(data => {
          this.table.loading = false
          if (arg.plat) {
            this.platCate = JSON.parse(JSON.stringify(data.data))

            if (this.handlerType) {
              getEl(data.data)
            }
            return
          }
          if (!params.haveChildren) {
            // 不传haveChildren代表是获取列表，传haveChildren为1表示获取的是可添加下级目录的上级目录集合
            this.table.rows = JSON.parse(JSON.stringify(data.data))
            // console.log(this.table.rows, "rows");
            let rows = this.table.rows
            // 重置一下pre_ite
            if (rows) {
              // 这一步特别重要，每次都要把最后一项设为上一项
              this.form.pre_item = rows[rows.length - 1]
              this.table.rows.forEach(item => {
                item.floor = 1
              })
              // 如果搜索了名称，则要高亮
              if (this.searchName) {
                this.findSearNameIndex(this.table.rows, this.searchName)
              }
            }
            // console.log(rows, "rows");
            // 递归赋值第几层
            this.findFloor(this.table.rows)
            this.oldData = JSON.parse(JSON.stringify(this.table.rows))
            // end
            // 往数据中的每一项，插入递归第几层，用于距离左边的宽度
          } else {
            // 不传haveChildren代表是获取列表，传haveChildren为1表示获取的是可添加下级目录的上级目录集合
            this.form.haveChildCateData = data.data
          }
          return true
        })
        .catch(err => {
          this.table.loading = false
          console.log(err)
          return true
        })
    },
    // 整理出所有的项
    // allRows(rows, newArr) {
    //   rows.forEach(el => {
    //     newArr.push(el);
    //     if (el.childList && el.childList.length > 0) {
    //       this.allRows(el.childList, newArr);
    //     }
    //   });
    // },
    // 找到搜索的名称所在项，并标记表示渲染时要高亮
    findSearNameIndex(rows, searchName) {
      rows.forEach((item, index) => {
        let isIn = item.cusCateName.indexOf(searchName)
        if (isIn !== -1) {
          item.highlight = true
          let regExp = new RegExp(searchName, 'gm')
          let newStr = `<span class="highlight-text">${searchName}</span>`
          item.cusCateName = item.cusCateName.replace(regExp, newStr)
        }
        if (item.childList && item.childList.length > 0) {
          this.findSearNameIndex(item.childList, searchName)
        }
      })
      // console.log(rows, "高亮后");
    },
    // 递归第几层
    findFloor(arr) {
      for (let i = 0; i < arr.length; i++) {
        // 当前
        let curr = arr[i]
        // 上一项，默认传进来根的最后一项
        let prev = this.form.pre_item
        if (curr.floor) {
          // 如果有floor则继续
          continue
        } else {
          // 如果没有floor，则判断
          if (curr.parentCusCateId === prev.parentCusCateId) {
            // 如果是同一层，则floor相同
            curr.floor = prev.floor
          } else {
            // 如果不同一层，则使用+1
            curr.floor = prev.floor + 1
            this.form.pre_item = curr
          }
        }
      }
      if (arr[arr.length - 1].floor) {
        // forEach同时进行每项的每一层
        arr.map(el => {
          // 这一步特别重要，每次都要把最后一项设为上一项
          this.form.pre_item = arr[arr.length - 1]
          if (el.childList) {
            this.findFloor(el.childList)
          }
        })
      }
    },
    // 显示表格子类目
    listShowChildCate(scope) {
      //   console.log(scope.row.childList);
      let index = scope.$index
      let child = scope.row.childList
      let item = this.table.rows[index]
      item.childShow = true
      this.table.rows.splice(index, 1, item)
      if (child) {
        // console.log(index);
        // console.log(child);
        this.table.rows.splice(index + 1, 0, ...child)
        this.copy_rows = JSON.parse(JSON.stringify(this.table.rows))
      }
    },
    // 收起列表
    async listHiddenChildCate(scope) {
      try {
        //   console.log(scope.row.childList);
        let index = scope.$index
        let child = scope.row.childList
        let item = this.table.rows[index]
        //   console.log(item, "item");
        this.table.count += this.table.rows[index].childList.length
        if (child) {
          // console.log(index);
          // console.log(child);
          let delOld = this.deOld(child)
          if (delOld) {
            let c = await this.childShowCount(child)
            // console.log(c);
            if (c) {
              let set = this.setChildShow(child)
              if (set) {
                this.table.rows.splice(index + 1, c)
                this.copy_rows = JSON.parse(JSON.stringify(this.table.rows))
                // console.log(this.table.rows);
              }
            }
          }
        }
        item.childShow = false
        this.table.count = 0
        // 改变了childShow是为了判断展示加号还是减号
        this.table.rows.splice(index, 1, item)
        this.copy_rows = JSON.parse(JSON.stringify(this.table.rows))
      } catch (err) {
        console.log(err)
      }
    },
    // 收起前删除isOld
    deOld(arr) {
      let len = arr.length
      if (arr) {
        for (let i = 0; i < len; i++) {
          // console.log(child[i]);
          if (arr[i].childList) {
            delete arr[i].isOld
            this.deOld(arr[i].childList)
            continue
          }
        }
      }
      return true
    },
    // 收起的时候递归查找有几个childShow是true的，就删除几个
    childShowCount(arr) {
      if (arr) {
        let len = arr.length
        for (let i = 0; i < len; i++) {
          // console.log(child[i]);
          if (arr[i].childList && arr[i].childShow === true && !arr[i].isOld) {
            arr[i].isOld = true
            this.table.count += arr[i].childList.length
            this.childShowCount(arr[i].childList)
            continue
          }
        }
      }
      return this.table.count
    },
    // 收起的时候设置被收起的项的childShow为false
    setChildShow(arr) {
      let len = arr.length
      if (arr) {
        for (let i = 0; i < len; i++) {
          // console.log(child[i]);
          if (arr[i].childList && arr[i].isOld === true) {
            arr[i].childShow = false
            this.setChildShow(arr[i].childList)
            continue
          }
        }
      }
      return true
    },
    // 添加
    addTask() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let params = {
            sellerId: this.sellerId, //上线要改
            cusCateIds: [this.form.ids.slice().pop()]
          }
          console.log(params)
          params = this.$.dealObjectValue(params)
          this.addFun(params)
        }
      })
    },
    addFun(params) {
      this.options.loading = true // 按钮loading;
      if (this.handlerType === false) {
        params.cusCateId = this.options.editId
      }
      this.$api[this.options.URL](params)
        .then(data => {
          this.options.loading = false
          this.options.visible = false // 关闭弹窗
          this.$nextTick(() => {
            this.reset()
            // this.getList()
            if (this.options.URL === 'customCategoryAttention') {
              this.clearSearch = new Date().getTime()
            }
          })
        })
        .catch(err => {
          console.log(err, 'err')
          this.options.loading = false
        })
    },
    // change_
    change_(val) {
      let _val = JSON.parse(JSON.stringify(val))
      if (_val.length > 0) {
        let arr = []
        for (let i = 0; i < _val.length; i++) {
          // console.log(_val[i]);
          // console.log(this.siteList, "this.siteList");
          let item = this.siteList.find(el => {
            return el.siteId === _val[i]
          })
          // console.log(item, "item");
          if (item) {
            let id = item.siteId
            console.log(
              this.form.customCategoryMapList_copy,
              'this.form.customCategoryMapList_copy'
            )
            let copy_item = this.form.customCategoryMapList_copy.find(el => {
              return el.siteId === id && el.category
            })
            if (copy_item) {
              arr.push(copy_item)
            } else {
              arr.push(item)
            }
          }
        }
        this.form.customCategoryMapList = arr
      }
    },

    // 清理表单
    resetFields_add() {
      this.showAmazonCate = false
      this.reset()
      this.options.title = '添加类目'
      this.options.URL = 'customCategoryAttention'
      this.form.siteIds = []
      this.handlerType = false
      this.form.customCategoryMapList = []
    },
    reset() {
      this.$set(this.form, 'cusCateName', '')
      this.$set(this.form, 'ids', [])
      this.$refs['ruleForm'].resetFields() //清除数据记录
      if (this.$refs['ruleForm_cate']) {
        // 要if一下因为添加的时候没有勾上底层类目
        this.$refs['ruleForm_cate'].resetFields() //清除数据记录
      }
      this.$set(this.form, 'haveChildren', null)
      this.form.siteIds = []
      this.form.customCategoryMapList_copy = []
      this.table2.map(el => {
        delete el.category
        return el
      })
      //   console.log(this.table2, "this.table2");
    },
    // 删除
    deleteTask(arg) {
      let params = { cusCateIds: arg }
      params.sellerId = this.sellerId
      return this.$api['customCategoryUnsubscribe'](params)
        .then(data => {
          if (data.code === 0) {
            this.getList()
            this.$refs.Table.clearSelection()
          } else {
            return false
          }
        })
        .catch(data => {
          if (data.usedList && data.usedList.length) {
            let reg = new RegExp(':', 'g')
            let newName = data.usedList[0].cateFullName.replace(reg, '/')
            setTimeout(() => {
              this.$confirm(
                `${newName}类目在关键词库已使用不能被删除,是否去关键词库删除该词？`,
                '提示',
                { type: 'warning' }
              )
                .then(() => {
                  this.$router.push({
                    name: 'keyLexiconKey',
                    query: { cusCateIds: data.usedList[0].cusCateId }
                  })
                })
                .catch(() => {})
            }, 500)
            // eslint-disable-next-line no-empty
          } else {
            this.$message.error(data.msg)
          }
        })
    },
    // 单条编辑
    edit__(arg, handlerType) {
      // console.log(this.$refs.Table)
      // this.$refs.Table.toggleRowExpansion(arg,true)
      // console.log(handlerType);
      // 如果时新增下级，则不能对上级目录进行操作，需要disabled
      if (handlerType === 'add') {
        // alert(1);
        this.options.title = '新增下级'
        this.options.URL = 'customCategoryAttention'
        this.handlerType = true
      }
      this.options.visible = true
      this.$nextTick(() => {
        this.reset()
        // this.setParams(arg.cusCateId, handlerType)
      })
      //   this.$message.warning("功能开发中");
    },
    // 请求设置编辑参数
    setParams(cusCateId, handlerType) {
      let params = {
        cusCateId: cusCateId
      }
      this.$api['CustomCategoryInfo'](params).then(data => {
        // console.log(data, "编");
        let res = data.data
        // 上级类目
        if (handlerType === 'edit') {
          // 编辑才给这项赋值
          this.form.cusCateName = res.cusCateName
          if (res.returnRate || res.returnRate == 0) {
            this.form.returnRate = res.returnRate * 100
            this.form.returnRate = this.form.returnRate.toFixed()
            this.form.returnRate = parseInt(this.form.returnRate)
          }
          if (res.changeFlag === 1) {
            this.showAmazonCate = true
            // 是底层类目则不能选中亚马逊类目去编辑了
          } else {
            this.showAmazonCate = false
          }
          // console.log("编辑");
          // 编辑的时候显示的上级类目
          if (res.parentCusCateId !== 0) {
            //   console.log(this.form.haveChildCateData, "haveChildCateData");
            let item = this.findParentLast(this.table.rows, res.parentCusCateId)
            if (item) {
              // console.log(item, "item");
              // ids的最后一个，要拼接成【7，8，6】这种
              let lastId = item.cusCateId
              this.form.ids = [item.cusCateId] // 拿到最后一个id进去
              this.findParent(this.table.rows, lastId)
              this.form.ids.reverse()

              // todo
              // this.form.ids = [item.cusCateId];
              // console.log(this.form.ids, "this.form.ids");
            }
          }
        } else {
          //add 添加不需要置灰
          // if (res.changeFlag === 0) {
          //   // 是底层类目则不能选中亚马逊类目去编辑了
          //   this.showAmazonCate = false;
          // } else if (res.changeFlag === 1) {
          //   this.showAmazonCate = true;
          // }
          // console.log("新增");
          if (res.parentCusCateId !== 0) {
            let item = this.add_findParentLast(
              this.table.rows,
              res.parentCusCateId
            )
            if (item) {
              // console.log(item, "item");
              // ids的最后一个，要拼接成【7，8，6】这种
              let lastId = item.cusCateId
              this.form.ids = [item.cusCateId] // 拿到最后一个id进去
              this.add_findParent(this.table.rows, lastId)
              this.form.ids.reverse()
              this.form.ids.push(res.cusCateId)

              // this.form.ids = [item.cusCateId];
              // console.log(this.form.ids, "this.form.ids");
            }
          } else {
            this.form.ids = [res.cusCateId]
          }
        }

        // 是否底层
        if (res.haveChildren === 1) {
          this.form.haveChildren = false
        } else {
          this.form.haveChildren = true
        }
        // 是否映射的站点
        // 编辑才默认映射
        if (res.mapList) {
          // form.customCategoryMapList
          this.form.siteIds = []
          this.form.customCategoryMapList = []
          res.mapList.forEach(item => {
            item.category = item.productCatePath
            item.siteName = item.siteName.replace(/站/, '')
            this.siteList.forEach(i => {
              if (i.siteId === item.siteId) {
                this.form.customCategoryMapList.push(item)
                this.form.siteIds.push(i.siteId)
                this.form.customCategoryMapList_copy.push(item)

                // console.log(this.form.siteIds, "this.form.siteIds");
              }
            })
          })
          // 复制一份
          this.customCategoryMapList_copy = JSON.parse(
            JSON.stringify(this.form.customCategoryMapList)
          )
        }
      })
    },
    // 使用递归查找上级目录的最后一个id
    findParentLast(arr, parentCusCateId) {
      // console.log(arr, "arr");
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].cusCateId === parentCusCateId) {
            // console.log(arr[i], "val");
            return arr[i]
          } else {
            if (arr[i].childList) {
              this.findParentLast(arr[i].childList, parentCusCateId)
            }
          }
        }
      }
    },
    // 根据上级最后一个id，寻找一整个[7,5,6]这种
    findParent(arr, lastId) {
      //   console.log(arr, "arr");
      //   console.log(lastId, "lastId");
      if (arr) {
        arr.forEach(el => {
          if (el.cusCateId === lastId) {
            // 找到最后一个id的父，则添加到this.form.ids，最后要倒序一下
            this.form.ids.push(el.parentCusCateId)
            // console.log(this.form.ids, "this.form.ids");
            if (el.parentCusCateId !== 0) {
              // 如果不是找到顶级，则继续把整个arr放进去再找
              this.findParent(arr, this.form.ids[this.form.ids.length - 1])
            }
          }
        })
      }
    },
    // 新增下级 使用递归查找上级目录的最后一个id
    add_findParentLast(arr, parentCusCateId) {
      // console.log(arr, "arr");
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].cusCateId === parentCusCateId) {
            // console.log(arr[i], "val");
            return arr[i]
          } else {
            if (arr[i].childList) {
              this.add_findParentLast(arr[i].childList, parentCusCateId)
            }
          }
        }
      }
    },
    // 新增下级 根据上级最后一个id，寻找一整个[7,5,6]这种
    add_findParent(arr, lastId) {
      //   console.log(arr, "arr");
      //   console.log(lastId, "lastId");
      if (arr) {
        arr.forEach(el => {
          if (el.cusCateId === lastId) {
            // 找到最后一个id的父，则添加到this.form.ids，最后要倒序一下
            this.form.ids.push(el.parentCusCateId)
            // console.log(this.form.ids, "this.form.ids");
            // 如果不是找到顶级，则继续把整个arr放进去再找
            this.add_findParent(arr, this.form.ids[this.form.ids.length - 1])
          }
        })
      }
    },
    // 单条新增
    add__(arg) {
      //debugger
      // this.$message.warning("功能开发中");

      this.showAmazonCate = false
      this.nextArg = arg
      this.edit__(arg, 'add')
    },
    // 单条删除todo
    delete__(arg) {
      this.$confirm('此操作将删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            sellerId: this.sellerId,
            cusCateIds: [arg.cusCateId]
          }
          this.$api['customCategoryUnsubscribe'](params)
            .then(data => {
              if (data.code === 0) {
                let param = {
                  pageSize: 10,
                  pageNumber: 1
                }
                this.getList(param)
                this.$refs.Table.clearSelection()
              } else {
                return false
              }
            })
            .catch(data => {
              if (data.usedList && data.usedList.length) {
                let reg = new RegExp(':', 'g')
                let newName = data.usedList[0].cateFullName.replace(reg, '/')
                setTimeout(() => {
                  this.$confirm(
                    `${newName}类目在关键词库已使用不能被删除,是否去关键词库删除该词？`,
                    '提示',
                    { type: 'warning' }
                  )
                    .then(() => {
                      this.$router.push({
                        name: 'keyLexiconKey',
                        query: { cusCateIds: data.usedList[0].cusCateId }
                      })
                    })
                    .catch(() => {})
                }, 500)
                // eslint-disable-next-line no-empty
              } else {
                this.$message.error(data.msg)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已放弃本次操作'
          })
        })
      // this.$message.warning("功能开发中");
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val
    },
    // 递归寻找与选中的id===cusCateId的某项
    findItem(arr, id) {
      if (id) {
        arr.forEach(el => {
          if (el.cusCateId === id) {
            // debugger;
            // console.log(el, "el");
            this.el = el
            return
          } else {
            if (el.childList && el.childList.length > 0) {
              //   debugger;
              this.findItem(el.childList, id)
            }
          }
        })
      }
    },
    // 选择亚马逊类目
    showCate(scope) {
      //   console.log(scope, "scope");
      // 重置一下对象
      this.form_cate = {
        // key 用来find出当前选的类目拿到的pcid和category放到哪个form.customCategoryMapList中
        key: scope.row.siteId,
        // haveChildren用于判断是否是最后一层类目
        haveChildren: null,
        category: null,
        pcid: null
      }
      // 开启弹窗
      this.options.visible = true
      //   this.$store.commit("common/clearCate", new Date().getTime());
    },
    // 亚马逊类目确认按钮
    handler_Amazon_cate() {
      this.$refs['ruleForm_cate'].validate(valid => {
        if (valid) {
          this.options.visible = false
        }
      })
    },
    clearCate(scope) {
      this.$confirm('是否清空本条类目?', '提示', {
        type: 'warning'
      })
        .then(() => {
          let index = scope.$index
          let item = this.table2[index]
          item.category = ''
          this.table2.splice(index, 1, item)
          // pcid发生变化表示选择好了类目，把数据存到this.form.customCategoryMapList_copy中去，用于用户去掉某个国家站点的再次勾选回来时展示类目
          this.form.customCategoryMapList_copy.splice(index, 1, item)
          this.$store.commit('common/clearCate', new Date().getTime())
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '已放弃本次操作'
          })
        })
    }
  },
  computed: {
    // ids: [], //接收子组件change事件的返回，用户判断find父parentCusCateId
    parentCusCateId() {
      if (this.form.ids.length > 0) {
        let id = this.form.ids[this.form.ids.length - 1]
        console.log(id, 'id')
        if (id) {
          this.findItem(this.form.haveChildCateData, id)
          //   console.log(this.el, "this.el");
          return this.el.cusCateId
        }
      }
    },
    siteList() {
      // vuex中获取国家站点用于这里
      // let data = JSON.parse(
      //   JSON.stringify(this.$store.state.common.sellerData.siteList)
      // );
      let data = this.$store.state.common.sellerData
      // if (data) {
      //   data.forEach(item => {
      //     // 把'站'字去掉
      //     item.siteName = item.siteName.replace(/站/, "");
      //   });
      // }
      return data.siteList
      // return [
      //   {
      //     siteId: 1,
      //     siteName: "美国"
      //   },
      //   {
      //     siteId: 2,
      //     siteName: "英国"
      //   }
      // ];
    },
    table2() {
      let arr = JSON.parse(JSON.stringify(this.form.customCategoryMapList))
      return arr
    }
  },
  watch: {
    sellerData() {
      this.getList()
    }
    // 监听添加类目的弹窗，true则发起getList的请求，因为
    // 分页列表：sellerId，cusCateName，endTime，startTime
    // 选择上级：sellerId，haveChildren
    // 选择自定义类目：sellerId，siteId
    // 'options.visible'(val) {
    //   // console.log(val);
    //   if (val === true) {
    //     this.getList({ haveChildren: 1 })
    //   }
    // }
  }
}
</script>

<style lang='scss' scoped>
</style>
