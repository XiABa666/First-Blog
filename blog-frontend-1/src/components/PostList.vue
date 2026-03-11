<template>
  <div class="postlist-container">
    <div class="list-card">
      <div class="header-row">
        <h1 class="page-title">文章列表</h1>


        <div class="sort-controls">
          <button class="sort-btn" :class="{ active: sortBy === 'time' }" @click="sortByTime">
            🕒 最新发布
          </button>
          <button class="sort-btn" :class="{ active: sortBy === 'views' }" @click="sortByViews">
            👁️ 最多阅读
          </button>
        </div>
      </div>


      <div v-if="isLoading" class="loading-state">
        <span class="loading-spinner"></span>
        <span>加载中...</span>
      </div>


      <ul v-else-if="sortedPosts.length" class="post-list">
        <li v-for="post in sortedPosts" :key="post.id" class="post-item">
          <router-link :to="'/posts/' + post.id" class="post-link">
            <div class="post-info">
              <h2 class="post-title">{{ post.title }}</h2>
              <div class="post-meta">
                <span class="author">👤 {{ post.username }}</span>
                <span class="views">👁️ {{ post.views || 0 }}</span>

                <span v-if="post.created_at" class="post-time">
                  🕒 {{ formatDate(post.created_at) }}
                </span>
              </div>
            </div>
            <span class="read-more">→</span>
          </router-link>
        </li>
      </ul>


      <div v-else class="empty-message">
        ✨ 还没有文章，<router-link to="/create" class="create-link">去发布第一篇吧</router-link>
      </div>
    </div>


    <Transition name="fade">
      <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
        ⬆️
      </button>
    </Transition>


    <Transition name="fade">
      <div v-if="showMessage" class="toast-message" :class="toastTypeClass">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import axios from 'axios'

const posts = ref([])
const isLoading = ref(true)
const sortBy = ref('time')

const showBackToTop = ref(false)
// let scrollListener = null

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

const sortedPosts = computed(() => {
  if (!posts.value.length) return []
  const sorted = [...posts.value]
  if (sortBy.value === 'time') {

    return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else {
    return sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
  }
})

const sortByTime = () => {
  sortBy.value = 'time'
}

const sortByViews = () => {
  sortBy.value = 'views'
}

const fetchPosts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/posts')
    posts.value = res.data
  } catch (err) {
    console.error('获取文章列表失败', err)
    showToast('获取文章列表失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  fetchPosts()
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (messageTimer) clearTimeout(messageTimer)
})
</script>

<style scoped>
.postlist-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.list-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 900px;
  padding: 2rem 2.5rem;
  border: 1px solid #e9edf4;
  transition: box-shadow 0.2s ease;
}

.list-card:hover {
  box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.1);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e9edf4;
  padding-bottom: 0.75rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  margin: 0;
  border-bottom: none;
  padding-bottom: 0;
}


.sort-controls {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 30px;
  padding: 0.4rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sort-btn:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #334155;
}

.sort-btn.active {
  background: linear-gradient(145deg, #2563eb, #1e40af);
  border-color: #2563eb;
  color: white;
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

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  border-bottom: 1px solid #edf2f7;
  transition: background-color 0.2s;
}

.post-item:hover {
  background-color: #f8fafc;
}

.post-item:last-child {
  border-bottom: none;
}

.post-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.post-link:hover {
  transform: translateX(5px);
}

.post-info {
  flex: 1;
}

.post-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.3rem 0;
  word-break: break-word;
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  color: #64748b;
  font-size: 0.9rem;
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

.post-time {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #64748b;
}

.read-more {
  font-size: 1.5rem;
  color: #2563eb;
  opacity: 0.5;
  transition: opacity 0.2s, transform 0.2s;
  margin-left: 1rem;
}

.post-link:hover .read-more {
  opacity: 1;
  transform: translateX(3px);
}


.empty-message {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 3rem 0;
  font-size: 1.1rem;
}

.create-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.create-link:hover {
  text-decoration: underline;
}


.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 999;
}

.back-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
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
  .postlist-container {
    padding: 1rem;
  }

  .list-card {
    padding: 1.5rem;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .sort-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .sort-btn {
    flex: 1;
    text-align: center;
    padding: 0.4rem 0;
  }

  .post-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-title {
    font-size: 1.2rem;
  }

  .post-meta {
    gap: 1rem;
  }

  .read-more {
    align-self: flex-end;
    font-size: 1.3rem;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .toast-message {
    top: 20px;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>