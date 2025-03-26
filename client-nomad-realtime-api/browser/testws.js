const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x000000); // 黒色の背景

// メビウスの帯の設定と状態
const mobiusConfig = {
  // 形状パラメータ
  rotationSpeedX: 0.01,
  rotationSpeedY: 0.01,
  
  // アニメーション状態
  isFullRotation: false,
  rotationProgress: 0,
  fullRotationDuration: Math.PI * 2,
  
  // サイズ変更パラメータ
  initialScale: 1.0,
  currentScale: 1.0,
  maxScale: 2.0,
  
  // アニメーション状態フラグ
  isDisappearing: false,
  isAppearing: false,
  isExpanding: false,
  isContracting: false,
  isDancing: false,
  isHidden: false,
  
  // アニメーション速度
  disappearingSpeed: 0.01,
  appearingSpeed: 0.01,
  scaleChangeSpeed: 0.02,
};

// メビウスのジオメトリ生成
function createMobiusStrip() {
  const geometry = new THREE.ParametricGeometry((u, v, target) => {
    u *= Math.PI * 2;
    v = v * 2 - 1;
    const a = 1 + v * Math.cos(u / 2);
    target.set(
      Math.cos(u) * a,
      Math.sin(u) * a,
      v * Math.sin(u / 2)
    );
  }, 50, 10);

  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const mobiusStrip = new THREE.Mesh(geometry, material);
  scene.add(mobiusStrip);
  mobiusStrip.visible = false; // 初めは存在しない
  
  return mobiusStrip;
}

// メビウスの帯を作成
const mobiusStrip = createMobiusStrip();
camera.position.z = 5;

// WebSocketの接続
function setupWebSocket() {
  const socket = new WebSocket('ws://localhost:8765/browser');

  // WebSocketイベントリスナー
  socket.onopen = function(event) {
    console.log('WebSocket connection established');
  };

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received data:', data);
    handleWebSocketMessage(data);
  };

  socket.onerror = function(error) {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = function(event) {
    console.log('WebSocket connection closed');
  };
  
  return socket;
}

// WebSocketメッセージの処理
// WebSocketメッセージの処理
function handleWebSocketMessage(data) {
  switch(data.state) {
    case "appear":
      handleAppearState();
      break;
    case "disappear":
      handleDisappearState();
      break;
    case "hello":
      handleHelloState();
      break;
    case "dancestart":
      handleDanceState();
      break;
    case "dancestop":
      handleDanceStopState();
      break;
    default:
      resetToDefaultState();
      break;
  }
}

// 「appear」状態の処理
function handleAppearState() {
  mobiusConfig.isFullRotation = false;

  // オブジェクトを再表示
  mobiusStrip.visible = true;
  scene.background = new THREE.Color(0xffa07a); // サーモン色の背景

  // 出現アニメーションの状態をリセットして確実に開始
  mobiusConfig.isAppearing = true;
  mobiusConfig.isDisappearing = false;
  mobiusConfig.isHidden = false;
  mobiusConfig.currentScale = 0.01; // 小さいサイズから開始
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);

  mobiusConfig.rotationSpeedX = 0.02;
  mobiusConfig.rotationSpeedY = 0.02;
}


// 「disappear」状態の処理
function handleDisappearState() {
  mobiusConfig.isFullRotation = false;
  
  // 消滅アニメーション開始
  if (!mobiusConfig.isDisappearing && !mobiusConfig.isHidden && mobiusStrip.visible) {
    mobiusConfig.isDisappearing = true;
    mobiusConfig.isAppearing = false;
    mobiusConfig.rotationSpeedX = 0.005;
    mobiusConfig.rotationSpeedY = 0.005;
  }
}

// 「hello」状態の処理
function handleHelloState() {
  // "hello" 状態で拡大モードを有効化
  mobiusConfig.isExpanding = true;
  
  // 確実に表示
  if (!mobiusStrip.visible) {
    mobiusStrip.visible = true;
    mobiusConfig.currentScale = mobiusConfig.initialScale;
    mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
    scene.background = new THREE.Color(0xffa07a); // サーモン色の背景
  }
}

// 「dance」状態の処理
function handleDanceState() {
  mobiusConfig.isDancing = true;
  mobiusConfig.isExpanding = true;
  mobiusConfig.isContracting = false;

  if (!mobiusStrip.visible) {
    mobiusStrip.visible = true;
    mobiusConfig.currentScale = mobiusConfig.initialScale;
    mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
    scene.background = new THREE.Color(0xffa07a); // サーモン色の背景
  }
}

// 「dancestop」状態の処理
function handleDanceStopState() {
  mobiusConfig.isDancing = false;
  mobiusConfig.isExpanding = false;
  mobiusConfig.isContracting = false;
  mobiusConfig.currentScale = mobiusConfig.initialScale;
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
  mobiusConfig.rotationSpeedX = 0.02;
  mobiusConfig.rotationSpeedY = 0.02;
}

