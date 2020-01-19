<template lang="pug">
  view.index
    button(type="primary" @tap="$navigateTo({url: `/pages/chat/list`})") 房源APP端置业顾问聊天列表
    <!-- button(type="warn" @tap="$navigateTo({url: `/pages/chat/chatting?did=1340&mu=39&sf=4&at=18`})") 房源H5端,向置业顾问发起聊天 -->
    button(type="warn" @tap="$navigateTo({url: `/pages/chat/chatting?did=1340&mu=68&sf=4&at=18`})") 房源H5端,向置业顾问发起聊天
</template>
<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>
<style lang="scss" scoped>
  .index{
    padding: 40rpx;
  }
  button{
    margin-bottom: 60rpx;
  }
</style>