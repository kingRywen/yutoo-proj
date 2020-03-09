<template>
  <div>
    <div class="bg-wrapper"></div>
    <div class="preview-wrapper">
      <div class="phone-wrapper">
        <div class="float-shortcuts">
          <a class="page-controller swiper-button-prev prev">上一页</a>
          <a class="page-controller swiper-button-next next">下一页</a>
        </div>
        <div class="h100">
          <engine />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
try {
  window.__work = JSON.parse(localStorage.getItem('__work'))
} catch (e) {
  window.__work = {}
}

// window.__work = {
//   id: 6,
//   title: '标题',
//   description: '描述',
//   cover_image_url: '/uploads/2b728e8c04ed46fa9c03300064cad1ea.png',
//   pages: [
//     {
//       uuid: 1582790925656,
//       title: '',
//       elements: [
//         {
//           name: 'lbp-background',
//           uuid: 1582790925657,
//           pluginProps: {
//             uuid: 1582790925657,
//             imgSrc: '',
//             backgroundColor: 'rgba(255, 255, 255, 0.2)'
//           },
//           commonStyle: {
//             top: 100,
//             left: 100,
//             width: 100,
//             height: 40,
//             textAlign: 'center',
//             color: '#000000',
//             backgroundColor: 'rgba(255, 255, 255, 0)',
//             fontSize: 14
//           },
//           events: [],
//           animations: []
//         },
//         {
//           name: 'lbp-text',
//           uuid: 1582790930610,
//           pluginProps: {
//             uuid: 1582790930610,
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             borderWidth: 0,
//             borderRadius: 0,
//             borderColor: '#ced4da',
//             text: '<p>1<strong>231231w</strong>wwwwwww</p>'
//           },
//           commonStyle: {
//             top: 100,
//             left: 100,
//             width: 100,
//             height: 40,
//             textAlign: 'center',
//             color: '#000000',
//             backgroundColor: 'rgba(255, 255, 255, 0)',
//             fontSize: 14
//           },
//           events: [],
//           animations: []
//         }
//       ]
//     }
//   ],
//   is_publish: false,
//   is_template: false,
//   created_at: '2020-02-27T08:08:46.105Z',
//   updated_at: '2020-02-27T08:09:02.411Z'
// }
import 'animate.css'
import './preview-assets/swiper.min.css'
import Vue from 'vue'
// import Swiper from './preview-assets/swiper.min'
// import SwiperAnimation from './preview-assets/swiper-animation.umd.min'
// import Engine from './preview-assets/engine.umd.js'
const Engine = require('./preview-assets/engine.umd.js')
const SwiperAnimation = require('./preview-assets/swiper-animation.umd.min')
const Swiper = require('./preview-assets/swiper.min')
Vue.use(Engine.default)
// debugger
export default {
  mounted() {
    setTimeout(() => {
      const swiperAnimation = new SwiperAnimation()

      var mySwiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'vertical',
        loop: false,
        // If we need pagination
        pagination: {
          el: '.swiper-pagination'
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        on: {
          init: function() {
            swiperAnimation.init(this).animate()
          },
          slideChange: function() {
            swiperAnimation.init(this).animate()
          }
        }
      })

      function title(str) {
        if (str.length <= 1) return str.toUpperCase()
        return str.slice(0, 1).toUpperCase() + str.slice(1)
      }

      function displayMessage({ origin, data }) {
        if (
          ['next', 'prev'].includes(data) &&
          origin === window.location.origin
        ) {
          // 不采用下面的原因：在移动端和小屏幕上，会移除：.swiper-button-prev, .swiper-button-next 按钮
          // document.querySelector(`.swiper-button-${data}`).click()

          var action = `slide${title(data)}`
          mySwiper[action]()
        }
      }

      if (window.addEventListener) {
        window.addEventListener('message', displayMessage, false)
      } else {
        window.attachEvent('onmessage', displayMessage)
      }
    }, 200)
  }
}
</script>
<style>
* {
  outline: none;
}

.bg-wrapper {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}
/* .swiper-container {
      width: 100%;
      height: 100vh;
    } */
.h100,
#work-container,
.swiper-container {
  height: 100%;
}
.preview-wrapper {
  display: flex;
  flex-wrap: nowrap;
  width: 1200px;
  height: 100%;
}
.preview-wrapper .phone-wrapper {
  /* position: absolute; */
  width: 1200px;
  height: 100%;
  display: inline-block;
  background: #fff;
  box-sizing: content-box;
  border: 10px solid #f6f6f6;
}
.preview-wrapper .float-shortcuts {
  position: absolute;
  top: 100px;
  right: 0;
}
.preview-wrapper .float-shortcuts .page-controller {
  position: absolute;
  left: 0 !important;
  display: block;
  box-sizing: border-box;
  width: 22px;
  height: 60px;
  padding: 4px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  background: #2096f9;
  font-size: 12px;
  /* border: 1px solid #2096f9; */
  color: #fff;
}
.preview-wrapper .float-shortcuts .page-controller.next {
  top: 80px;
}
.preview-wrapper .work-info {
  color: #4a4a4a;
  font-size: 14px;
  margin-left: 380px;
}
</style>