// デフォルト状態にリセット
function resetToDefaultState() {
  mobiusConfig.isFullRotation = false;
  mobiusConfig.rotationSpeedX = 0.01;
  mobiusConfig.rotationSpeedY = 0.01;
}

// 消滅アニメーション処理
function updateDisappearingAnimation() {
  if (!mobiusConfig.isDisappearing) return;
  
  mobiusConfig.currentScale -= mobiusConfig.disappearingSpeed;
  if (mobiusConfig.currentScale <= 0) {
    mobiusConfig.currentScale = 0;
    mobiusConfig.isDisappearing = false;
    mobiusConfig.isHidden = true;
    mobiusStrip.visible = false;
    scene.background = new THREE.Color(0x000000); // 黒色の背景
  }
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
  
  // 消滅中は回転速度を徐々に上げる
  const speedIncreaseFactor = 1 - mobiusConfig.currentScale / mobiusConfig.initialScale;
  mobiusConfig.rotationSpeedX = 0.005 + (0.03 * speedIncreaseFactor);
  mobiusConfig.rotationSpeedY = 0.005 + (0.03 * speedIncreaseFactor);
}

// 出現アニメーション処理
function updateAppearingAnimation() {
  if (!mobiusConfig.isAppearing) return;
  
  mobiusConfig.currentScale += mobiusConfig.appearingSpeed;
  if (mobiusConfig.currentScale >= mobiusConfig.initialScale) {
    mobiusConfig.currentScale = mobiusConfig.initialScale;
    mobiusConfig.isAppearing = false;
  }
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
}

// 拡大アニメーション処理
function updateExpandingAnimation() {
  if (!mobiusConfig.isExpanding) return;
  
  mobiusConfig.currentScale += mobiusConfig.scaleChangeSpeed;
  if (mobiusConfig.currentScale >= mobiusConfig.maxScale) {
    mobiusConfig.currentScale = mobiusConfig.maxScale;
    mobiusConfig.isExpanding = false;
    mobiusConfig.isContracting = true; // 拡大が終了したら縮小を開始する
  }
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
}

// 縮小アニメーション処理
function updateContractingAnimation() {
  if (!mobiusConfig.isContracting) return;
  
  mobiusConfig.currentScale -= mobiusConfig.scaleChangeSpeed;
  if (mobiusConfig.currentScale <= mobiusConfig.initialScale) {
    mobiusConfig.currentScale = mobiusConfig.initialScale;
    mobiusConfig.isContracting = false;
  }
  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
}

// 回転アニメーション処理
function updateRotationAnimation() {
  if (mobiusConfig.isFullRotation) {
    // 1回転モード
    const rotationStep = 0.05; // 回転のステップサイズ
    mobiusStrip.rotation.x += rotationStep;
    mobiusStrip.rotation.y += rotationStep;
    
    mobiusConfig.rotationProgress += rotationStep;
    
    // 1回転が完了したら、フラグをリセット
    if (mobiusConfig.rotationProgress >= mobiusConfig.fullRotationDuration) {
      mobiusConfig.isFullRotation = false;
      mobiusConfig.rotationProgress = 0;
    }
  } else {
    // 通常の回転モード
    mobiusStrip.rotation.x += mobiusConfig.rotationSpeedX;
    mobiusStrip.rotation.y += mobiusConfig.rotationSpeedY;
  }
}

// ダンスアニメーション処理
function updateDancingAnimation() {
  if (!mobiusConfig.isDancing) return;

  if (mobiusConfig.isExpanding) {
    mobiusConfig.currentScale += mobiusConfig.scaleChangeSpeed;
    if (mobiusConfig.currentScale >= mobiusConfig.maxScale) {
      mobiusConfig.currentScale = mobiusConfig.maxScale;
      mobiusConfig.isExpanding = false;
      mobiusConfig.isContracting = true;
    }
  } else if (mobiusConfig.isContracting) {
    mobiusConfig.currentScale -= mobiusConfig.scaleChangeSpeed;
    if (mobiusConfig.currentScale <= mobiusConfig.initialScale) {
      mobiusConfig.currentScale = mobiusConfig.initialScale;
      mobiusConfig.isContracting = false;
      mobiusConfig.isExpanding = true;
    }
  }

  mobiusStrip.scale.set(mobiusConfig.currentScale, mobiusConfig.currentScale, mobiusConfig.currentScale);
}


// メインアニメーションループ
function animate() {
  requestAnimationFrame(animate);

  updateDisappearingAnimation();
  updateAppearingAnimation();
  updateExpandingAnimation();
  updateContractingAnimation();
  updateRotationAnimation();
  updateDancingAnimation();

  renderer.render(scene, camera);
}

// WebSocketを設定して接続
const socket = setupWebSocket();

// アニメーションを開始
animate();