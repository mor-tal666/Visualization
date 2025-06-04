<template>
  <div class="nav-header">
    <el-menu
      :router="true"
      mode="horizontal"
      class="nav-menu"
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/data-analysis">数据分析</el-menu-item>
      <el-menu-item index="/resource-management">资源管理</el-menu-item>
      <el-menu-item index="/policy-support">政策支持</el-menu-item>
      <el-menu-item index="/community">社区互动</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavHeader'
}
</script>

<style scoped>
.nav-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-menu {
  padding: 0 2rem;
}
</style> 