import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "@/page/404.vue";
import Login from "@/page/login.vue";
import Admin from "@/layouts/admin.vue";
import Index from "@/page/index.vue";
import GoodList from "@/page/goods/list.vue";
import CateGory from "@/page/category/list.vue";
import UserList from '@/page/user/list.vue'
import OrderList from '@/page/order/list.vue'
import CommentList from '@/page/comment/list.vue'
import ImageList from '@/page/image/list.vue'
import NoticeList from '@/page/notice/list.vue'
import SettingBase from '@/page/setting/base.vue'
import CouponList from '@/page/coupon/list.vue'
import Manager from '@/page/manager/list.vue'
import Access from '@/page/access/list.vue'
import RoleList from '@/page/role/list.vue'
import SkusList from '@/page/skus/list.vue'
import LevelList from '@/page/level/list.vue'
import SettingBuy from '@/page/setting/buy.vue'
const routes = [
  {
    path: "/login",
    component: Login,
    meta: { title: "登录页面" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { title: "找不到页面" },
  },
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
];
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: Index,
    meta: { title: "后台页面" },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: { title: "商品管理" },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CateGory,
    meta: { title: "分类列表" },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
      title: "基础设置",
    },
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: SettingBuy,
    meta: {
      title: "交易设置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: Manager,
    meta: {
      title: "管理员列表",
    },
  },
  {
    path: '/access/list',
    name: '/access/list',
    component: Access,
    meta: {
      title: '权限菜单列表'
    },
  },
  {
    path: '/role/list',
    name: '/role/list',
    component: RoleList,
    meta: {
      title: '角色管理'
    },
  },
  {
    path: '/skus/list',
    name: '/skus/list',
    component: SkusList,
    meta: {
      title: '规格管理'
    },
  },
  {
    path: '/level/list',
    name: '/level/list',
    component: LevelList,
    meta: {
      title: '会员等级'
    },
  }
];
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态路由添加的方法
export function addRoute(menus) {
  // 是否有添加新的路由
  let hasNewRoute = false;
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      if(item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRoute = true;
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child);
      }
    });
  };
  findAndAddRoutesByMenus(menus);
  return hasNewRoute;
}
