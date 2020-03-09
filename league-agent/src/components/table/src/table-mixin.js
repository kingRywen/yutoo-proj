export default {
  mounted() {
    // console.log(this.$refs.table);
    this._table = this.$refs.table
    this.bindEvent()
  },

  methods: {
    bindEvent() {
      this._table.$el.addEventListener('mousemove', this.eventHandle)
      this._table.$el.addEventListener('mouseout', this.mouseoutHandle)
    },
    calc(dom) {
      let div = document.createElement('div')
      document.body.appendChild(div)
      div.style = dom.style
      let result = dom.offsetWidth !== div.offsetWidth
      document.body.removeChild(div)
      return result
    },
    mouseoutHandle() {
      clearTimeout(this.timer_2)
      this.timer_2 = null
    },
    showToolTip(text = '提示', dom) {
      let div, arrow
      if (!window.__my_tooltip) {
        div = document.createElement('div')
        arrow = document.createElement('div')
        text = document.createTextNode(text)
        arrow.className = 'popper__arrow'
        div.appendChild(text)
        div.appendChild(arrow)
        window.__my_tooltip = div
        window.__my_tooltip_arrow = arrow
        div.role = 'tooltip'
        div['aria-hidden'] = 'true'
        div.className = 'el-tooltip__popper is-dark'
        arrow.style = 'border-color: #303133 transparent transparent;bottom: -11px'
        div.style = 'transform-origin: left center; z-index: 2007; display: block;'
        document.body.appendChild(div)
      } else {
        div = window.__my_tooltip
        arrow = window.__my_tooltip_arrow
      }
      let { left, top } = this.getDomOffset(dom)

      div.style.top = (top - div.offsetHeight) - 6 + 'px'
      div.style.left = left + 'px'
    },
    getDomOffset(dom) {
      let left = dom.offsetLeft, top = dom.offsetTop
      while (dom.offsetParent) {
        left += dom.offsetParent.offsetLeft
        top += dom.offsetParent.offsetTop
        dom = dom.offsetParent
      }
      return { left, top }
    },
    eventHandle(e) {
      if (e.target.nodeName.toLowerCase() == 'td') {
        return
      }
      if (this.cur === e.target) {
        return
      } else {
        clearTimeout(this.timer_2)
        this.cur = e.target
        this.timer_2 = setTimeout(() => {
          this.showToolTip('提示', e.target)
        }, 300);
      }

    }
  },
};
