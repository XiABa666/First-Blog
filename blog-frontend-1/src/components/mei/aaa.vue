<template>
  <div class="auth-container">
    <div class="auth-card profile-card">
      <!-- 页面标题 -->
      <h2 class="auth-title">个人信息</h2>
      
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-container">
          <!-- 头像展示 -->
          <img 
            :src="userInfo.avatar || defaultAvatar" 
            alt="用户头像" 
            class="user-avatar"
          />
          <!-- 头像上传按钮 -->
          <label class="avatar-upload-btn">
            <input 
              type="file" 
              accept="image/*" 
              @change="handleAvatarUpload"
              hidden
            />
            更换头像
          </label>
        </div>
      </div>

      <!-- 表单区域 -->
      <div class="profile-form">
        <!-- 用户名 -->
        <div class="input-group">
          <label class="form-label">用户名</label>
          <input 
            v-model="userInfo.username" 
            type="text" 
            class="auth-input"
            :disabled="!isEditing"
            placeholder="请输入用户名"
          />
        </div>

        <!-- 邮箱 -->
        <div class="input-group">
          <label class="form-label">邮箱</label>
          <input 
            v-model="userInfo.email" 
            type="email" 
            class="auth-input"
            :disabled="!isEditing"
            placeholder="请输入邮箱"
          />
        </div>

        <!-- 昵称 -->
        <div class="input-group">
          <label class="form-label">昵称</label>
          <input 
            v-model="userInfo.nickname" 
            type="text" 
            class="auth-input"
            :disabled="!isEditing"
            placeholder="请输入昵称"
          />
        </div>

        <!-- 个性签名 -->
        <div class="input-group">
          <label class="form-label">个性签名</label>
          <textarea 
            v-model="userInfo.signature" 
            class="auth-input textarea-input"
            :disabled="!isEditing"
            placeholder="一句话介绍自己..."
            rows="3"
          ></textarea>
        </div>

        <!-- 注册时间（只读） -->
        <div class="input-group">
          <label class="form-label">注册时间</label>
          <input 
            :value="formatTime(userInfo.registerTime)" 
            type="text" 
            class="auth-input readonly-input"
            disabled
            placeholder="--"
          />
        </div>
      </div>

      <!-- 操作按钮区 -->
      <div class="btn-group">
        <button 
          class="auth-btn edit-btn"
          @click="toggleEdit"
          :disabled="isSaving"
        >
          {{ isEditing ? '取消编辑' : '编辑信息' }}
        </button>
        
        <button 
          class="auth-btn save-btn"
          @click="saveProfile"
          :disabled="!isEditing || isSaving"
        >
          <span v-if="isSaving" class="spinner"></span>
          {{ isSaving ? '保存中...' : '保存修改' }}
        </button>
      </div>

      <!-- 提示信息 -->
      <p class="error-tip">{{ errorMsg }}</p>
      <p class="success-tip">{{ successMsg }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // 用户信息
      userInfo: {
        username: '',
        email: '',
        nickname: '',
        signature: '',
        avatar: '',
        registerTime: ''
      },
      // 默认头像
      defaultAvatar: 'https://picsum.photos/200/200?random=1',
      // 编辑状态
      isEditing: false,
      // 保存中状态
      isSaving: false,
      // 提示信息
      errorMsg: '',
      successMsg: '',
      // 定时器（用于自动清除提示）
      tipTimer: null
    }
  },
  mounted() {
    // 页面加载时获取用户信息
    this.getUserProfile()
  },
  methods: {
    // 获取用户信息
    async getUserProfile() {
      try {
        // 实际项目中替换为真实接口
        const res = await axios.get('/api/user/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        this.userInfo = { ...this.userInfo, ...res.data.data }
      } catch (err) {
        this.showTip('error', '获取个人信息失败，请稍后重试')
        console.error('获取个人信息失败：', err)
      }
    },

    // 切换编辑状态
    toggleEdit() {
      if (this.isEditing) {
        // 取消编辑，恢复原始数据
        this.getUserProfile()
      }
      this.isEditing = !this.isEditing
      this.clearTips()
    },

    // 处理头像上传
    handleAvatarUpload(e) {
      const file = e.target.files[0]
      if (!file) return

      // 校验文件类型和大小
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.showTip('error', '请上传图片格式的文件！')
        return
      }
      if (!isLt2M) {
        this.showTip('error', '头像大小不能超过2MB！')
        return
      }

      // 创建FormData上传
      const formData = new FormData()
      formData.append('avatar', file)

      // 模拟上传（实际项目替换为真实接口）
      this.isSaving = true
      axios.post('/api/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        this.userInfo.avatar = res.data.data.avatarUrl
        this.showTip('success', '头像上传成功！')
      }).catch(err => {
        this.showTip('error', '头像上传失败，请稍后重试')
      }).finally(() => {
        this.isSaving = false
        // 清空文件输入框，避免重复上传同一文件
        e.target.value = ''
      })
    },

    // 保存个人信息
    async saveProfile() {
      try {
        this.isSaving = true
        this.clearTips()

        // 前端校验
        if (!this.userInfo.nickname.trim()) {
          this.showTip('error', '昵称不能为空！')
          this.isSaving = false
          return
        }
        if (this.userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userInfo.email)) {
          this.showTip('error', '请输入正确的邮箱格式！')
          this.isSaving = false
          return
        }

        // 提交修改（实际项目替换为真实接口）
        await axios.put('/api/user/profile', {
          nickname: this.userInfo.nickname,
          email: this.userInfo.email,
          signature: this.userInfo.signature
        }, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })

        this.showTip('success', '个人信息修改成功！')
        this.isEditing = false
      } catch (err) {
        this.showTip('error', err.response?.data?.message || '保存失败，请稍后重试')
      } finally {
        this.isSaving = false
      }
    },

    // 格式化时间
    formatTime(time) {
      if (!time) return '--'
      const date = new Date(time)
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },

    // 显示提示信息
    showTip(type, msg) {
      this.clearTips()
      if (type === 'error') {
        this.errorMsg = msg
      } else {
        this.successMsg = msg
      }

      // 3秒后自动清除提示
      this.tipTimer = setTimeout(() => {
        this.clearTips()
      }, 3000)
    },

    // 清空提示信息
    clearTips() {
      if (this.tipTimer) {
        clearTimeout(this.tipTimer)
        this.tipTimer = null
      }
      this.errorMsg = ''
      this.successMsg = ''
    }
  },
  beforeDestroy() {
    // 组件销毁时清除定时器
    if (this.tipTimer) {
      clearTimeout(this.tipTimer)
    }
  }
}
</script>

