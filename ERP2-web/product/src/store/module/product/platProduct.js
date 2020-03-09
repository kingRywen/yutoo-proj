import siteImg from 'Assets/images/siteImg.png';
import amazon from 'Assets/images/amazon.png';
import eBay from 'Assets/images/ebay.jpg';
export const state = {
    // 对接过的站点列表
    buttedSiteList: [],
    // 选择的站点
    selectedSite: {},

    // 发货仓库下拉
    deliveryWarehouse: [
        { label: '英国', value: 0 },
        { label: '美国', value: 1 }
    ]
};

export const mutations = {
    // 设置选择的站点
    setSite(state, val) {
        let sel = state.buttedSiteList.find(el => el.value === val)
        if (sel) {
            state.selectedSite = sel;
        } else {
            state.selectedSite = state.buttedSiteList[0]
        }
    },
    setButtedSiteList(state, list) {
        state.buttedSiteList = list;
    }
};
export const actions = {
    async getButtedSiteList({ commit, dispatch }, { isSite, platId }) {
        let list = [];
        if (isSite) {
            //获取站点
            dispatch('common/getSiteByPlatId', platId, { root: true }).then((data) => {
                commit('setButtedSiteList', data)
                commit('setSite', data[0]);
            })
        } else {
            //获取平台
            list = [
                {
                    label: 'Amazon',
                    imgUrl: amazon,
                    value: 1
                },
                {
                    label: 'eBay',
                    imgUrl: eBay,
                    value: 2
                }
            ];
            await commit('setButtedSiteList', list);
            commit('setSite', 1)

        }
    }
};
