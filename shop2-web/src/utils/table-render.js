import store from "Store";
/**
 * 表格搜索中数字范围项
 * @param {String} label 搜索项的label
 * @param {String} field 搜索项的字段
 * @param {String} labelWidth 搜索项的label宽度
 * @param {Number} precions 数字精度
 */
export function getSearchNumField(
  label,
  field,
  labelWidth = "130px",
  range = true,
  precions = 0
) {
  let vm = this;
  return {
    hidden: true,
    type: "object",
    label,
    field,
    range,
    labelWidth,
    change(key, val) {
      if (key == "min") {
        // console.log(
        //   field,
        //   val[field].min,
        //   vm.$refs.layout.searchData[field].max
        // );
        vm.$set(vm.$refs.layout.searchData[field], "max", undefined);
        vm.searchFields[field].properties.max.min = val[field].min;
      }
    },
    properties: {
      min: {
        widget: "number",
        min: 0,
        precions,
        width: 120,
        span: 12
      },
      max: {
        widget: "number",
        labelWidth: "20px",
        precions,
        min: 0,
        label: "~",
        width: 120,
        span: 12
      }
    }
  };
}

/**
 * 获取日期组件
 * @param {string} field 字段名
 * @param {String} label 显示名
 * @param {String} labelWidth 宽度
 * @param {String} widget 日期组件
 * @param {Boolean} hidden 是否隐藏
 */
export function timeField(
  label,
  field,

  labelWidth = "80px",
  widget = "daterange",
  hidden = true
) {
  let min = field + "Min",
    max = field + "Max";
  return {
    hidden,
    labelWidth,
    widget,

    label,
    fields: [min, max]
  };
}

/**
 *获取类目级联选择框参数
 *
 */
export function getCategorySelect(params, depthType = "depth") {
  return {
    width: "100%",
    label: "选择类目",
    widget: "cascader",
    required: true,
    props: {
      lazy: true,
      label: "name",
      value: "pcid",
      checkStrictly: true,
      lazyLoad: (node, resolve) => {
        GLOBAL.ajax[`productAnalysis/categoryGetCategory`]({
          ...store.state.storeInfo.info,
          parentPcid: node.data ? node.data.pcid : 0,
          cateType: depthType !== "depth" ? 1 : undefined,
          ...params
        }).then(data =>
          resolve(data.data.map(e => ({ ...e, leaf: !e.haveChildren })))
        );
      }
    }
  };
}

// 类目省略列
export function renderCate(h, scope) {
  let { category, categoryUrl } = scope.row;
  let cates = category.split(":");
  return (
    <el-tooltip placement="top-start" content={category}>
      <a class="link" href={categoryUrl} target="_blank">
        {cates.length > 3
          ? cates.slice().shift() + "：......：" + cates.slice().pop()
          : category}
      </a>
    </el-tooltip>
  );
}
