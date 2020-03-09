export default {
  computed: {
    curData() {
      if (!this.data) {
        return []
      }
      return this.data.map(el => {
        let ranges = el.range.split('-')
        return {
          range: ranges[1] === '' ? ranges[0] + `${this.unit || '天'}以上` : el.range + `${this.unit || '天'}`,
          _range: el.range,
          cnt: el.cnt
        }
      })
    }
  },
};
