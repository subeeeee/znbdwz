<template lang="pug">
  .ChannelTree
    .tree
      el-tree(
        :data="tree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :highlight-current="true"
      )
        span(class="custom-tree-node" slot-scope="{ node, data }") {{ node.label }}
          span
            el-dropdown(trigger="click" size="small")
              i(class="el-icon-more")
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(@click="handleEditChannel") 编辑渠道
                el-dropdown-item(@click="handleStopChannel") 停用渠道
                el-dropdown-item(@click="handleDelChannel") 删除渠道
                el-dropdown-item(@click="handleEditStore") 编辑门店
                el-dropdown-item(@click="handleStopStore") 停用门店
                el-dropdown-item(@click="handleDelStore") 删除门店


</template>

<script>
  export default {
    name: "ChannelTree",
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tree: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',

          }]
        }],
      }
    },
    methods: {
      // 点击树的某个子结点
      handleNodeClick(data) {
        console.log(data)
      },
      handleEditChannel(node, data) {
        console.log(node, data)
      }
    }
  }
</script>

<style scoped lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree {
    background-color: transparent;
  }

</style>
