<template lang="html">
    <section class="panel">
        <div class="title_wrap">
            <h3 class="title">
                <slot name="title"></slot>
            </h3>
            <div class="time">
                <slot name="time"></slot>
            </div>
        </div>
        <div class="content_wrap">
            <slot name="content"></slot>
        </div>
    </section>
</template>
<style lang="scss" scoped>
    .panel{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .title_wrap{
        padding: 0 20px 0 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 48px;
        line-height: 48px;
        border: 1px solid rgba(229, 229, 229, 1);
        border-top-left-radius: 5px;
        border-top-right-radius:  5px;
        background-color: rgba(245, 245, 245, 1);        
        .title{
            margin: 0;
            padding: 0;
            font-size: 15px;
            color:#424F62;
            font-weight: 600;
        }
    }
    .content_wrap{
        padding: 10px;
        background: #fff;
        border: 1px solid rgba(229, 229, 229, 1);
        border-top: none;

    }
</style>
