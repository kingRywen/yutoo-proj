import { getEnum, getImg, getMoney, getPercent, getLink } from "./table-utils";
export default {
  name: "table-colvalue",
  props: ["item", "scope", "arr", "treeTableOtions", "pageSize", "pageNo"],
  // TODO: 单独使用时没有注入函数
  inject: ["addBtn"],
  render(h) {
    const { scope, item } = this;
    const { row } = scope;
    const vm = this;

    const {
      value,
      render,
      formatter,
      expand,
      async,
      _enum,
      money,
      numField,
      asyncFunc,
      isPercent,
      showTooltip,
      urlItem,
      url,
      img,
      overPlus,
      line,
      type
    } = item;
    let numJsx;
    if (numField) {
      let el = row[numField];
      if (Array.isArray(el)) {
        el = el.length;
      }
      numJsx = el ? <span> ( {el} )</span> : null;
    }

    if (type === "index" && this.pageSize && this.pageNo) {
      // 序号列
      let { $index } = scope;
      return <span>{$index + 1 + (this.pageNo - 1) * this.pageSize}</span>;
    }

    if (type === "array") {
      return (
        <div class={["double-title", { "is-expand": item.children[0].expand }]}>
          <div>
            <table-colvalue
              item={item.children[0]}
              scope={scope}
              treeTableOtions={this.treeTableOtions}
              arr={this.arr}
            />
          </div>
          <table-colvalue
            item={item.children[1]}
            scope={scope}
            treeTableOtions={this.treeTableOtions}
            arr={this.arr}
            class="___subtitle"
            style={
              item.children[0].expand
                ? { paddingLeft: 19 * row._level + "px" }
                : null
            }
          />
        </div>
      );
    }

    const __isedit = row.__isedit && row.__isedit[item.value];
    if (__isedit) {
      // console.log(row.__isedit[item.value])

      let div = (
        <div>
          <el-form
            ref="editForm"
            size="small"
            show-message={false}
            class="table-edit-form"
            inline={true}
          >
            <el-form-item>
              {row.__isNumber == null ? (
                <el-input vModel={row.__isedit[item.value].editVal}></el-input>
              ) : (
                <el-input-number
                  min={0}
                  controls={false}
                  precision={row.__isNumber}
                  vModel={row.__isedit[item.value].editVal}
                ></el-input-number>
              )}
            </el-form-item>
            {row.__showBtn && (
              <el-button
                loading={row.__isedit[item.value].__loading}
                size="small"
                onClick={() => {
                  let val = row.__isedit[item.value].editVal;
                  if (val == null || val === "") {
                    return vm.$message.warning("请输入内容");
                  }

                  row.__isedit[item.value].__loading = true;
                  item
                    .editFn(row, val)
                    .then(() => {
                      row.__isedit[item.value].__loading = false;
                      row[item.value] = val;
                      row.__isedit[item.value] = null;
                    })
                    .catch(() => {
                      row.__isedit[item.value].__loading = false;
                    });
                }}
                type="primary"
              >
                保存
              </el-button>
            )}
          </el-form>
        </div>
      );
      return div;
    }

    if (img) {
      return getImg(h, item, scope);
    }

    if (_enum || money || isPercent || showTooltip || url) {
      if (url) {
        return (
          <div>{getLink(h, item, scope, this.treeTableOtions, numJsx)}</div>
        );
      }
      if (_enum) {
        return <span>{getEnum(item, scope)}</span>;
      }
      if (money) {
        return <span>{getMoney(item, scope)}</span>;
      }
      if (isPercent) {
        return <span>{getPercent(item, scope)}</span>;
      }
      if (showTooltip) {
        return row[value] ? (
          <el-tooltip placement="top" effect="dark">
            <span slot="content">{row[value]}</span>
            {urlItem ? (
              <a
                style="color: rgb(16, 142, 233);"
                href={urlItem}
                target="_blank"
                class="fix__row_1"
              >
                {row[value]}
                {numJsx}
              </a>
            ) : (
              <span class="fix__row_1">
                {row[value]}
                {numJsx}
              </span>
            )}
          </el-tooltip>
        ) : (
          <span>-</span>
        );
      }
    }

    let childs, expandFunc, jsx, expandJsx, _child;
    // const { expandFunc } = expandOptions;
    if (expand) {
      childs = this.treeTableOtions.childs;
      expandFunc = this.treeTableOtions.expandFunc;
      _child = row[childs];
    }

    const { loading, _expanded, _level } = row;
    // const _child = row[childs]
    // 点击下拉
    const handleExpand = () => {
      if (!_expanded) {
        if (async) {
          if (!_child) {
            // 需要请求后台
            this.$set(row, "loading", true);
            asyncFunc(row).then(data => {
              row.loading = false;
              this.$set(
                row,
                childs,
                vm.addBtn ? vm.addBtn.call(this, data) : data
              );
              this.$set(row, "_expanded", true);
            });
          } else {
            this.$set(row, "_expanded", true);
          }
        } else {
          // 不需要请求后台
          this.$set(row, "_expanded", true);
        }
      } else {
        row._expanded = false;
      }
    };
    function getVal(val) {
      return overPlus ? (val > overPlus ? overPlus + "+" : val) : val;
    }
    if (formatter && typeof formatter === "function") {
      jsx = <span>{formatter(this.scope, this.item)}</span>;
    } else if (render && typeof render === "function") {
      // 如果是切换效果的列，需要处理一下值
      let val = getVal(row[value]);
      val = val === null || val === "" || val === undefined ? "-" : val;
      jsx = render(h, this.scope, this.arr, val);
    } else {
      const _value = getVal(row[value]);
      jsx = (
        <span>
          {_value === null || _value === "" || _value === undefined
            ? "-"
            : _value}
        </span>
      );
    }
    // debugger
    if (expand) {
      expandJsx = (
        <el-button
          type="text"
          style={{ visibility: !expandFunc(row) ? `hidden` : null }}
          icon={`el-icon-${
            loading ? "loading" : _expanded ? "caret-bottom" : "caret-right"
          }`}
          disabled={loading}
          onClick={e => handleExpand.call(this, e)}
        />
      );
    }

    let content = (
      <div
        class="over"
        style={expand ? { paddingLeft: (_level - 1) * 20 + "px" } : null}
      >
        {expandJsx}
        {jsx}
        {numJsx}
      </div>
    );
    return line && row[value] != null && row[value] !== "" ? (
      <el-tooltip effect="dark" placement="top" open-delay={300}>
        <div slot="content">{jsx}</div>
        <div class="wrap-overflow-2" style={{ "-webkit-line-clamp": line }}>
          {content}
        </div>
      </el-tooltip>
    ) : (
      content
    );
  }
};
