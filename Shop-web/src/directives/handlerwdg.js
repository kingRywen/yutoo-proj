/* eslint-disable */
// 超长表格加操作控件
import Vue from 'vue';

const DEFAULT_HEIGHT = 300

function isHidden(el) {
  let elStyle = window.getComputedStyle(el)
  let parent = el.parentNode,
    hidden = false
  if (elStyle.display === 'none' || elStyle.visibility === 'hidden') {
    hidden = true
  }
  while (parent !== document) {
    parent = parent.parentNode
    if (parent.nodeType === 1) {
      let style = window.getComputedStyle(parent)
      if (style.display === 'none' || style.visibility === 'hidden') {
        hidden = true
      }
    }
  }
  return hidden
}

function getStyle(ele,attr){
  if(window.getComputedStyle){
      return window.getComputedStyle(ele,null)[attr];
  }
  return ele.currentStyle[attr];
}

let DomSize = (function() {
  const elList = [];
  let timer = 0;
  function bind(el, next) {
      let obj = {
          el,
          callback: next,
          style: {
              width: getStyle(el, 'width'),
              height: getStyle(el, 'height'),
          }
      }
      elList.push(obj);
  }
  function remove(el) {
      elList.splice(elList.indexOf(el))
      if (elList.indexOf(el) !== -1) {
          elList.splice(elList.indexOf(el), 1);
      }
  }
  timer = setInterval(() => {
      for (let i = 0; i < elList.length; i++) {
          let dom = elList[i].el
          const style = {
              width: getStyle(dom, 'width'),
              height: getStyle(dom, 'height'),
          }
          if (!isEqul(style, elList[i].style)) {
              elList[i].style = {
                  width: style.width,
                  height: style.height,
              }
              elList[i].callback && elList[i].callback();
          }
      }
  }, 200)
  
  function isEqul(obj1, obj2) {
      let isEqul = true;
      for (var i in obj1) {
          if (obj1[i] !== obj2[i]) {
              isEqul = false;
          }
      }
      return isEqul;
  }
  return {
      bind,
      remove,
  }
})();

if (!window._setTimeout) {
  window._setTimeout =
    window._setTimeout ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.setTimeout;
}


let scrollBox,
  scrollBoxInner,
  arrowLeft,
  arrowRight,
  mainDiv,
  innerCircle,
  requestId,
  originX,
  originY,
  originLeft,
  originTop,
  tableEl,
  move,
  sum

function createDiv(clsName) {
  let el = document.createElement('div')
  el.className = clsName
  return el
}

let handleMousemove = (e, isSelf) => {
  if (move) {
    let child = innerCircle;
    if (child) {
      moveAndScroll(child, e);
    }
  }
}

let scrollBoxMouseenterHandler = (e) => {
  // e.currentTarget.style.display = 'flex'
  setCircleShow(true, e.currentTarget)
}

let handleMouseDown = (e) => {
  move = true;
  // 当前点击的点
  // currentPointX = e.pageX;
  // currentPointY = e.pageY;
  if (move) {
    let child = innerCircle;
    if (child) {
      moveAndScroll(child, e);
    }
  }
}

// 如果不需要移动内圆 isMoveInnerCircle: false
function moveAndScroll(child, e, isMoveInnerCircle = true) {

  let { target, pageX, pageY } = e;
  // 移动小圆
  let {
    offsetLeft: pLeft,
    offsetTop: pTop,
    offsetWidth,
    offsetHeight
  } = child;

  if (isMoveInnerCircle) {
    let scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    child.style.left = pageX - offsetWidth / 2 + "px";
    child.style.top = pageY - offsetHeight / 2 + "px" - scrollTop;
  }

  // 滑动scroll
  let scrollLeftEl = [].indexOf.call(tableEl.parentNode.classList, 'function') > -1 ? tableEl.parentNode : tableEl;
  // let scrollLeftEl = tableEl.parentNode
  let distanceX = Math.abs(pageX - originX);
  let distanceY = pageY - originY;

  function updateScroll() {
    //
    if (requestId) {
      if (window.requestAnimationFrame) {
        window.cancelAnimationFrame(requestId);
      } else {
        clearTimeout(requestId);
      }

      requestId = null;
    }
    if (pageX > originX) {
      // 右
      scrollLeftEl.scrollLeft += 2 + distanceX;
      requestId = window._setTimeout(updateScroll);
    }
    if (pageX < originX && scrollLeftEl.scrollLeft > 0) {
      // 左
      scrollLeftEl.scrollLeft -= 2 + distanceX;
      if (scrollLeftEl.scrollLeft !== 0) {
        requestId = window._setTimeout(updateScroll);
      }
    }
  }

  if (scrollLeftEl) {
    updateScroll();
  }
}


function setInnerCirclePosition() {

  if (!scrollBox) {
    return;
  }
  Vue.prototype.$nextTick(() => {
    let {
      offsetLeft,
      offsetTop,
      offsetWidth,
      offsetHeight
    } = scrollBox;
    let {
      offsetWidth: offsetWidth1,
      offsetHeight: offsetHeight1
    } = innerCircle;

    originX = offsetLeft + offsetWidth / 2;
    originY = offsetTop + offsetWidth / 2;
    originLeft = originX - offsetWidth1 / 2;
    originTop = originY - offsetHeight1 / 2;

    innerCircle.style.left = originLeft + "px";
    innerCircle.style.top = originTop + "px";
  });
}
function handleTableMouseenter(e) {
  
  if (e.relatedTarget && (e.relatedTarget === mainDiv || e.relatedTarget.parentNode === mainDiv || (e.relatedTarget.parentNode && e.relatedTarget.parentNode.parentNode === mainDiv))) {
    return
  }

  setCircleShow()
  setInnerCirclePosition();
}
function handleTableMouseleave() {
  setCircleShow(false)
}

