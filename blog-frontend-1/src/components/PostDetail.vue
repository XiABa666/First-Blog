<template>
  <div class="post-detail-container">
    <div class="post-card">

      <div v-if="isLoading" class="loading-state">
        <span class="loading-spinner"></span>
        <span>加载中...</span>
      </div>


      <template v-else-if="post.id">
        <h2 class="form-title">{{ post.title }}</h2>


        <div class="post-meta">
          <div class="meta-left">
            <span class="author">👤 {{ post.username }}</span>
            <span class="views">👁️ {{ post.views }}</span>

            <span v-if="post.created_at" class="created-time">
              🕒 {{ formatDate(post.created_at) }}
            </span>
          </div>
          <span class="post-id">ID:{{ post.id }}</span>
        </div>


        <div class="post-content">{{ post.content }}</div>


        <div class="like-section">
          <LikeButton type="post" :id="post.id" :likes="post.likes" :dislikes="post.dislikes"
            @update-like="post.likes++" @update-dislike="post.dislikes++" />
        </div>

        <CommentSection :postId="postId" />


        <div class="back-action">
          <button @click="goBack" class="btn-cancel">🏠 返回首页</button>
        </div>
      </template>


      <div v-else class="error-message">
        ⚠️ 文章不存在或已被删除
      </div>
    </div>


    <Transition name="fade">
      <div v-if="showMessage" class="toast-message" :class="toastTypeClass">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import CommentSection from './CommentSection.vue'
import LikeButton from './LikeButton.vue'

const route = useRoute()
const router = useRouter()
const postId = route.params.id


const post = ref({})
const isLoading = ref(true)


const message = ref('')
const showMessage = ref(false)
const messageType = ref('error')
let messageTimer = null

const showToast = (text, type = 'error') => {
  if (messageTimer) clearTimeout(messageTimer)
  message.value = text
  messageType.value = type
  showMessage.value = true
  messageTimer = setTimeout(() => {
    showMessage.value = false
    messageTimer = null
  }, 3000)
}


const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}


const fetchPost = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/posts/${postId}`)
    post.value = res.data
  } catch (err) {
    console.error('获取文章失败', err)
    if (err.response?.status === 404) {
      showToast('文章不存在', 'error')
    } else {
      showToast('获取文章失败，请稍后重试', 'error')
    }
  } finally {
    isLoading.value = false
  }
}


const goBack = () => {
  router.push('/')
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.post-detail-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.post-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 800px;
  padding: 2rem 2.5rem;
  border: 1px solid #e9edf4;
  transition: box-shadow 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.1);
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  word-break: break-word;
}


.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
  border-bottom: 1px solid #e9edf4;
  padding-bottom: 0.75rem;
}

.meta-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.author {
  font-weight: 500;
  color: #475569;
}

.views {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}


.created-time {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #64748b;
}

.post-id {
  font-weight: 500;
  color: #2563eb;
  background-color: #eff6ff;
  padding: 0.2rem 0.8rem;
  border-radius: 30px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1e293b;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 2rem 0;
  padding: 0 0.5rem;
}

.like-section {
  display: flex;
  justify-content: flex-end;
  margin: 1.5rem 0 1rem;
}

.back-action {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 40px;
  padding: 0.6rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}


.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #64748b;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


.error-message {
  text-align: center;
  color: #b91c1c;
  font-size: 1.2rem;
  padding: 3rem 0;
}


.toast-message {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  white-space: nowrap;
  max-width: 90%;
  background: white;
  color: #1e293b;
  border: 1px solid #e9edf4;
}

.toast-message.error {
  background: linear-gradient(145deg, #dc2626, #b91c1c);
  color: white;
  border: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


@media (max-width: 700px) {
  .post-detail-container {
    padding: 1rem;
  }

  .post-card {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .meta-left {
    width: 100%;
    justify-content: space-between;
  }

  .post-id {
    align-self: flex-end;
    margin-top: 0.2rem;
  }

  .post-content {
    font-size: 1rem;
    margin: 1.5rem 0;
  }

  .btn-cancel {
    width: 100%;
    text-align: center;
  }

  .toast-message {
    top: 20px;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>