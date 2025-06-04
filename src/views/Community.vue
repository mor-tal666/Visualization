<template>
  <div class="community animate__animated animate__fadeIn">
    <el-container>
      <el-header>
        <nav-header />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="24">
            <h2 class="page-title animate__animated animate__fadeInDown">社区互动</h2>
          </el-col>
        </el-row>

        <!-- 社区统计卡片 -->
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

        <!-- 社区主体 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <!-- 发布动态 -->
            <el-card class="post-card animate__animated animate__fadeIn">
              <div class="post-editor">
                <el-input
                  v-model="newPost.content"
                  type="textarea"
                  :rows="3"
                  placeholder="分享你的想法..."
                  class="post-input animate__animated animate__fadeIn"
                />
                <div class="post-actions">
                  <el-upload
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false"
                    :on-change="handleImageChange"
                    :limit="9"
                    class="post-upload animate__animated animate__fadeIn"
                  >
                    <el-icon><Picture /></el-icon>
                  </el-upload>
                  <el-button 
                    type="primary" 
                    @click="handlePost"
                    :loading="posting"
                    class="post-btn animate__animated animate__fadeIn"
                  >
                    发布
                  </el-button>
                </div>
              </div>
            </el-card>

            <!-- 动态列表 -->
            <div class="post-list">
              <el-card 
                v-for="(post, index) in posts" 
                :key="post.id"
                class="post-item animate__animated animate__fadeIn"
                :class="`animate__delay-${index + 1}s`"
              >
                <div class="post-header">
                  <div class="user-info">
                    <el-avatar :size="40" :src="post.avatar" />
                    <div class="user-details">
                      <div class="username">{{ post.username }}</div>
                      <div class="post-time">{{ post.time }}</div>
                    </div>
                  </div>
                  <el-dropdown v-if="post.username === currentUser">
                    <el-button type="text">
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="handleEditPost(post)">编辑</el-dropdown-item>
                        <el-dropdown-item @click="handleDeletePost(post)" class="text-danger">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="post-content">{{ post.content }}</div>
                <div class="post-images" v-if="post.images && post.images.length">
                  <el-image
                    v-for="(image, imgIndex) in post.images"
                    :key="imgIndex"
                    :src="image"
                    :preview-src-list="post.images"
                    fit="cover"
                    class="post-image animate__animated animate__fadeIn"
                  />
                </div>
                <div class="post-actions">
                  <el-button 
                    type="text" 
                    :class="{ 'is-liked': post.isLiked }"
                    @click="handleLike(post)"
                  >
                    <el-icon><Star /></el-icon>
                    {{ post.likes }}
                  </el-button>
                  <el-button 
                    type="text"
                    @click="handleComment(post)"
                  >
                    <el-icon><ChatDotRound /></el-icon>
                    {{ post.comments.length }}
                  </el-button>
                  <el-button 
                    type="text"
                    @click="handleShare(post)"
                  >
                    <el-icon><Share /></el-icon>
                    分享
                  </el-button>
                </div>
                <!-- 评论区 -->
                <div class="comments-section" v-if="post.showComments">
                  <div 
                    v-for="comment in post.comments" 
                    :key="comment.id"
                    class="comment-item animate__animated animate__fadeIn"
                  >
                    <el-avatar :size="32" :src="comment.avatar" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-username">{{ comment.username }}</span>
                        <span class="comment-time">{{ comment.time }}</span>
                      </div>
                      <div class="comment-text">{{ comment.content }}</div>
                    </div>
                  </div>
                  <div class="comment-input">
                    <el-input
                      v-model="post.newComment"
                      placeholder="写下你的评论..."
                      @keyup.enter="submitComment(post)"
                    >
                      <template #append>
                        <el-button @click="submitComment(post)">发送</el-button>
                      </template>
                    </el-input>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>

          <el-col :span="8">
            <!-- 活动列表 -->
            <el-card class="activity-card animate__animated animate__fadeIn">
              <template #header>
                <div class="card-header">
                  <span>近期活动</span>
                  <el-button type="text" @click="handleRefreshActivities">
                    <el-icon><Refresh /></el-icon>
                  </el-button>
                </div>
              </template>
              <div class="activity-list">
                <div 
                  v-for="(activity, index) in activities" 
                  :key="activity.id"
                  class="activity-item animate__animated animate__fadeIn"
                  :class="`animate__delay-${index + 1}s`"
                >
                  <div class="activity-info">
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.description }}</p>
                    <div class="activity-meta">
                      <span><el-icon><Calendar /></el-icon> {{ activity.date }}</span>
                      <span><el-icon><Location /></el-icon> {{ activity.location }}</span>
                    </div>
                    <el-progress 
                      :percentage="activity.registered / activity.capacity * 100"
                      :format="format"
                      :status="getProgressStatus(activity)"
                    />
                    <div class="activity-participants">
                      <el-avatar 
                        v-for="(participant, pIndex) in activity.participants"
                        :key="pIndex"
                        :size="32"
                        :src="participant.avatar"
                      />
                      <span class="participant-count" v-if="activity.participants.length > 3">
                        +{{ activity.participants.length - 3 }}
                      </span>
                    </div>
                  </div>
                  <el-button 
                    type="primary" 
                    :disabled="activity.registered >= activity.capacity"
                    @click="handleJoinActivity(activity)"
                  >
                    {{ activity.registered >= activity.capacity ? '已满员' : '参加' }}
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  Picture,
  Star,
  ChatDotRound,
  Share,
  More,
  Refresh,
  Calendar,
  Location,
  User,
  Message,
  View,
  Share as ShareIcon
} from '@element-plus/icons-vue'
import NavHeader from '../components/NavHeader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import gsap from 'gsap'

