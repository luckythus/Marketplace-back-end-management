import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
// 使用路由标签的方法
export function useTagList() {
  const cookie = useCookies();
  const router = useRouter();
  const route = useRoute();
  // 获取当前路由的path，来响应对应的标签
  const activeTab = ref(route.fullPath);
  // 固定的后台首页标签
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);
  // 动态添加路由标签
  function addTab(tab) {
    let noTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;
    if (noTab) {
      tabList.value.push(tab);
      cookie.set("tabList", tabList.value);
    }
  }
  // 初始化标签导航数据
  function initTabList() {
    let tab = cookie.get("tabList");
    if (tab) {
      tabList.value = tab;
    }
  }
  initTabList();
  // 点击侧边栏路由，然后在标签导航动态添加对应路由的标签
  // 在渲染路由前，在标签导航处添加该路由标签并将它变为激活状态
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });
  // 切换标签跳转相对应的路由
  const changeTab = (name) => {
    //里面的参数name：TagPaneName
    //激活切换后的标签,为什么都使用name呢，因为上面设置name的值都等于path
    activeTab.value = name;
    router.push(name);
  };
  const removeTab = (name) => {
    let tabs = tabList.value;
    let a = activeTab.value;
    if (a == name) {
      tabs.forEach((item, index) => {
        if (item.path == name) {
          a = tabs[index - 1] || tabs[index + 1];
        }
      });
    }
    activeTab.value = a.path;
    tabList.value = tabList.value.filter((x) => x.path != name);
    cookie.set("tabList", tabList.value);
  };
  // 判断关闭方法属于哪个
  const handleClose = (t) => {
    switch (t) {
      case "clearOther":
        clearOther();
        break;
      case "clearAll":
        clearAll();
        break;
    }
  };
  // 关闭除主标签外的所有标签
  function clearAll() {
    activeTab.value = "/";
    tabList.value = tabList.value.filter((x) => x.path == "/");
    cookie.set("tabList", tabList.value);
  }
  // 关闭其他标签的方法
  function clearOther() {
    //保留主标签和当前激活选中的标签
    tabList.value = tabList.value.filter(
      (x) => x.path == "/" || x.path == activeTab.value
    );
    cookie.set("tabList", tabList.value);
  }
  return {
    activeTab,
    tabList,
    handleClose,
    removeTab,
    changeTab
  }
}
