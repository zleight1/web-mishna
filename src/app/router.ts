import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@features/catalog/HomeView.vue'),
    },
    {
      path: '/learn/:order/:tractate/:chapter/:mishnah',
      name: 'lesson',
      component: () => import('@features/lesson/LessonView.vue'),
      props: true,
    },
    {
      path: '/learn/:order/:tractate/:chapter',
      name: 'chapter',
      component: () => import('@features/catalog/ChapterView.vue'),
      props: true,
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@features/catalog/CreditsView.vue'),
    },
  ],
})
