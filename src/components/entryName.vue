<template>
  <el-select v-model="projectId" filterable placeholder="请选择" @change="select">
    <el-option v-for="(item, index) in projectData" :key="index" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import { projectsProject, projectsManagerProject } from '../common/api'
export default {
  data () {
    return {
      tenantId: '',
      projectId: '',
      projectData: []
    }
  },
  props:{
    from:{
      type:String,
      default:''
    },
  },
  created () {
    if (sessionStorage.getItem('projectId')) {
      setTimeout(() => {
        this.projectId = sessionStorage.getItem('projectId')
      }, 0)
    }
    this.tenantId = sessionStorage.getItem('tenantId')
    if (sessionStorage.getItem('type') === '0') {
      this.projectsProject()
    } else if (sessionStorage.getItem('type') === '1') {
      this.projectsManagerProject()
    }
  },
  methods: {
    async projectsProject () {
      const result = await projectsProject(`${this.tenantId}`)
      const data = result.data.result
      let list = []
      if (this.from === "registeredUser") {
        list.push({
          label: '全部',
          value: ''
        })
        list.push({
          label: '无注册来源',
          value: '0'
        })
      }else if(this.from === 'distribute'){

      }else{
        list.push({
          label: '全部',
          value: ''
        })
      }
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        list.push(json)
      }
      this.projectData = list
      //初次打开页面，执行搜索
      this.$emit('listenTochildEvent')
    },
    async projectsManagerProject () {
      const result = await projectsManagerProject(sessionStorage.getItem('managerId'))
      let data = result.data
      this.projectData = []
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        this.projectData.push(json)
        this.projectId = data[0].projectId
        sessionStorage.setItem('projectId', data[0].projectId)
      }
      //初次打开页面，执行搜索
      this.$emit('listenTochildEvent')
    },
    select (res) {
      let projectName = '全部'
      if (this.projectId !== '') {
        this.projectData.forEach(item => {
          if (item.value === this.projectId) projectName = item.label
        })
      }
      if(this.projectId === '0') {
	      sessionStorage.setItem('projectName', '')
	      sessionStorage.setItem('projectId', '')
      }else {
	      sessionStorage.setItem('projectName', projectName)
	      sessionStorage.setItem('projectId', this.projectId)
      }

      this.$emit('entryName', this.projectId)
    }
  }
}
</script>
