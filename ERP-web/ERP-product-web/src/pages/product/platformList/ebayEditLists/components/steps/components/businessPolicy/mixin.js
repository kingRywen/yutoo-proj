import apis from 'apis';
import { fetchData, handlerCode } from 'common/common';

export default {
  methods: {
    tempChange(val) {
      console.log(val);
      this.getTempInfo(val)
    },
    getTempInfo(id) {
      let data = {
        [this.tempName]: id
      }
      fetchData({
        ...apis[this.tempApi],
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            Object.assign(this.data, res.data.rows)
          },
          () => {
          },
          true
        )
      })
    }
  },
};
