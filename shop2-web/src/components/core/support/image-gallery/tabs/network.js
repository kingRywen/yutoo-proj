import axios from "axios";

export default {
  data: () => ({
    value: ""
  }),
  methods: {},
  render(h) {
    let input = (
      <a-input placeholder="请输入网络图片地址" vModel={this.value} />
    );
    return (
      <div class="flex pad10">
        {input}
        <a-button
          class="ml10"
          type="primary"
          onClick={() => {
            if (!this.value) {
              input.elm.focus();
              this.$message.warning("请填写网络图片地址");
              return;
            }
            this.$emit("changeItem", { url: this.value });
          }}
        >
          设置图片
        </a-button>
      </div>
    );
  },
  mounted() {
    // demo code
    axios
      .get("/upload/files", {
        params: {
          _limit: 10,
          _start: 0,
          mime: "image/png"
        }
      })
      .then(res => {
        this.items = res.data;
        this.cachedItems = [];
      });
  }
};
