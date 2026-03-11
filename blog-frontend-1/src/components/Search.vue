<template>
  <div class="search-container">
    <div class="search-card">
      <h2 class="form-title">搜索文章</h2>

      <div class="search-box">
        <input v-model="keyword" type="text" placeholder="输入关键词，按回车搜索" class="search-input"
          @keyup.enter="searchPosts" />
        <button @click="searchPosts" class="btn-search" :disabled="isLoading">
          <span v-if="!isLoading">搜索</span>
          <span v-else>搜索中...</span>
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <span class="loading-spinner"></span>
        <span>搜索中...</span>
      </div>

      <div v-else-if="hasSearched && posts.length" class="results-section">
        <p class="result-count">共找到 {{ posts.length }} 篇文章</p>
        <ul class="post-list">
          <li v-for="post in posts" :key="post.id" class="post-item">
            <router-link :to="'/posts/' + post.id" class="post-link">
              <div class="post-info">
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-meta">
                  <span class="author">👤 {{ post.username }}</span>
                  <span class="views">👁️ {{ post.views || 0 }}</span>
                </div>
              </div>
              <span class="read-more">→</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div v-else-if="hasSearched && !posts.length" class="empty-message">
        ✨ 没有找到相关文章
      </div>

      <div v-else class="empty-message initial">
        👆 输入关键词开始搜索
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
import { ref } from 'vue'
import axios from 'axios'

const keyword = ref('')
const posts = ref([])
const hasSearched = ref(false)
const isLoading = ref(false)

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
  }, 1000)
}

const searchPosts = async () => {
  if (!keyword.value.trim()) {
    showToast('请输入搜索关键词')
    return
  }

  isLoading.value = true
  hasSearched.value = true

  try {
    const res = await axios.get('http://localhost:3000/api/posts/search', {
      params: {
        keyword: keyword.value
      }
    })
    posts.value = res.data
  } catch (err) {
    console.error('搜索失败', err)
    showToast('搜索失败，请稍后重试')
    posts.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.search-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 800px;
  padding: 2rem 2.5rem;
  border: 1px solid #e9edf4;
  transition: box-shadow 0.2s ease;
}

.search-card:hover {
  box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.1);
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  border-bottom: 2px solid #e9edf4;
  padding-bottom: 0.75rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #cbd5e1;
  border-radius: 40px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #f9fafc;
  transition: all 0.2s ease;
  color: #1e293b;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background-color: #ffffff;
}

.search-input:hover {
  border-color: #94a3b8;
}

.btn-search {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  white-space: nowrap;
}

.btn-search:hover:not(:disabled) {
  background: linear-gradient(145deg, #1e4fc9, #153e9e);
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -2px rgba(37, 99, 235, 0.4);
}

.btn-search:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #94a3b8;
  box-shadow: none;
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

.result-count {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
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
  font-size: 1.2rem;
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

.empty-message.initial {
  color: #cbd5e1;
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

.toast-message.success {
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: white;
  border: none;
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
  .search-container {
    padding: 1rem;
  }

  .search-card {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .search-box {
    flex-direction: column;
    gap: 0.8rem;
  }

  .btn-search {
    width: 100%;
  }

  .post-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-meta {
    gap: 1rem;
  }

  .read-more {
    align-self: flex-end;
    font-size: 1.3rem;
  }

  .toast-message {
    top: 20px;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>