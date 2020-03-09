export default {
    // 开发环境
    dev: {
        loginRedirect: '/',
        REP_URL: 'http://192.168.0.32:6086/league-merchant-web',
        LOGIN_URL: 'http://192.168.0.32:6086/league-merchant-web',
        PERMS_URL: 'http://192.168.0.32:6086/league-merchant-web',
        AGENT_URL: 'http://192.168.0.32:6086/league-merchant-web'
    },
    // 打包生产环境
    prod: {
        loginRedirect: '/',
        REP_URL: 'http://127.0.0.1:6002',
        LOGIN_URL: 'http://127.0.0.1:6002',
        PERMS_URL: 'http://127.0.0.1:6002',
        AGENT_URL: 'http://127.0.0.1:6002'
    },
    // 沙盒环境（勿改）
    test_env: {
        loginRedirect: '/test-env/',
        REP_URL: 'http://192.168.0.116:9000',
        LOGIN_URL: 'http://192.168.0.98:6086/league-merchant-web',
        PERMS_URL: 'http://192.168.0.98:6086/league-merchant-web',
        AGENT_URL: 'http://192.168.0.98:6086/league-merchant-web'
    },
    // 测试环境（勿改）
    test: {
        loginRedirect: '/',
        REP_URL: 'http://192.168.0.116:9000',
        LOGIN_URL: 'http://192.168.0.32:6086/league-merchant-web',
        PERMS_URL: 'http://192.168.0.32:6086/league-merchant-web',
        AGENT_URL: 'http://192.168.0.32:6086/league-merchant-web'
    },
    // 线上环境（勿改）
    online: {
        REP_URL: '/league-merchant-web',
        loginRedirect: '/',
        LOGIN_URL: '/league-merchant-web',
        PERMS_URL: '/league-merchant-web',
        AGENT_URL: '/league-merchant-web'
    }
};