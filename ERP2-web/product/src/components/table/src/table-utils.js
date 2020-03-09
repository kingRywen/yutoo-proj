import Vue from 'vue';

// /**
//  * 生成tooltip
//  * @param {string} content  显示tooltip的值
//  * @param {jsx} main        显示在外面的jsx
//  */
// export function getTooltip(main,content) {
//   return <ElTooltip content={content} placement="top" effect="light">{main}</ElTooltip>
// }

// 枚举逻辑
export function getEnum(item, scope) {
  let key = scope.row[item.value] // 3
  let _k
  if (key == null) {
    return '-'
  }
  if (!item._enum.hasOwnProperty(key)) {
    Object.keys(item._enum)
      .filter(el => parseInt(el) != el)
      .forEach(k => {
        try {
          let fn = new Function('key', `return key ${k}`)
          if (fn(key)) {
            _k = k
            return false
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      })
    return item._enum[_k]
  } else {
    return item._enum[scope.row[item.value]]
  }
}

export function getMoney(item, scope) {
  let moneyField = item.value
  if (scope.row[moneyField] || scope.row[moneyField] == 0) {
    if (scope.row[moneyField]) {
      return (
        `${item['money'] === 'us' ? '$' : '¥'} ` + scope.row[moneyField]
      )
    } else {
      return scope.row[moneyField]
    }
  } else {
    return '-'
  }
}

export function handleExpand(scope, item, treeTableOtions, stop, e) {
  if (stop) {
    e.stopPropagation();
  }
  const { row } = scope
  const { async, asyncFunc } = item
  // const { expandFunc } = expandOptions;
  const { childs } = treeTableOtions || {}
  const { _expanded } = row
  const _child = row[childs]
  // 点击下拉
  if (!_expanded) {
    if (async) {
      if (!_child) {
        // 需要请求后台
        Vue.set(row, 'loading', true)
        asyncFunc(row).then(data => {
          row.loading = false
          Vue.set(row, childs, data)
          Vue.set(row, '_expanded', true)
        })
      } else {
        Vue.set(row, '_expanded', true)
      }
    } else {
      // 不需要请求后台
      Vue.set(row, '_expanded', true)
    }
  } else {
    row._expanded = false
  }
}


export const getLink = (h, item, scope, treeTableOtions, numJsx) => {
  let _jsx = []
  if (item.expand) {
    _jsx.push(<el-button
      type="text"
      icon={`el-icon-${
        scope.row.loading
          ? 'loading'
          : scope.row._expanded
            ? 'arrow-down'
            : 'arrow-right'
        }`}
      onClick={e => handleExpand(scope, item, treeTableOtions, true, e)}
      style={{
        visibility: !treeTableOtions.expandFunc(scope.row) ? `hidden` : null
      }}
    ></el-button>)
  }
  if (scope.row[item.value] != null && scope.row[item.value] !== '') {
    _jsx.push(
      item.routerTo ? <router-link tag="a" class="url" to={item.routerTo(scope.row)} target="_blank">{scope.row[item.value]}</router-link> :
        <a
          class="url"
          href={scope.row[item.url]}
          target="_blank"
          style={item.style || ''}
        >
          {scope.row[item.value]}
        </a>
    )
  } else {
    _jsx.push(
      <span>-</span>
    )
  }
  let btnJsx = <div class={item.showTooltip ? 'fix__row_2' : null }>{_jsx}{numJsx}</div>
  let inner = (!item.showTooltip || scope.row[item.value].length < 8) ? btnJsx : <ElTooltip content={scope.row[item.value]} placement="top" effect="light">{btnJsx}</ElTooltip>

  let jsx = (

    <div
      style={
        item.expand
          ? { paddingLeft: (scope.row._level - 1) * 20 + 'px' }
          : null
      }
      class="link-wrapper"
    >
      {inner}
    </div>

  )
  return jsx
}


export function getPercent(item, scope) {
  let perField = item.value
  let showField = scope.row[perField]
  if (showField || showField == 0) {
    if (showField) {
      let num = item.keepFew || 0
      var percent = Number(showField * 100).toFixed(num) + '%'
      return percent
    } else {
      return showField + '%'
    }
  } else {
    return '-'
  }
}
