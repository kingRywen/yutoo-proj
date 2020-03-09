import axios from "axios";
import Vue from "vue";
/**
 * 获取google翻译
 * @param {String} text 需要翻译的文字
 * @param {Boolean} all 是否转换成一整段可以直接用的文字
 */
export default async function translate(text = "", all) {
  text = encodeURIComponent(text);
  return await axios
    .get(
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q=" +
        text
    )
    .then(data => {
      if (all) {
        return data.data[0].reduce((total, cur) => total + cur[0], "");
      } else {
        return data;
      }
    })
    .catch(err => {
      Vue.prototype.$message.error(`${err.message}.请点击翻译按钮重试`);
    });
}
