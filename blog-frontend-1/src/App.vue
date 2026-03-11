<template>
  <div class="app-container">
    <header class="app-header">
      <router-link to="/" class="app-title-link">
        <h1 class="app-title">博客系统</h1>
      </router-link>

      <nav class="nav-menu">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/create" class="nav-link">发布</router-link>
        <router-link to="/search" class="nav-link">搜索</router-link>

        <template v-if="!isLogin">
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/register" class="nav-link">注册</router-link>
        </template>

        <template v-else>
          <router-link to="/my-posts" class="nav-link">我的文章</router-link>
          <div class="user-greeting">
            <span class="welcome-text">欢迎 {{ username }}</span>
            <button class="logout-btn" @click="logout">退出</button>
          </div>
        </template>
      </nav>

      <hr class="divider-line" />
    </header>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLogin = ref(false);
const username = ref("");

onMounted(() => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const name = localStorage.getItem("username") || sessionStorage.getItem("username");
  if (token) {
    isLogin.value = true;
    username.value = name;
  }
});

const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("username");
  sessionStorage.removeItem("username");
  router.push("/");
  router.push("/").then(() => {
  location.reload();
});
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #1e293b;
}

.app-header {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 0.8rem 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9edf4;
}

.app-title-link {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  color: inherit;
  cursor: pointer;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  margin: 0;
  line-height: 1.4;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.router-link-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  font-weight: 600;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  font-weight: 500;
  color: #334155;
}

.logout-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 0.2rem 1rem;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #fee2e2;
  border-color: #f87171;
  color: #b91c1c;
}

.divider-line {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
  margin-top: 0.5rem;
  width: 100%;
  opacity: 0.6;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
  background-color: transparent;
}

@media (max-width: 700px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
    padding: 1rem;
  }

  .app-title {
    text-align: center;
  }

  .app-title-link {
    justify-content: center;
  }

  .nav-menu {
    justify-content: center;
    gap: 1rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }
}
</style>