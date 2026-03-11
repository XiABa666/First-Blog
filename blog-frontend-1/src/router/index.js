import { createRouter, createWebHistory } from 'vue-router'
import PostList from '../components/PostList.vue'
import PostDetail from '../components/PostDetail.vue'
import Login from '../components/Login.vue'
import CreatePost from '../components/CreatePost.vue'
import Register from '../components/Register.vue'
import MyPosts from '../components/MyPosts.vue'
import Search from '../components/Search.vue'
const routes = [
    {
        path: '/',
        // name: 'Home',
        component: PostList
    },
    {
        path: '/posts/:id',
        // name: 'PostDetail',
        component: PostDetail
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/create',
        component: CreatePost
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/my-posts',
        name: 'MyPosts',
        component: MyPosts
    },
    {
        path: '/search',
        component: Search
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')||sessionStorage.getItem("token");
    // 需要登录的页面
    const protectedPages = ['/create']
    if (protectedPages.includes(to.path) && !token) {
        next('/login')
    } else {
        next()
    }
})
export default router