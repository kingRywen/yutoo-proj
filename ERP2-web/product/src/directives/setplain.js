export default {
  inserted(el, binding) {
    let cls = ["is-plain"];
    if (binding.modifiers.small) {
      cls.push("el-button--small");
    }
    const btns = el.querySelectorAll(".el-button-group .el-button");
    [].forEach.call(btns, btn => {
      btn.className += " " + cls.join(" ");
    });
  }
};
