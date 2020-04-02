export default {
  // 开发环境 112 - 王成   138 - 剑辉 156 -yc
  dev: {
    loginRedirect: "/",
    LOGIN_URL: "http://192.168.0.112:8003",
    COMMON_URL: "http://192.168.0.112:8002"
    // COMMON_URL: "http://192.168.0.112:8002",
    // LOGIN_URL: "http://192.168.0.112:8003"
  },
  // 打包生产环境
  prod: {
    loginRedirect: "/",
    LOGIN_URL: "http://localhost:8003",
    COMMON_URL: "http://localhost:8002"
  },
  // 沙盒环境（勿改）
  test_env: {
    loginRedirect: "/test-env/",
    LOGIN_URL: "http://192.168.0.98:7081"
  },
  // 测试环境（勿改）
  test: {
    loginRedirect: "/",
    LOGIN_URL: "http://192.168.0.32:8003",
    COMMON_URL: "http://192.168.0.32:8002"
  },
  // 线上环境（勿改）
  online: {
    loginRedirect: "/",
    LOGIN_URL: "/shop2amz",
    COMMON_URL: "/shop2center"
  }
};
