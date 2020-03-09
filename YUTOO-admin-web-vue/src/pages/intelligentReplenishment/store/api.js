import {
  fetchData
} from '@/common/common';
import apis from '@/apis';

export default {
  async gotSourcePlatformList() {
    return fetchData({ ...apis.PLATFORM_LIST
    }).then((res) => res.data)
  },
  async gotSourceShopList(params) {
    return fetchData({ ...apis.LIST_BY_PLATFORMIDS,
      data: params
    }).then((res) => {
      if (res.data.code === 500) {
        return []
      } else {
        return res.data.rows
      }
    })
  },
  async gotIntelligentReplenishmentList(data) {
    return fetchData({ ...apis.REPLENISHPRODUCT_REPLENISHPRODUCTLIST,
      data
    }).then((res) => res.data)
  },
  async gotCycleType() {
    return fetchData({ ...apis.REPLENISHPRODUCT_GETCYCLETYPE,
      data: {}
    }).then((res) => res.data.cycleType)
  },

  async gotTransportType(data = {
    nationId: null
  }) {
    return fetchData({ ...apis.TRANSPORT_FIRST_NATION_TRANSPORT_LIST,
      data
    }).then((res) => res.data.rows)
  }
}