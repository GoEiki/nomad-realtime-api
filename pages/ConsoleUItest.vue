<script>
import { defineComponent } from "vue";
import  vueWindowManager  from "vue-window-manager";
import  "vue-window-manager/windows10.css";
export default defineComponent({
  meta() {
    return {
      ssr: false // このページでSSRを無効にする
    }
  },
  components: {
    vueWindowManager
  },
  setup(_props, ctx) {
    const activeWindowId = ref("0");
    const activeWindow = (data) => {
      console.log('ActiveWindowID:'+data)
      activeWindowId.value=data;

    };
    return {
      activeWindowId,
      activeWindow,
    };
  },
});
</script>
<template>
  <div style="height:100vh; width: 100%;">
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top=0
          :left= 0
          :width= 500
          :height= 500
          :minWidth= 500
          :minHeight= 600
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= 500
          :maxHeight= 600
          windowId=1
          :style="` z-index:${ activeWindowId === '1' ? '100' : '0'  }`"
          title="コンソール"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <Logstest />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top=0
          :left= 500
          :width= 500
          :height= 500
          :minWidth= 500
          :minHeight= 600
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= 500
          :maxHeight= 600
          windowId=2
          :style="` z-index:${ activeWindowId === '2' ? '100' : '0'  }`"
          title="チャットログ"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <ChatLogtest />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top=0
          :left= 1000
          :width= 500
          :height= 500
          :minWidth= 500
          :minHeight= 600
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= 500
          :maxHeight= 600
          windowId=3
          :style="` z-index:${ activeWindowId === '3' ? '100' : '0'  }`"
          title="イベントログ"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <EventLogtest />
          </div>
    </vueWindowManager>
  </div>
</template>
<style>
html, body {
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>