<template>
  <div class="comment-section">
    <h3 class="section-title"> 评论</h3>

    <div v-if="isLogin" class="comment-form">
      <textarea v-model="content" @input="clearError" placeholder="写下你的评论……" class="comment-input" rows="3"></textarea>

      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
      <div class="form-actions">
        <button @click="submitComment" class="submit-btn">发表评论</button>
      </div>
    </div>


    <p v-else class="login-tip">
      👉 <router-link to="/login" class="login-link">请先登录</router-link> 后才能评论
    </p>

    <hr class="divider" />


    <ul v-if="comments.length" class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">

        <div class="comment-author-row">
          <span class="comment-author">{{ comment.username }}</span>
        </div>


        <p class="comment-content">{{ comment.content }}</p>


        <div class="comment-footer">
          <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
          <LikeButton type="comment" :id="comment.id" :likes="comment.likes" :dislikes="comment.dislikes"
            @update-like="comment.likes++" @update-dislike="comment.dislikes++" />
        </div>
      </li>
    </ul>


    <p v-else class="empty-message">✨ 暂无评论，来抢个沙发吧~</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import LikeButton from "./LikeButton.vue";

const props = defineProps(["postId"]);

const comments = ref([]);
const content = ref("");
const errorMessage = ref("");

const token = computed(() => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
});
const isLogin = computed(() => !!token.value);

const getComments = async () => {
  const res = await axios.get(
    `http://localhost:3000/api/comments/${props.postId}`
  );
  comments.value = res.data;
};

const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString().replace(/\//g, "-").replace(/:\d{2}$/, "");
};

const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};

const submitComment = async () => {
  if (!content.value.trim()) {
    errorMessage.value = "评论不能为空";
    return;
  }

  errorMessage.value = "";

  await axios.post(
    `http://localhost:3000/api/comments/${props.postId}`,
    { content: content.value },
    {
      headers: {
        Authorization: "Bearer " + token.value,
      },
    }
  );
  content.value = "";
  getComments();
};

onMounted(() => {
  getComments();
});
</script>

<style scoped>
.comment-section {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 1.8rem 2rem;
  margin-top: 2rem;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #1e293b;
}


.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
  display: inline-block;
}


.comment-form {
  margin-bottom: 2rem;
}


.comment-input {
  width: 97%;
  height: 100px;
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  background-color: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}


.error-message {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8rem;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.submit-btn:active {
  transform: scale(0.97);
}


.login-tip {
  background-color: #f1f5f9;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  text-align: center;
}

.login-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}


.divider {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
  margin: 1.5rem 0 2rem 0;
}


.comment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  border-bottom: 1px solid #edf2f7;
  padding: 1.2rem 0;
}

.comment-item:last-child {
  border-bottom: none;
}


.comment-author-row {
  margin-bottom: 0.3rem;
}

.comment-author {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.05rem;
}

.comment-content {
  margin: 0.5rem 0 1rem 0;
  line-height: 1.6;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}


.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.5rem;
}

.comment-time {
  font-size: 0.85rem;
  color: #94a3b8;
}


.comment-footer :deep(.like-box) {
  margin-left: auto;
}


.empty-message {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem 0;
  font-size: 1rem;
}
</style>