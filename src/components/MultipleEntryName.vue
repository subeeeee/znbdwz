<template>
  <el-select v-model="projectId" placeholder="请选择" @change="select" multiple collapse-tags class="select--width300">
    <el-option v-for="(item, index) in projectData" :key="index" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import { projectsProject, projectsManagerProject } from '../common/api'
export default {
  data () {
    return {
      tenantId: '',
      projectId: [],
      projectData: []
    }
  },
  created () {
    console.log(sessionStorage.getItem('projectIdArr'))
    if (sessionStorage.getItem('projectIdArr')) {
      setTimeout(() => {
        this.projectId = sessionStorage.getItem('projectIdArr').split(',')
      }, 400)
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
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        list.push(json)
      }
      this.projectData = list
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
      }
    },
    select () {
      sessionStorage.setItem('projectIdArr', this.projectId.join(','))
      this.$emit('MultipleEntryName', this.projectId)
    }
  }
}
</script>
