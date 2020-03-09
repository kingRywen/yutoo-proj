const env = process.env.NODE_ENV
// const envConfig = config[env] || {}

const config = {
  development: {
    loginRedirect: '/',
    BASE_URL: 'http://192.168.0.108:7083',
    LOGIN_URL: 'http://192.168.0.108:7081',
    PERMS_URL: 'http://192.168.0.108:7082',
    REP_URL: 'http://192.168.0.108:7084',
    WAREHOUSE_URL: 'http://192.168.0.108:7088',
    ORDER_URL: 'http://192.168.0.108:7086',
    PROCUREMENT_URL: 'http://192.168.0.108:7085',
    host: 'http://192.168.0.108:'
  },
  test_env: {
    loginRedirect: '/test-env/',
    BASE_URL: 'http://192.168.0.98:7083',
    LOGIN_URL: 'http://192.168.0.98:7081',
    PERMS_URL: 'http://192.168.0.98:7082',
    REP_URL: 'http://192.168.0.98:7084',
    WAREHOUSE_URL: 'http://192.168.0.98:7089',
    ORDER_URL: 'http://192.168.0.98:7086',
    PROCUREMENT_URL: 'http://192.168.0.98:7085',
    host: 'http://192.168.0.98:'
  },
  test: {
    loginRedirect: '/',
    BASE_URL: 'http://localhost:7083',
    LOGIN_URL: 'http://localhost:7081',
    PERMS_URL: 'http://localhost:7082',
    REP_URL: 'http://localhost:7084',
    WAREHOUSE_URL: 'http://localhost:7088',
    ORDER_URL: 'http://localhost:7086',
    PROCUREMENT_URL: 'http://localhost:7085',
    host: 'http://localhost:'
  },
  production: {
    loginRedirect: '/erp/',
    BASE_URL: '/erp-product',
    LOGIN_URL: '/erp-sso',
    PERMS_URL: '/erp-permission',
    REP_URL: '/erp-replenish',
    WAREHOUSE_URL: '/erp-warehouse',
    ORDER_URL: '/erp-order',
    PROCUREMENT_URL: '/erp-purchase',
    host: ''
  }
}

module.exports = config[env]
