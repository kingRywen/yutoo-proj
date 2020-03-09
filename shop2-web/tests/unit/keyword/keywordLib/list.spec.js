import List from "@/views/modules/Keyword/keywordLib/list/index.vue";
import { shallowMount, mount } from "@vue/test-utils";
import Vue from "vue";

describe("关键词库-list", () => {
  const wrapper = shallowMount(List);

  it("list属性", () => {
    wrapper.setData({
      list: [
        {
          name: "打底裤",
          num: 20
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "打底裤",
          num: 20
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "打底裤",
          num: 20
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        },
        {
          name: "运动文胸",
          num: 10
        }
      ]
    });
    return Vue.nextTick().then(() => {
      expect(wrapper.text()).toBe(
        "打底裤 20  运动文胸 10  运动文胸 10  运动文胸 10  打底裤 20  运动文胸 10  运动文胸 10  运动文胸 10  打底裤 20  运动文胸 10  运动文胸 10  运动文胸 10    添加"
      );
    });
  });
});
