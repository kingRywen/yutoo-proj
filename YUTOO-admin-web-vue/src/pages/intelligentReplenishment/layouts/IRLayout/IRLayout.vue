<template lang="html">
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
            </div></div>
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
    padding: 0 0 0 20px;
    line-height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .content {
    position: absolute;
    left: 20px;
    right: 0;
    top: 48px;
    bottom: 20px;
    padding-bottom: 30px;
    padding-left: 10px;
    overflow-y: auto;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 7px;
    background: #eee;
    .select {
      padding: 20px 0 20px 5px;
    }
    .table {
      min-height: 560px;
    }
    footer {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
