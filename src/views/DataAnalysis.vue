<template>
  <div class="data-analysis animate__animated animate__fadeIn">
    <el-container>
      <el-header>
        <nav-header />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="24">
            <h2 class="page-title animate__animated animate__fadeInDown">数据分析</h2>
          </el-col>
        </el-row>

        <!-- 基础数据概览 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="6" v-for="(item, index) in statistics" :key="index">
            <el-card 
              shadow="hover" 
              class="statistics-card animate__animated"
              :class="`animate__fadeInUp animate__delay-${index + 1}s`"
              :body-style="{ padding: '20px' }"
              @mouseenter="(e) => handleCardHover(e.target)"
              @mouseleave="(e) => handleCardLeave(e.target)"
            >
              <div class="statistics-icon">
                <el-icon :size="24" :color="item.color">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <div class="statistics-value" :style="{ color: item.color }">{{ item.value }}</div>
              <div class="statistics-label">{{ item.label }}</div>
              <div class="statistics-trend" :class="item.trend > 0 ? 'up' : 'down'">
                <el-icon><component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                {{ Math.abs(item.trend) }}%
              </div>
            </el-card>
          </el-col>
        </el-row>
  <el-row :gutter="20" class="mt-4">
  <el-col :span="24">
    <div class="chart-header"> <!-- 新增标题容器 -->
      <h3 class="chart-title">留守儿童人数与流动儿童人数不同年份对比</h3>
      <el-tooltip effect="dark" >
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="chart-container">
      <iframe 
        src="https://flo.uri.sh/visualisation/23556577/embed"
        class="chart-iframe"
        title="留守儿童居住情况分布">
      </iframe>
    </div>
  </el-col>
</el-row>
<!-- 第一个图表 -->
<el-row :gutter="20" class="mt-4">
  <el-col :span="24">
    <div class="chart-header"> 
      <h3 class="chart-title">2020年留守儿童各省份分布</h3>
      <el-tooltip effect="dark" content="这里是提示内容">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="chart-container">
      <iframe 
        src="https://flo.uri.sh/visualisation/23557785/embed"
        style="width:100%; height:600px; border:none;"
        title="留守儿童地区分布地图">
      </iframe>
    </div>
  </el-col>
</el-row>
<el-row :gutter="20" class="mt-4">
  <el-col :span="24">
    <div class="chart-header"> 
      <h3 class="chart-title">留守儿童居住情况</h3>
      <el-tooltip effect="dark" >
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="chart-container">
      <iframe 
        src="https://flo.uri.sh/visualisation/23560969/embed"
        style="width:100%; height:600px; border:none;"
        title="留守儿童居住情况分布">
      </iframe>
    </div>
  </el-col>
</el-row>
<el-row :gutter="20" class="mt-4">
  <el-col :span="24">
    <div class="chart-header"> 
      <h3 class="chart-title">不同年份各个年龄段留守儿童人数对比</h3>
      <el-tooltip effect="dark" >
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="chart-container">
      <iframe 
        src="https://flo.uri.sh/visualisation/23559840/embed"
        style="width:100%; height:600px; border:none;"
        title="不同年份各个年龄段留守儿童人数">
      </iframe>
    </div>
  </el-col>
</el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref } from 'vue'
import NavHeader from '../components/NavHeader.vue'
import gsap from 'gsap'
import {
  User,
  School,
  Calendar,
  Money,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

export default {
  name: 'DataAnalysis',
  components: {
    NavHeader,
    User,
    School,
    Calendar,
    Money,
    ArrowUp,
    ArrowDown
  },
  setup() {
     const statistics = ref([
      {
        label: '留守儿童总数',
        value: '643.6万',
        icon: 'User',
        color: '#409EFF',
        trend: -85.22
      },
      {
        label: '帮扶活动次数',
        value: '5.4万次',
        icon: 'Calendar',
        color: '#67C23A',
        trend: 300
      },
      {
        label: '帮扶资金投入',
        value: '￥3219亿',
        icon: 'Money',
        color: '#E6A23C',
        trend: 1293
      },
      {
        label: '帮扶学校数量',
        value: '17.3万所',
        icon: 'School',
        color: '#F56C6C',
        trend: 146.9
      }
    ])



    // 处理卡片悬停效果
    const handleCardHover = (card) => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        zIndex: 10
      })
    }

    const handleCardLeave = (card) => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        boxShadow: '',
        zIndex: 1
      })
    }

    return {
      statistics,
      handleCardHover,
      handleCardLeave
    }
  }
}
</script>

<style scoped>
.data-analysis {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
}

.statistics-card {
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  transform-origin: center center;
   box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.statistics-icon {
  margin-bottom: 10px;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.statistics-label {
  color: #666;
  margin-bottom: 5px;
}

.statistics-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
}

.statistics-trend.up {
  color: #67C23A;
}

.statistics-trend.down {
  color: #F56C6C;
}

.mt-4 {
  margin-top: 20px;
}
.chart-container {
  background: white;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 3px 10px rgba(0,0,0,0.1); /* 阴影 */
  overflow: hidden; /* 确保iframe圆角生效 */
  transition: all 0.3s ease; /* 悬停动画过渡 */
}
.chart-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}
.chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.chart-title {
  margin: 0;
  color: #333;
  font-size: 18px;
}
.chart-iframe {
  width: 100%;
  height: 600px;
  display: block;
}
</style>