function setCircleShow(show = true, el = scrollBox) {
  try {
    if (show) {
      // el.style.display = 'flex'
      el.classList.remove('hide')
      
    } else {
      // el.style.display = 'none'
      el.classList.add('hide')
      
    }
  } catch (error) {
    
  }
  
}

function handleMouseUp(e) {
  move = false;
  innerCircle.style.left = originLeft + "px";
  innerCircle.style.top = originTop + "px";

  if (window.requestAnimationFrame) {
    window.cancelAnimationFrame(requestId);
  } else {
    clearTimeout(requestId);
  }
  requestId = null;
}

function scrollBoxInnerMousemove(e) {
  return handleMousemove(e, true)
}

function handleArrowMousedown(e) {
  move = true;
  if (move) {
    let child = innerCircle;
    if (child) {
      moveAndScroll(child, e, false);
    }
  }
}
function documentKeyUpHandler(e) {

  if (e.keyCode === 72) {
    // 按H 切换inner显示
    try {
      if (scrollBox.classList.contains('neverShow')) {
        scrollBox.classList.remove('neverShow')
        setInnerCirclePosition()
      } else {
        scrollBox.classList.add('neverShow')
      }
    } catch (error) {
      
    }
    
  }
}

function addCircle(tableEl) {
  scrollBox = createDiv('scroll-box')
  scrollBox.title = '按 H 隐藏/显示'
  scrollBoxInner = innerCircle = createDiv('scroll-box-inner')
  arrowLeft = createDiv('arrow-left')
  arrowRight = createDiv('arrow-right')

  mainDiv = document.createElement('div')

  document.addEventListener('keyup', documentKeyUpHandler)


  scrollBox.addEventListener('mouseenter', scrollBoxMouseenterHandler)
  scrollBox.addEventListener('mousemove', handleMousemove)
  scrollBox.addEventListener('mousedown', handleMouseDown)

  // handleArrowMousedown

  scrollBoxInner.addEventListener('mousemove', scrollBoxInnerMousemove)
  arrowLeft.addEventListener('mousedown', handleArrowMousedown)
  arrowRight.addEventListener('mousedown', handleArrowMousedown)



  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMousemove);
  window.addEventListener("resize", setInnerCirclePosition);
  tableEl.addEventListener("mouseenter", handleTableMouseenter);
  tableEl.addEventListener("mouseleave", handleTableMouseleave);

  mainDiv.appendChild(scrollBox)
  scrollBox.appendChild(scrollBoxInner)
  scrollBox.appendChild(arrowLeft)
  scrollBox.appendChild(arrowRight)
  document.body.appendChild(mainDiv)

  
}

function tableChange() {
  let height = parseInt(getStyle(tableEl, 'height'))
  if (height > DEFAULT_HEIGHT) {
    if (!scrollBox) {
      addCircle(tableEl)
    } else {
      setCircleShow(false)
    }
    
  } else {
    setCircleShow(false)
  }
}

export default {
  componentUpdated(el, binding) {
    tableEl = el.querySelectorAll('.el-table__body-wrapper')[0]
    if (isHidden(tableEl)) {
      return
    }
    if (scrollBox) {
      return
    }
    
    if ([].indexOf.call(tableEl.classList, 'is-scrolling-none') === -1) {
      if (binding.value.length !== binding.oldValue.length) {
        setTimeout(() => {
          if (tableEl.offsetHeight > DEFAULT_HEIGHT) {
			if(binding.arg === 'function') {
				sum = true
			}
            addCircle(tableEl)
            // 监听table表格变化
            DomSize.bind(tableEl,tableChange)
          }
        });
      }
    }
  },
  unbind(el, binding) {
    if (!scrollBox) {
      return
    }
    scrollBox.removeEventListener('mouseenter', scrollBoxMouseenterHandler)
    scrollBox.removeEventListener('mousemove', handleMousemove)
    scrollBox.removeEventListener('mousedown', handleMouseDown)

    scrollBoxInner.removeEventListener('mousemove', scrollBoxInnerMousemove)
    arrowLeft.removeEventListener('mousedown', handleArrowMousedown)
    arrowRight.removeEventListener('mousedown', handleArrowMousedown)

    document.removeEventListener('keyup', documentKeyUpHandler)

    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMousemove);
    window.removeEventListener("resize", setInnerCirclePosition);
    tableEl.removeEventListener("mouseenter", handleTableMouseenter);
    tableEl.removeEventListener("mouseleave", handleTableMouseleave);

    document.body.removeChild(mainDiv)

    DomSize.remove(tableEl,tableChange)

    scrollBox = null
    scrollBoxInner = null
    arrowLeft = null
    arrowRight = null
    innerCircle = null
    requestId = null
    originX = null
    originY = null
    originLeft = null
    originTop = null
    move = null



  }
};