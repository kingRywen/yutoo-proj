export default {
  methods: {
    // 特殊处理后台拿到的数据
    // type 0 普通数据  1 变体数据
    // get 1 保存数据 0 获取数据
    setSpecialData(data, type, get) {
      // debugger
      // 把controlType 3 17 18的控件类型的值还原成数组, 
      if (data == null) {
        return []
      }
      data = JSON.parse(JSON.stringify(data))
      function setVal(el) {
        if ((el.controlType === 3 || el.controlType === 17 || el.controlType === 18) && el.value) {
          if (!get) {
            el.value = el.value.split('@,,#@').map(_el => {
              // 其中 3 17 控件取id值 ，需要转成数字
              return (el.controlType === 3 || el.controlType === 17) ? Number(_el) : _el
            })
          } else {
            el.value = el.value.join('@,,#@')
          }
        }
      }
      if (type) {
        data.forEach(_el => {
          if (_el.fields) {
            _el.fields.forEach(el => {
              setVal(el)
            })
          }
        })
      } else {
        data.forEach(el => {
          if (el.fields) {
            _el.fields.forEach(el => {
              setVal(el)
            })
          }
          if (el.controlType != null) {
            setVal(el)
          }
        })
      }
      return data
    }
  },
};
