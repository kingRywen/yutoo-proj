import Vue from "vue";

// /**
//  * 生成tooltip
//  * @param {string} content  显示tooltip的值
//  * @param {jsx} main        显示在外面的jsx
//  */
// export function getTooltip(main,content) {
//   return <ElTooltip content={content} placement="top" effect="dark">{main}</ElTooltip>
// }

// 枚举逻辑
export function getEnum(item, scope) {
  let key = scope.row[item.value]; // 3
  let _k;
  function getLabel(key) {
    if (!item._enum.hasOwnProperty(key)) {
      Object.keys(item._enum)
        .filter(el => parseInt(el) != el)
        .forEach(k => {
          try {
            let fn = new Function("key", `return key ${k}`);
            if (fn(key)) {
              _k = k;
              return false;
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        });
      return item._enum[_k];
    } else {
      return item._enum[key];
    }
  }

  if (key == null) {
    return "-";
  }

  // 如果是多个选项，先判断是否有逗号，再判断是不是数组
  if (key.indexOf && key.indexOf(",") > -1) {
    key = key.split(",");
  }
  if (Array.isArray(key)) {
    let ar = key.map(k => getLabel(k)).filter(el => el != null);
    return ar.length ? ar.join("、") : "-";
  } else {
    return getLabel(key);
  }
}

export function getMoney(item, scope) {
  let moneyField = item.value;
  if (scope.row[moneyField] || scope.row[moneyField] == 0) {
    if (scope.row[moneyField]) {
      return (
        `${
          item.currency
            ? item.currency(scope.row)
            : item.symbol
            ? this.$store.state.storeInfo.allData[0] &&
              this.$store.state.storeInfo.allData[0].sites.find(
                e => e.siteId == item.symbol(scope.row)
              ).symbol
            : item["money"] === "us"
            ? "$"
            : "¥"
        } ` + scope.row[moneyField]
      );
    } else {
      return scope.row[moneyField];
    }
  } else {
    return "-";
  }
}

export function handleExpand(scope, item, treeTableOtions, stop, e, vm) {
  // debugger;
  if (stop) {
    e.stopPropagation();
  }
  const { row } = scope;
  const { async, asyncFunc } = item;
  // const { expandFunc } = expandOptions;
  const { childs } = treeTableOtions || {};
  const { _expanded } = row;
  const _child = row[childs];
  // 点击下拉
  if (!_expanded) {
    if (async) {
      if (!_child) {
        // 需要请求后台
        Vue.set(row, "loading", true);
        asyncFunc(row)
          .then(data => {
            row.loading = false;
            vm.addBtn(data);
            Vue.set(row, childs, data);
            // vm.addTotal(data.length);
            Vue.set(row, "_expanded", true);
          })
          .catch(e => {
            console.error(e);
            row.loading = false;
          });
      } else {
        Vue.set(row, "_expanded", true);
      }
    } else {
      // 不需要请求后台
      Vue.set(row, "_expanded", true);
    }
  } else {
    row._expanded = false;
  }
}

export const getLink = (h, item, scope, treeTableOtions, numJsx, vm) => {
  let _jsx = [],
    val = scope.row[item.value],
    {
      isClick /**是否能点击，不传的话默认可以点击，用于不同行的数据判断 */
    } = item;

  if (item.expand) {
    _jsx.push(
      <el-button
        type="text"
        icon={`el-icon-${
          scope.row.loading
            ? "loading"
            : scope.row._expanded
            ? "caret-bottom"
            : "caret-right"
        }`}
        onClick={e => handleExpand(scope, item, treeTableOtions, true, e, vm)}
        style={{
          visibility: !treeTableOtions.expandFunc(scope.row) ? `hidden` : null
        }}
      ></el-button>
    );
  }
  if (val != null && val !== "") {
    if (item.showBtn) {
      _jsx.push(
        <ElTooltip placement="right" content={val}>
          <span>{val}</span>
        </ElTooltip>
      );
    } else {
      _jsx.push(
        item.routerTo ? (
          <router-link
            tag="a"
            class="url"
            to={item.routerTo(scope.row)}
            target="_blank"
          >
            {val}
          </router-link>
        ) : item.btnClick ? (
          val == 0 || val === "" ? (
            <span>0</span>
          ) : isClick && !isClick(scope) ? (
            <span>{val}</span>
          ) : (
            <a
              class="url"
              href="javascript:;"
              onClick={e => item.btnClick(scope, e)}
              style={item.style || ""}
            >
              {val}
            </a>
          )
        ) : (
          <a
            class="url"
            href={scope.row[item.url]}
            target="_blank"
            style={item.style || ""}
          >
            {val}
          </a>
        )
      );
    }
  } else {
    _jsx.push(<span>-</span>);
  }
  let btnJsx = (
    <div class={item.showTooltip ? "fix__row_1" : null}>
      {_jsx}
      {item.showBtn ? null : numJsx}
    </div>
  );
  let inner =
    !item.showTooltip || scope.row[item.value].length < 8 || item.showBtn ? (
      btnJsx
    ) : (
      <ElTooltip
        content={scope.row[item.value]}
        placement="right"
        effect="dark"
      >
        {btnJsx}
      </ElTooltip>
    );

  let jsx = (
    <div
      style={
        item.expand ? { paddingLeft: (scope.row._level - 1) * 20 + "px" } : null
      }
      class="link-wrapper"
      style={
        item.showBtn ? { paddingRight: "30px", position: "relative" } : null
      }
    >
      {inner}
      {item.showBtn && item.numField && scope.row[item.numField] ? (
        <a
          class="url"
          href="javascript:;"
          onClick={e => item.btnClick(scope, e)}
          // style={{ position: 'absolute', top: 0, right: 0 }}
          class={item.showBtn ? "link-btn" : ""}
        >
          {scope.row[item.numField]}
        </a>
      ) : null}
    </div>
  );
  return jsx;
};

export function getPercent(item, scope) {
  let perField = item.value;
  let showField = scope.row[perField];
  if (showField || showField == 0) {
    if (showField) {
      let num = item.keepFew || 0;
      var percent = Number(showField * 100).toFixed(num) + "%";
      return percent;
    } else {
      return showField + "%";
    }
  } else {
    return "-";
  }
}

export function getImg(h, item, scope) {
  const { title } = item,
    val = scope.row[item.value];
  const image = (
    <img
      class="loadingImg"
      key={val}
      vLazy={
        val &&
        String(val).replace(
          /_S[A-Z](\d{1,4})_./,
          `_SL${item.bulkyHeight || "60"}_.`
        )
      }
    />
  );
  const link =
    item.link &&
    (typeof item.link === "string"
      ? scope.row[item.link]
      : item.link(scope.row));
  const toolTipImgSize = item.bulkyHeight || title ? 100 : 200;
  return (
    <div class="toggle-wrapper">
      <el-tooltip key={val} effect="light" placement="right">
        <div slot="content" class="flex" style="align-items: flex-start;">
          <div
            class="__img_wrapper mar-auto"
            style={{
              width: toolTipImgSize + "px",
              height: toolTipImgSize + "px"
            }}
          >
            <img
              class="loadingImg"
              key={val}
              vLazy={
                val &&
                String(val).replace(
                  /_S[A-Z](\d{1,4})_./,
                  `._SL${toolTipImgSize}_.`
                )
              }
            />
          </div>
          {link && (
            <a
              style="max-width: 300px"
              class="ml10"
              href={link}
              target="_blank"
            >
              {scope.row[title]}
            </a>
          )}
        </div>
        {item.badge ? (
          <el-badge
            value={item.badge(scope)}
            type={item.badgeType ? item.badgeType(scope) : "primary"}
            style="z-index:999;margin:10px;"
          >
            <div>
              <div
                class="__img_wrapper mar-auto"
                style={{
                  width: ((item.style && item.style.width) || "45") + "px",
                  height: ((item.style && item.style.width) || "45") + "px"
                }}
              >
                {image}
              </div>
            </div>
          </el-badge>
        ) : (
          <div
            class="__img_wrapper mar-auto"
            style={{
              width: ((item.style && item.style.width) || "45") + "px",
              height: ((item.style && item.style.width) || "45") + "px"
            }}
          >
            {item.link ? (
              <a class="link-w mar-auto" target="_blank" href={link}>
                {image}
              </a>
            ) : (
              image
            )}
          </div>
        )}
      </el-tooltip>
      {item.toggleMethod &&
      scope.row.products &&
      scope.row.products.length > 1 ? (
        <el-button
          class="custom-btn"
          on-click={item.toggleMethod(scope)}
          type="text"
          icon={!scope.row._open ? "el-icon-arrow-down" : "el-icon-caret-top"}
        ></el-button>
      ) : null}
    </div>
  );
}