<style scoped>
/* 继承登录页基础样式，新增个性化样式 */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px 30px;
  box-sizing: border-box;
}

.profile-card {
  max-width: 600px;
}

.auth-title {
  text-align: center;
  color: #333333;
  font-size: 24px;
  margin: 0 0 30px 0;
  font-weight: 600;
}

/* 头像区域样式 */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  text-align: center;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f2f5;
  margin-bottom: 10px;
}

.avatar-upload-btn {
  display: inline-block;
  padding: 6px 16px;
  background-color: #f0f2f5;
  color: #4096ff;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload-btn:hover {
  background-color: #e5e6eb;
  color: #3385ff;
}

/* 表单样式 */
.profile-form {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.input-group {
  margin-bottom: 20px;
}

.auth-input {
  width: 100%;
  height: 48px;
  padding: 0 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.auth-input:focus {
  outline: none;
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.1);
}

/* 文本域样式 */
.textarea-input {
  height: auto;
  padding: 15px;
  resize: none;
}

/* 只读输入框样式 */
.readonly-input {
  background-color: #f9f9f9;
  color: #999;
  cursor: not-allowed;
}

/* 按钮组样式 */
.btn-group {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.auth-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-btn {
  background-color: #f0f2f5;
  color: #666;
}

.edit-btn:hover {
  background-color: #e5e6eb;
  color: #333;
}

.save-btn {
  background-color: #4096ff;
  color: #ffffff;
}

.save-btn:hover {
  background-color: #3385ff;
}

.auth-btn:disabled {
  background-color: #a0cfff !important;
  color: #ffffff !important;
  cursor: not-allowed;
}

/* 加载动画 */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 提示信息样式 */
.error-tip {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
  margin: 15px 0 0 0;
  min-height: 18px;
}

.success-tip {
  color: #67c23a;
  font-size: 14px;
  text-align: center;
  margin: 15px 0 0 0;
  min-height: 18px;
}
</style>