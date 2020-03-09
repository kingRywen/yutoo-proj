import { mapActions, mapState, mapGetters } from 'vuex';

export const authMethods = mapActions('auth', ['loggIn', 'loggOut', 'getPermsRoutes'])
export const authComputed = {
  ...mapState('auth', ['token','userInfo','hasPermsRoute']),
  ...mapGetters('auth', ['logged'])
}