export default {
  name: 'Community',
  components: {
    NavHeader,
    Picture,
    Star,
    ChatDotRound,
    Share,
    More,
    Refresh,
    Calendar,
    Location,
    User,
    Message,
    View,
    ShareIcon
  },
  setup() {
    const currentUser = ref('张三')
    const posting = ref(false)
    const newPost = ref({
      content: '',
      images: []
    })

    const statistics = [
      {
        title: '总用户数',
        value: '1,234',
        icon: 'User',
        iconClass: 'text-primary'
      },
      {
        title: '动态数',
        value: '5,678',
        icon: 'Message',
        iconClass: 'text-success'
      },
      {
        title: '活动数',
        value: '89',
        icon: 'Calendar',
        iconClass: 'text-warning'
      },
      {
        title: '互动数',
        value: '12,345',
        icon: 'View',
        iconClass: 'text-danger'
      }
    ]

    const posts = ref([
      {
        id: 1,
        username: '张三',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '今天参加了关爱留守儿童的活动，收获很多！',
        time: '10分钟前',
        likes: 12,
        isLiked: false,
        images: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        ],
        comments: [
          {
            id: 1,
            username: '李四',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            content: '真棒！',
            time: '5分钟前'
          }
        ],
        showComments: false,
        newComment: ''
      }
    ])

    const activities = ref([
      {
        id: 1,
        title: '周末读书会',
        description: '为留守儿童举办读书分享活动',
        date: '2024-03-20',
        location: '社区活动中心',
        capacity: 20,
        registered: 15,
        participants: [
          { avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
          { avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
          { avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
          { avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }
        ]
      }
    ])

    const handleImageChange = (file) => {
      newPost.value.images.push(URL.createObjectURL(file.raw))
    }

    const handlePost = async () => {
      if (!newPost.value.content.trim()) {
        ElMessage.warning('请输入内容')
        return
      }

      posting.value = true
      try {
        // 模拟发布延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        posts.value.unshift({
          id: Date.now(),
          username: currentUser.value,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          content: newPost.value.content,
          time: '刚刚',
          likes: 0,
          isLiked: false,
          images: [...newPost.value.images],
          comments: [],
          showComments: false,
          newComment: ''
        })

        newPost.value = {
          content: '',
          images: []
        }
        ElMessage.success('发布成功')
      } finally {
        posting.value = false
      }
    }

    const handleLike = (post) => {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }

    const handleComment = (post) => {
      post.showComments = !post.showComments
    }

    const handleShare = (post) => {
      ElMessage.success('分享功能开发中')
    }

    const handleEditPost = (post) => {
      ElMessage.success('编辑功能开发中')
    }

    const handleDeletePost = (post) => {
      ElMessageBox.confirm(
        '确定要删除这条动态吗？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = posts.value.findIndex(p => p.id === post.id)
        if (index !== -1) {
          posts.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      }).catch(() => {})
    }

    const submitComment = (post) => {
      if (!post.newComment.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      post.comments.push({
        id: Date.now(),
        username: currentUser.value,
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: post.newComment,
        time: '刚刚'
      })

      post.newComment = ''
    }

    const handleRefreshActivities = () => {
      ElMessage.success('活动列表已更新')
    }

    const handleJoinActivity = (activity) => {
      if (activity.registered >= activity.capacity) {
        ElMessage.warning('活动已满员')
        return
      }

      activity.registered++
      activity.participants.push({
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      })
      ElMessage.success('报名成功')
    }

    const format = (percentage) => {
      return `${percentage}%`
    }

    const getProgressStatus = (activity) => {
      const percentage = (activity.registered / activity.capacity) * 100
      if (percentage >= 100) return 'exception'
      if (percentage >= 80) return 'warning'
      return 'success'
    }

    return {
      currentUser,
      posting,
      newPost,
      statistics,
      posts,
      activities,
      handleImageChange,
      handlePost,
      handleLike,
      handleComment,
      handleShare,
      handleEditPost,
      handleDeletePost,
      submitComment,
      handleRefreshActivities,
      handleJoinActivity,
      format,
      getProgressStatus
    }
  }
}
</script>

<style scoped>
.community {
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

.post-card {
  margin-bottom: 2rem;
}

.post-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-input {
  width: 100%;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-upload {
  display: inline-block;
}

.post-btn {
  min-width: 100px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  transition: all 0.3s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #303133;
}

.post-time {
  font-size: 12px;
  color: #909399;
}

.post-content {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
  cursor: pointer;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #EBEEF5;
}

.post-actions .el-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.is-liked {
  color: #409EFF;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #EBEEF5;
}

.comment-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-username {
  font-weight: bold;
  color: #303133;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-text {
  line-height: 1.4;
}

.comment-input {
  margin-top: 1rem;
}

.activity-card {
  position: sticky;
  top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: #f5f7fa;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-info h4 {
  margin: 0;
  color: #303133;
}

.activity-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  color: #909399;
  font-size: 12px;
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-participants {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.participant-count {
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-col {
    width: 100% !important;
  }
  
  .post-images {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .post-image {
    height: 100px;
  }
  
  .activity-card {
    position: static;
    margin-top: 2rem;
  }
}
</style> 