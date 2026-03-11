<template>
  <div class="update-username">
    <h3>修改用户名</h3>
    <!-- 原用户名（只读，展示当前用户名） -->
    <div class="form-item">
      <label>当前用户名：</label>
      <input type="text" v-model="currentUsername" disabled />
    </div>
    <!-- 新用户名输入框 -->
    <div class="form-item">
      <label>新用户名：</label>
      <input 
        v-model="newUsername" 
        placeholder="请输入新用户名"
        @input="clearError"
      />
    </div>
    <!-- 提交按钮（禁用状态+加载文字） -->
    <button 
      @click="updateUsername" 
      :disabled="isUpdating || !newUsername.trim()"
    >
      {{ isUpdating ? '修改中...' : '确认修改' }}
    </button>
    <!-- 错误/成功提示 -->
    <p class="tip error" v-if="errorMsg">{{ errorMsg }}</p>
    <p class="tip success" v-if="successMsg">{{ successMsg }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentUsername: '', // 当前用户名（从登录信息中获取）
      newUsername: '',     // 新用户名
      isUpdating: false,   // 修改中状态
      errorMsg: '',        // 错误提示
      successMsg: ''       // 成功提示
    };
  },
  mounted() {
    // 页面加载时，获取当前登录用户的用户名（从localStorage/token解析）
    // 示例：从localStorage获取（实际项目建议解析JWT token）
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.currentUsername = userInfo.username || '';
  },
  methods: {
    // 清空错误提示
    clearError() {
      this.errorMsg = '';
      this.successMsg = '';
    },
    // 核心：修改用户名
    async updateUsername() {
      // 1. 前端校验
      const newName = this.newUsername.trim();
      if (newName === this.currentUsername) {
        this.errorMsg = '新用户名不能和原用户名相同';
        return;
      }
      if (newName.length < 3 || newName.length > 16) {
        this.errorMsg = '用户名长度需在3-16位之间';
        return;
      }

      // 2. 标记为修改中
      this.isUpdating = true;
      try {
        // 3. 发送请求到后端（携带token验证身份，新用户名）
        const res = await axios.post(
          '/api/auth/update-username',
          { newUsername: newName },
          {
            headers: {
              // 携带登录token，后端验证用户身份
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        // 4. 修改成功
        this.successMsg = '用户名修改成功！';
        this.currentUsername = newName;
        // 更新localStorage中的用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        userInfo.username = newName;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.newUsername = ''; // 清空输入框
      } catch (err) {
        // 5. 处理错误
        this.errorMsg = err.response?.data?.message || '修改失败，请稍后重试';
      } finally {
        // 6. 重置修改中状态
        this.isUpdating = false;
      }
    }
  }
};
</script>

<style scoped>
.update-username {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.form-item {
  margin-bottom: 15px;
}
label {
  display: inline-block;
  width: 100px;
}
input {
  padding: 6px 8px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.tip {
  margin-top: 15px;
  font-size: 14px;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>