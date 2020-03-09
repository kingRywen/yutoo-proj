<template>
  <section class="layout">
    <div class="backBox">
      <header>
        <slot name="header"></slot>
      </header>
      <div class="content">
        <slot name="content">
          <div class="select">
            <slot name="select"></slot>
          </div>

          <div class="table">
            <slot name="table"></slot>
          </div>

          <footer>
            <slot name="footer"></slot>
          </footer>
        </slot>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.layout {
  box-sizing: border-box;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 100px;
  .backBox {
    background: #fff;
  }
  //   background: #e4e4e4;
  header {
    height: 47px;
    padding: 0 20px;
    line-height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  .content {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 68px;
    bottom: 20px;
    padding-right: 10px;
    padding-bottom: 30px;
    padding-left: 10px;
    overflow-y: auto;
    background: #fff;
    // box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    .select {
      padding: 20px 0 20px 5px;
    }
    .table {
      // min-height: 560px;
    }
    footer {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
