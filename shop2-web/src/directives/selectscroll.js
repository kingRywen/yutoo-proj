function findElScrollSelect(vm, ret) {
  if (!vm.$children) {
    return;
  } else {
    for (const childVm of vm.$children) {
      if (childVm.$options._componentTag == "el-select-menu") {
        ret = childVm;
        break;
      } else {
        if (childVm.$children) {
          ret = findElScrollSelect(childVm, ret);
        }
      }
    }
    return ret;
  }
}

function scrollHandler(elScroll, binding, el) {
  let wrapH = elScroll.offsetHeight,
    wrapScrl = elScroll.scrollTop,
    ulH = elScroll.querySelectorAll("ul")[0].offsetHeight;

  if (
    ulH < wrapScrl + wrapH + 30 &&
    (!el.dataset.isloading || el.dataset.isloading == "false")
  ) {
    let div = document.createElement("div");
    div.className = "loadingSelect";
    div.innerHTML = "加载中..";
    elScroll.appendChild(div);
    el.dataset.isloading = true;
    binding
      .value()
      .then(() => {
        el.dataset.isloading = false;
        div.parentNode.removeChild(div);
      })
      .catch(() => {
        el.dataset.isloading = false;
      });
  }
}

let scrollHandlerMap = {};

export default {
  bind(el, binding) {
    binding.value.apply(this, arguments).then(() => {});
  },
  inserted(el, binding) {},
  componentUpdated(el, binding, vnode) {
    let elScroll = findElScrollSelect(vnode.context);
    if (elScroll) {
      elScroll = elScroll.$children[0];
      let wrap = elScroll.$el.querySelectorAll(".el-scrollbar__wrap")[0];
      el.dataset.wrap = wrap;
      wrap.addEventListener(
        "scroll",
        (scrollHandlerMap[0] = scrollHandler.bind(this, wrap, binding, el))
      );
    }
  },
  unbind(el, binding, vnode) {
    let elScroll = findElScrollSelect(vnode.context);
    elScroll = elScroll.$children[0];
    let wrap = elScroll.$el.querySelectorAll(".el-scrollbar__wrap")[0];
    wrap.removeEventListener("scroll", scrollHandler);
    wrap = null;
  }
};
