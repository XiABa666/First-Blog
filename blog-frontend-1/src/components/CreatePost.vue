<template>
  <div class="create-post-container">
    <div class="post-card">
      <h2 class="form-title">发布新文章</h2>
      <div class="form-group">
        <label for="title">标题 <span class="required">*</span></label>
        <input id="title" v-model="title" type="text" placeholder="请输入文章标题" class="form-input" maxlength="100" />
        <span class="input-hint" v-if="title.length > 0">{{ title.length }}/100</span>
      </div>

      <div class="form-group">
        <label for="content">内容 <span class="required">*</span></label>
        <textarea id="content" v-model="content" placeholder="请写下你的文章内容..." class="form-textarea" rows="8"></textarea>
      </div>

      <div class="form-actions">
        <button @click="submit" class="btn-submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">发布文章</span>
          <span v-else>发布中...</span>
        </button>
        <button @click="cancel" class="btn-cancel" type="button">返回首页</button>
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
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const title = ref('')
const content = ref('')
const isSubmitting = ref(false)


const message = ref('')
const showMessage = ref(false)
const messageType = ref('success')
let messageTimer = null


const showToast = (text, type = 'success') => {

  if (messageTimer) clearTimeout(messageTimer)
  message.value = text
  messageType.value = type
  showMessage.value = true
  messageTimer = setTimeout(() => {
    showMessage.value = false
    messageTimer = null
  }, 3000)
}

const submit = async () => {

  if (!title.value || title.value.trim() === '') {
    showToast('标题不能为空', 'error')
    return
  }
  if (title.value.trim().length > 100) {
    showToast('标题过长，最多100个字符', 'error')
    return
  }
  if (!content.value || content.value.trim() === '') {
    showToast('内容不能为空', 'error')
    return
  }

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) {

    router.push('/login')
    return
  }

  isSubmitting.value = true
  try {
    await axios.post(
      'http://localhost:3000/api/posts',
      {
        title: title.value.trim(),
        content: content.value.trim()
      },
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )
    showToast('发布成功', 'success')

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    console.error('发布失败', err.response?.status, err.response?.data)
    showToast('发布失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  router.back()
}
</script>

<style scoped>
.create-post-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  position: relative;
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
  margin-bottom: 2rem;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  border-bottom: 2px solid #e9edf4;
  padding-bottom: 0.75rem;
}

.form-group {
  margin-bottom: 1.8rem;
  position: relative;
}

label {
  display: block;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}


.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.5rem 0.8rem 1rem;
  /* 上 右 下 左 */
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #f9fafc;
  transition: all 0.2s ease;
  color: #1e293b;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background-color: #ffffff;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #94a3b8;
}


.form-textarea {
  resize: none;
  height: auto;
}


.input-hint {
  position: absolute;
  right: 20px;
  bottom: -20px;
  font-size: 0.8rem;
  color: #64748b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  justify-content: flex-end;
  border-top: 1px solid #e9edf4;
  padding-top: 1.8rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.7rem 2rem;
  border-radius: 40px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.btn-submit {
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(145deg, #1e4fc9, #153e9e);
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -2px rgba(37, 99, 235, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #94a3b8;
  box-shadow: none;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-cancel:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
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
  .create-post-container {
    padding: 1rem;
  }

  .post-card {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.8rem;
  }

  .btn-submit,
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