import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      currentLang: state => state.i18N.lang
    })
  },
  methods: {
    ...mapActions("i18N", ["SetLang"]),
    setLang(lang) {
      this.SetLang(lang);
    }
  }
};
