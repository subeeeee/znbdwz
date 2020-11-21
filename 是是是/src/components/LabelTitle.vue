<template>
  <div class="labelTitle">
    <slot>
      <el-row>
        <el-col :span="12">
          <h3 class="title"><i :style='{background: this.theme}'></i>{{ title }}</h3>
        </el-col>
      </el-row>
    </slot>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    props: {
      title: {
        type: String,
        default: null
      }
    },
    computed: mapGetters({
      theme: 'GET_COLOUR'
    })
  }
</script>

<style scoped lang="scss">
  .labelTitle{
    .title{
      font-weight: normal;
      line-height: 52px;
      position: relative;
      text-indent: 14px;
      i{
        content: '';
        width: 5px;
        height: 20px;
        background: #0F8BE6;
        position: absolute;
        left: 0;
        top:0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
</style>
