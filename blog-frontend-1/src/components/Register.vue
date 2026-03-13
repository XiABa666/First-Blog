<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="form-title">注册</h2>

      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" v-model="username" type="text" placeholder="请输入用户名" class="form-input" />
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="password" type="password" placeholder="请输入密码" class="form-input" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="请再次输入密码"
          class="form-input" />
      </div>

      <div class="form-actions">
        <button @click="register" class="btn-register" :disabled="isRegistering">
          <span v-if="!isRegistering">注册</span>
          <span v-else>注册中...</span>
        </button>
      </div>

      <p class="login-tip">
        已有账号？<router-link to="/login" class="login-link">立即登录</router-link>
      </p>
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

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRegistering = ref(false)

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

// const clearFieldError = () => { }

const register = async () => {
  if (!username.value.trim()) {
    showToast('用户名不能为空')
    return
  }
  if (!password.value) {
    showToast('密码不能为空')
    return
  }
  if (password.value.length < 6) {
    showToast('密码至少需要6位')
    return
  }
  if (password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致')
    return
  }

  isRegistering.value = true
  try {
    await axios.post('http://localhost:3000/api/auth/register', {
      username: username.value,
      password: password.value
    })

    showToast('注册成功！即将跳转到登录页', 'success')

    username.value = ''
    password.value = ''
    confirmPassword.value = ''

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error('注册失败', err)
    const errorMsg = err.response?.data?.message || '注册失败，请稍后重试'
    showToast(errorMsg)
  } finally {
    isRegistering.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.register-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 420px;
  padding: 2rem 2rem;
  border: 1px solid #e9edf4;
  transition: box-shadow 0.2s ease;
}

.register-card:hover {
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
  text-align: center;
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

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #f9fafc;
  transition: all 0.2s ease;
  color: #1e293b;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background-color: #ffffff;
}

.form-input:hover {
  border-color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-register {
  width: 100%;
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-register:hover:not(:disabled) {
  background: linear-gradient(145deg, #1e4fc9, #153e9e);
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -2px rgba(37, 99, 235, 0.4);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #94a3b8;
  box-shadow: none;
}

.login-tip {
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.login-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
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
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .btn-register {
    font-size: 1rem;
    padding: 0.7rem 1.5rem;
  }

  .toast-message {
    top: 20px;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>