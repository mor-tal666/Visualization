<template>
  <div class="resource-management animate__animated animate__fadeIn">
    <el-container>
      <el-header>
        <nav-header />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="24">
            <h2 class="page-title animate__animated animate__fadeInDown">资源管理</h2>
          </el-col>
        </el-row>

        <!-- 资源统计卡片 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="6" v-for="(stat, index) in statistics" :key="stat.title">
            <el-card 
              class="stat-card animate__animated animate__fadeInUp"
              :class="`animate__delay-${index + 1}s`"
              :body-style="{ padding: '20px' }"
            >
              <div class="stat-content">
                <el-icon :size="40" :class="stat.iconClass">
                  <component :is="stat.icon" />
                </el-icon>
                <div class="stat-info">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-title">{{ stat.title }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 资源管理主体 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="24">
            <el-card class="resource-card animate__animated animate__fadeIn">
              <template #header>
                <div class="card-header">
                  <div class="header-left">
                    <span class="header-title">资源列表</span>
                    <el-input
                      v-model="searchQuery"
                      placeholder="搜索资源..."
                      class="search-input animate__animated animate__fadeIn"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Search /></el-icon>
                      </template>
                    </el-input>
                  </div>
                  <div class="header-right">
                    <el-select 
                      v-model="filterType" 
                      placeholder="资源类型" 
                      clearable
                      class="filter-select animate__animated animate__fadeIn"
                    >
                      <el-option
                        v-for="type in resourceTypes"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      />
                    </el-select>
                    <el-button 
                      type="primary" 
                      @click="handleAdd"
                      class="add-btn animate__animated animate__pulse animate__infinite"
                    >
                      <el-icon><Plus /></el-icon>
                      添加资源
                    </el-button>
                  </div>
                </div>
              </template>
              <el-table 
                :data="filteredResources" 
                style="width: 100%"
                v-loading="loading"
                class="resource-table animate__animated animate__fadeIn"
              >
                <el-table-column prop="name" label="资源名称" min-width="120">
                  <template #default="scope">
                    <div class="resource-name">
                      <el-icon><Goods /></el-icon>
                      <span>{{ scope.row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="资源类型" min-width="120">
                  <template #default="scope">
                    <el-tag :type="getTypeTagType(scope.row.type)">
                      {{ scope.row.type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量" min-width="100">
                  <template #default="scope">
                    <el-progress 
                      :percentage="getQuantityPercentage(scope.row.quantity)"
                      :status="getQuantityStatus(scope.row.quantity)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="location" label="存放位置" min-width="120">
                  <template #default="scope">
                    <div class="location-info">
                      <el-icon><Location /></el-icon>
                      <span>{{ scope.row.location }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" min-width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusTagType(scope.row.status)">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="scope">
                    <el-button 
                      size="small" 
                      type="primary" 
                      link
                      @click="handleEdit(scope.row)"
                    >
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                    <el-button 
                      size="small" 
                      type="danger" 
                      link
                      @click="handleDelete(scope.row)"
                    >
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- 添加/编辑资源对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加资源' : '编辑资源'"
      width="50%"
      class="resource-dialog animate__animated animate__zoomIn"
    >
      <el-form 
        ref="formRef"
        :model="resourceForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="resourceForm.type" placeholder="请选择资源类型">
            <el-option
              v-for="type in resourceTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number 
            v-model="resourceForm.quantity" 
            :min="0"
            :max="1000"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-select v-model="resourceForm.location" placeholder="请选择存放位置">
            <el-option
              v-for="location in locations"
              :key="location.value"
              :label="location.label"
              :value="location.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="resourceForm.status" placeholder="请选择状态">
            <el-option label="可用" value="可用" />
            <el-option label="维护中" value="维护中" />
            <el-option label="已用完" value="已用完" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  Plus, 
  Search, 
  Edit, 
  Delete, 
  Goods, 
  Location,
  Box,
  Present,
  School,
  House
} from '@element-plus/icons-vue'
import NavHeader from '../components/NavHeader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import gsap from 'gsap'

export default {
  name: 'ResourceManagement',
  components: {
    NavHeader,
    Plus,
    Search,
    Edit,
    Delete,
    Goods,
    Location,
    Box,
    Present,
    School,
    House
  },
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('add')
    const searchQuery = ref('')
    const filterType = ref('')
    const formRef = ref(null)

    const statistics = [
      {
        title: '总资源数',
        value: '180',
        icon: 'Box',
        iconClass: 'text-primary'
      },
      {
        title: '教育物资',
        value: '100',
        icon: 'School',
        iconClass: 'text-success'
      },
      {
        title: '生活物资',
        value: '50',
        icon: 'House',
        iconClass: 'text-warning'
      },
      {
        title: '娱乐物资',
        value: '30',
        icon: 'Present',
        iconClass: 'text-danger'
      }
    ]

    const resourceTypes = [
      { label: '教育物资', value: '教育物资' },
      { label: '生活物资', value: '生活物资' },
      { label: '娱乐物资', value: '娱乐物资' }
    ]

    const locations = [
      { label: '仓库A', value: '仓库A' },
      { label: '仓库B', value: '仓库B' },
      { label: '仓库C', value: '仓库C' }
    ]

    const resources = ref([
      {
        name: '学习用品',
        type: '教育物资',
        quantity: 100,
        location: '仓库A',
        status: '可用'
      },
      {
        name: '衣物',
        type: '生活物资',
        quantity: 50,
        location: '仓库B',
        status: '可用'
      },
      {
        name: '玩具',
        type: '娱乐物资',
        quantity: 30,
        location: '仓库C',
        status: '可用'
      }
    ])

    const resourceForm = ref({
      name: '',
      type: '',
      quantity: 0,
      location: '',
      status: '可用'
    })

    const rules = {
      name: [
        { required: true, message: '请输入资源名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择资源类型', trigger: 'change' }
      ],
      quantity: [
        { required: true, message: '请输入数量', trigger: 'blur' }
      ],
      location: [
        { required: true, message: '请选择存放位置', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    }

    const filteredResources = computed(() => {
      let result = resources.value

      if (searchQuery.value) {
        result = result.filter(resource => 
          resource.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          resource.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          resource.location.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      if (filterType.value) {
        result = result.filter(resource => resource.type === filterType.value)
      }

      return result
    })

    const getTypeTagType = (type) => {
      const types = {
        '教育物资': 'success',
        '生活物资': 'warning',
        '娱乐物资': 'danger'
      }
      return types[type] || 'info'
    }

    const getStatusTagType = (status) => {
      const types = {
        '可用': 'success',
        '维护中': 'warning',
        '已用完': 'danger'
      }
      return types[status] || 'info'
    }

    const getQuantityPercentage = (quantity) => {
      return Math.min((quantity / 100) * 100, 100)
    }

    const getQuantityStatus = (quantity) => {
      if (quantity <= 10) return 'exception'
      if (quantity <= 30) return 'warning'
      return 'success'
    }

    const handleAdd = () => {
      dialogType.value = 'add'
      resourceForm.value = {
        name: '',
        type: '',
        quantity: 0,
        location: '',
        status: '可用'
      }
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogType.value = 'edit'
      resourceForm.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除资源"${row.name}"吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = resources.value.findIndex(item => item.name === row.name)
        if (index !== -1) {
          resources.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      }).catch(() => {})
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate((valid) => {
        if (valid) {
          if (dialogType.value === 'add') {
            resources.value.push({ ...resourceForm.value })
            ElMessage.success('添加成功')
          } else {
            const index = resources.value.findIndex(item => item.name === resourceForm.value.name)
            if (index !== -1) {
              resources.value[index] = { ...resourceForm.value }
              ElMessage.success('更新成功')
            }
          }
          dialogVisible.value = false
        }
      })
    }

    return {
      loading,
      dialogVisible,
      dialogType,
      searchQuery,
      filterType,
      formRef,
      statistics,
      resourceTypes,
      locations,
      resources,
      resourceForm,
      rules,
      filteredResources,
      getTypeTagType,
      getStatusTagType,
      getQuantityPercentage,
      getQuantityStatus,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.resource-management {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 24px;
  text-align: center;
}

.mt-4 {
  margin-top: 2rem;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.text-primary { color: #409EFF; }
.text-success { color: #67C23A; }
.text-warning { color: #E6A23C; }
.text-danger { color: #F56C6C; }

.resource-card {
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
}

.search-input {
  width: 300px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-select {
  width: 150px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resource-table {
  margin-top: 1rem;
}

.resource-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-col {
    width: 100% !important;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-left {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .header-right {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 