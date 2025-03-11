<script>
import { defineComponent, ref, onMounted } from "vue";
import vueWindowManager from "vue-window-manager";
import "vue-window-manager/windows10.css";

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
    const windowWidth = ref(window.innerWidth);
    const windowHeight = ref(window.innerHeight);

    const activeWindow = (data) => {
      console.log('ActiveWindowID:' + data)
      activeWindowId.value = data;
    };

    const updateWindowSize = () => {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
    };

    onMounted(() => {
      window.addEventListener('resize', updateWindowSize);
    });

    return {
      activeWindowId,
      activeWindow,
      windowWidth,
      windowHeight
    };
  },
});
</script>
<template>
  <div :style="{ height: windowHeight + 'px', width: windowWidth + 'px' }">
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top=0
          :left= 0
          :width= windowWidth*0.2
          :height= windowHeight*0.6
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=1
          :style="` z-index:${ activeWindowId === '1' ? '100' : '0'  }`"
          title="Console"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <Console />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top=0
          :left= windowWidth*0.2
          :width= windowWidth*0.3
          :height= windowHeight*0.4
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=2
          :style="` z-index:${ activeWindowId === '2' ? '100' : '0'  }`"
          title="Chats"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <ChatLog />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top= windowHeight*0.6
          :left= 0
          :width= windowWidth*0.2
          :height= windowHeight*0.2
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=3
          :style="` z-index:${ activeWindowId === '3' ? '100' : '0'  }`"
          title="EventLogs"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <EventLog />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top= windowHeight*0.8
          :left= 0
          :width= windowWidth*0.2
          :height= windowHeight*0.2
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=4
          :style="` z-index:${ activeWindowId === '4' ? '100' : '0'  }`"
          title="StateLogs"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <StateLog />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top= 0
          :left= windowWidth*0.7
          :width= windowWidth*0.3
          :height= windowHeight
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=5
          :style="` z-index:${ activeWindowId === '5' ? '100' : '0'  }`"
          title="TaskFlow"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">
            <TaskFlow />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top= windowHeight*0.4
          :left= windowWidth*0.2
          :width= windowWidth*0.3
          :height= windowHeight*0.6
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=6
          :style="` z-index:${ activeWindowId === '6' ? '100' : '0'  }`"
          title="Controls"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <Controls />
          </div>
    </vueWindowManager>
    <vueWindowManager        
          style="position: absolute;"
          :isActive=true
          :top= 0
          :left= windowWidth*0.5
          :width= windowWidth*0.2
          :height= windowHeight
          :minWidth= 0
          :minHeight= 0
          :isDragging= true
          :isResizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
          :isButtonMaximized= true
          :isButtonMinimized= true
          :isMaximized= false
          :maxWidth= windowWidth
          :maxHeight= windowHeight
          windowId=7
          :style="` z-index:${ activeWindowId === '7' ? '100' : '0'  }`"
          title="StateManager"
          titleIcon="https://cdn-icons-png.flaticon.com/512/337/337948.png"
          @clickWindow="activeWindow" 
          >
          <div style="background-color: white;height: 100%;">        
            <StateUI />
          </div>
    </vueWindowManager>
  </div>
</template>