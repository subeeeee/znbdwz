<template lang="pug">
  .ChannelTree
    .tree
      el-tree(
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :highlight-current="true"
        :expand-on-click-node="expandOnClickNode"
      )
        span(class="custom-tree-node" slot-scope="{ node, data }") {{ node.label }}
          span(@click.stop="()=> {}")
            el-dropdown(trigger="click" size="small" v-if="isShowEdit")
              i(class="el-icon-more")
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(v-if="data.type === 'channel'" @click.native="handleEditChannel(node, data)") 编辑渠道
                el-dropdown-item(v-if="data.type === 'channel'" v-show="data.effectivity === 0" @click.native="handleStopChannel(node, data)") 停用渠道
                el-dropdown-item(v-if="data.type === 'channel'" v-show="data.effectivity === -1" @click.native="handleStopChannel(node, data)") 启用渠道
                el-dropdown-item(v-if="data.type === 'channel'" @click.native="handleDelChannel(node, data)") 删除渠道
                el-dropdown-item(v-if="data.type === 'channel'" @click.native="handleAddStore(node, data)") 添加门店
                el-dropdown-item(v-if="data.type === 'store'" @click.native="handleEditStore(node, data)") 编辑门店
                el-dropdown-item(v-if="data.type === 'store'" v-show="data.effectivity === 0" @click.native="handleStopStore(node, data)") 停用门店
                el-dropdown-item(v-if="data.type === 'store'" v-show="data.effectivity === -1" @click.native="handleStopStore(node, data)") 启用门店
                el-dropdown-item(v-if="data.type === 'store'" @click.native="handleDelStore(node, data)") 删除门店



</template>

<script>
  export default {
    name: "ChannelTree",
	  props: {
		  expandOnClickNode: {
		  	type: Boolean,
			  default: true
		  },
		  treeData: {
		  	required: true
		  },
		  isShowEdit: {
		  	type: Boolean,
			  default: true
		  }
	  },
    data() {
      return {
        defaultProps: {
          children: 'stores',
          label: 'name'
        },
        tree: [{
          label: '渠道',
          children: [{
            label: '门店',

          }]
        }],
      }
    },
    methods: {
      // 点击树的某个子结点
      handleNodeClick(data) {
	    	this.$emit("nodeClick", data)
      },
	    handleEditChannel(node, data) {
		    this.$emit("editChannel", data)
	    },
	    handleStopChannel(node, data) {
		    this.$emit("stopChannel", data)
	    },
	    handleDelChannel(node, data) {
		    this.$emit("delChannel", data)
	    },
	    handleAddStore(node, data) {
		    this.$emit("addStore", data)
	    },
	    handleEditStore(node, data) {
		    this.$emit("editStore", data)
	    },
	    handleStopStore(node, data) {
      	data.storeId = data.id
		    this.$emit("stopStore", data)
	    },
	    handleDelStore(node, data) {
		    this.$emit("delStore", data)
	    },

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
