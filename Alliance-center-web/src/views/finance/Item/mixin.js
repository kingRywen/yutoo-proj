import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['expendOption'])
  },
  created() {
    this.getExpendOption()
  },
  watch: {
    expendOption(val) {
      this.searchFields[0].options = val
    }
  },
  methods: {
    ...mapActions(['getExpendOption']),
  },
};
