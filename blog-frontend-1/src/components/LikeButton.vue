<template>
  <div class="like-box">

    <button class="like-btn" @click="like" :disabled="isLiking" :class="{ 'is-loading': isLiking }">
      <span class="btn-content">
        <span class="icon">👍</span>
        <span class="count">{{ likes }}</span>
      </span>
    </button>


    <button class="dislike-btn" @click="dislike" :disabled="isDisliking" :class="{ 'is-loading': isDisliking }">
      <span class="btn-content">
        <span class="icon">👎</span>
        <span class="count">{{ dislikes }}</span>
      </span>
    </button>


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


const props = defineProps({
  type: String,
  id: [String, Number],
  likes: Number,
  dislikes: Number
})


const emit = defineEmits(['update-like', 'update-dislike'])

const router = useRouter()


const isLiking = ref(false)
const isDisliking = ref(false)


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
  }, 1000)
}


const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}


const like = async () => {
  const token = getToken()
  if (!token) {

    router.push('/login')
    return
  }

  isLiking.value = true
  try {
    await axios.post(
      `http://localhost:3000/api/${props.type}s/${props.id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    emit('update-like')
    showToast('点赞成功', 'success')
  } catch (err) {
    console.error('点赞失败', err)
    showToast('操作失败，请稍后重试', 'error')
  } finally {
    isLiking.value = false
  }
}


const dislike = async () => {
  const token = getToken()
  if (!token) {

    router.push('/login')
    return
  }

  isDisliking.value = true
  try {
    await axios.post(
      `http://localhost:3000/api/${props.type}s/${props.id}/dislike`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    emit('update-dislike')
    showToast('操作成功', 'success')
  } catch (err) {
    console.error('点踩失败', err)
    showToast('操作失败，请稍后重试', 'error')
  } finally {
    isDisliking.value = false
  }
}
</script>

<style scoped>
.like-box {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  position: relative;
}


.like-btn,
.dislike-btn {
  border: none;
  background: transparent;
  padding: 0.4rem 1.2rem;
  border-radius: 40px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}


.btn-content {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon {
  font-size: 1.1rem;
  line-height: 1;
}

.count {
  font-variant-numeric: tabular-nums;
}


.like-btn {
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: white;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px -2px rgba(37, 99, 235, 0.3);
}

.like-btn:hover:not(:disabled) {
  background: linear-gradient(145deg, #1e4fc9, #153e9e);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.4);
}


.dislike-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.dislike-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}

.like-btn:disabled,
.dislike-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.like-btn:disabled {
  background: #94a3b8;
}

.dislike-btn:disabled {
  background: transparent;
  border-color: #cbd5e1;
  color: #94a3b8;
}


.is-loading {
  position: relative;
  pointer-events: none;
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
  .like-box {
    gap: 0.5rem;
  }

  .like-btn,
  .dislike-btn {
    padding: 0.3rem 1rem;
    font-size: 0.9rem;
    min-width: 60px;
  }

  .toast-message {
    top: 20px;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>