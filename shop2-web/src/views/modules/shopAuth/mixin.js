export default {
  props: ["platformId"],
  data() {
    return {
      // 区域站点集
      region: []
    };
  },
  created() {
    this.getRegion();
  },
  methods: {
    getRegion() {
      this.$api[`shopAuth/regionSiteList`]({
        platformId: this.platformId
      }).then(data => {
        this.region = data.data;
      });
    }
  }
};
