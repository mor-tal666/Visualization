<template>
  <div class="home animate__animated animate__fadeIn">
    <div class="welcome-card animate__animated animate__fadeIn">
      <h1 class="animate__animated animate__fadeInDown">欢迎使用留守儿童关爱平台</h1>
      <p class="animate__animated animate__fadeInUp">让我们一起为留守儿童的成长保驾护航</p>
    </div>

    <!-- 轮播图 -->
    <div class="carousel-container">
      <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
        <Slide v-for="(slide, index) in slides" :key="index">
          <div class="carousel-slide">
            <img :src="slide.image" :alt="slide.title">
            <div class="slide-content">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </Slide>
      </Carousel>
    </div>

    <div class="feature-cards">
      <div class="feature-card animate__animated animate__fadeInLeft" @click="navigateTo('/data-analysis')">
        <el-icon class="feature-icon"><DataAnalysis /></el-icon>
        <h3>数据分析</h3>
        <p>深入了解留守儿童现状</p>
      </div>
      <div class="feature-card animate__animated animate__fadeInUp" @click="navigateTo('/resource-management')">
        <el-icon class="feature-icon"><Box /></el-icon>
        <h3>资源管理</h3>
        <p>高效管理关爱资源</p>
      </div>
      <div class="feature-card animate__animated animate__fadeInRight" @click="navigateTo('/policy-support')">
        <el-icon class="feature-icon"><Document /></el-icon>
        <h3>政策支持</h3>
        <p>及时了解最新政策</p>
      </div>
    </div>

    <!-- 最新动态 -->
    <div class="news-section animate__animated animate__fadeIn">
      <h2>最新动态</h2>
      <div class="news-list">
        <div v-for="(news, index) in newsList" :key="index" class="news-item">
          <el-icon><Bell /></el-icon>
          <span>{{ news }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { DataAnalysis, Box, Document, Bell } from '@element-plus/icons-vue'
import 'animate.css'
import guanaiImg from '@/assets/guanai.jpg'
import ziyuanImg from '@/assets/ziyuan.jpg'
import xinliImg from '@/assets/xinli.jpg'

const router = useRouter()

const slides = ref([
  {
    title: '关爱留守儿童',
    description: '让我们一起为留守儿童的成长保驾护航',
    image: guanaiImg
  },
  {
    title: '教育资源支持',
    description: '提供优质的教育资源和学习机会',
    image: ziyuanImg
  },
  {
    title: '心理健康关怀',
    description: '关注留守儿童的心理健康',
    image: xinliImg
  }
])

const newsList = ref([
  '2024年春季关爱活动开始报名',
  '新增心理健康咨询服务',
  '最新政策：关于加强留守儿童关爱工作的指导意见',
  '社区互助计划启动'
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.welcome-card {
  text-align: center;
  padding: 40px;
  margin-bottom: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-card h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 20px;
}

.welcome-card p {
  font-size: 1.2em;
  color: #666;
}

.carousel-container {
  margin: 30px 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-slide {
  position: relative;
  height: 400px;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.slide-content h2 {
  font-size: 1.8em;
  margin-bottom: 10px;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3em;
  color: #409EFF;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
}

.news-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  margin-top: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.news-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.news-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.news-item .el-icon {
  color: #409EFF;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 20px;
  }

  .welcome-card h1 {
    font-size: 2em;
  }

  .carousel-slide {
    height: 300px;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style> 