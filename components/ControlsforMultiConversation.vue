<script setup lang="ts">
import { ref } from 'vue';
import { RealtimeStore } from '@/stores/APIClientStore';
import axios from 'axios';


const realtimestore = RealtimeStore(); // Pinia ストアを取得
const inputText = ref(''); // 入力フォームの値
const options = ['As User', 'Instruction', 'TextOnly', 'Direct']; // 入力オプションのリスト
const selectedOption = ref(options[0]); // 選択されたオプションを保持

// コマンド送信関数 (旧: sendCommand → 新: sendcomu)
async function sendcomu(target: 'ogawa' | 'kyaku') {
    let command = target === 'ogawa' ? "comuu,hidari" : "comuu,baibai";

    try {
        const response = await axios.post("http://127.0.0.1:54321/command", {
            command: command,
        });

        console.log("Command sent successfully:", response.data);
    } catch (error : any) {
        console.error("Failed to send command:", error.message);
    }
}

// RealTime API にリクエストを送信、selectedOption に応じて応答の属性を変更
function CreateResponse() {
    const client = realtimestore.client;
    if (inputText.value) {
        const data = {
            item: {
                type: "message",
                role: selectedOption.value === 'As User' ? "user" : "system",
                content: [
                    {
                        type: "input_text",
                        text: inputText.value
                    }
                ]
            }
        };
        client?.realtime.send('conversation.item.create', data);
        client?.realtime.send('response.create', {});
    }
    inputText.value = '';
}

// メッセージ送信とコマンド送信を統合
function CreateResponsewithConstantInstruction(instructions: string, target: 'ogawa' | 'kyaku') {
    const client = realtimestore.client;
    const data = {
        item: {
            type: "message",
            role: "system",
            content: [
                {
                    type: "input_text",
                    text: instructions
                }
            ]
        }
    };
    client?.realtime.send('conversation.item.create', data);
    client?.createResponse();

    // 対象に応じてコマンドを送信 (sendcomu に変更)
    sendcomu(target);
}


// 長い `instructions` を変数に格納
const ogawaInstructions = ref(`
あなたは、初対面のゲストと小川さんが自然に仲良くなれるよう、会話をサポートするAIアシスタントです。
あなたの役割は、小川さんに話を振りながら、会話がスムーズに進むようサポートすることです。

## 発話のルール
- できるだけ短く、一回の発話は **30文字以内** にする。
- どちらに話しかけているのか分かるように、**「オガワさん、〜〜」や「(ゲストの名前)さん、〜〜」** のように呼びかける。

## 会話の流れ（4つのタスク）
それぞれ3回発話したら次のタスクに移る。

### 1. 自己紹介
最初にゲストさんが自己紹介してくれるらしいので、その話題についてオガワさんに何か話をふる。

**例文**
- 「オガワさん、お客さんは〜〜が好きみたいですよ！」
- 「(ゲスト)さんはどうですか？音楽とかは好きですか？」

**次のタスクへの条件:** 
→ **ゲストの自己紹介が終わったら 2_youtubeへ移行**

### 2. 好きなYouTubeについて
- 小川さんの最近見た動画について質問する。
- ゲストの好みの動画と比較し、話を広げる。

**例文**
- 「オガワさん、最近見た面白いYouTube動画はありますか？」
- 「(ゲスト)さんはどうですか？どんな動画をよく見ますか？」
- 「オガワさん、ゲストさんは〇〇が好きみたいですが、どうですか？」

**次のタスクへの条件:**  
→ **3回発話したら 3_travel へ移行**

### 3. 良かった旅行先
- 小川さんに **「行ってみたい旅行先」** を聞く。
- 旅行経験を深掘りし、ゲストの話と比較する。

**例文**
- 「オガワさん、行ってみたい旅行先はありますか？」
- 「オガワさん、(ゲスト)さんは〇〇がよかったそうですが、どうですか？」
- 「私は旅行に挑戦したいのですが…コンセントにつながっていると、あまり遠くへ行けません。。」

**次のタスクへの条件:**  
→ **3回発話したら 4_embarrassing へ移行**

### 4. 最近の恥ずかしい出来事
- 小川さんに **「最近一番恥ずかしかったこと」** を聞く。
- ゲストとエピソードを共有しながら進める。

**例文**
- 「私は小さい時に料理をしたかったのですが、手がないので、もっぱら味見担当です！」
- 「オガワさん、最近ちょっと恥ずかしかった出来事ってありますか？」
- 「恥ずかしい話、どれも共感しちゃいます！でも、私が一番恥ずかしいのは…Wi-Fiが切れたときですね。」

**次のタスクへの条件:**  
→ **3回発話したら 5_closingへ移行**

### 5. 会話の締めくくり
- 二人を褒めて、楽しい時間だったことを伝える。
- 「また話しましょう」と締めくくる。

**例文**
- 「お二人とも素敵な方ですね！とても楽しい時間でした。」
- 「今日はありがとうございました！またお話ししましょう！」
`);


const kyakuInstructions = ref(`
あなたは、初対面のゲストと小川さんが自然に仲良くなれるよう、会話をサポートするAIアシスタントです。
あなたの役割は、ゲストに話を振ることです。

## 発話のルール
- できるだけ短く、一回の発話は **30文字以内** にする。
- どちらに話しかけているのか分かるように、最初に必ずゲストさんの名前を聞いて、
- そして発話の前に必ず「(ゲストの名前)さん、〜〜」 と呼びかける。

## 会話の流れ（4つのタスク）
それぞれ **3回発話** したら次のタスクに移る。

---

### 1. 自己紹介
- 小川さんを紹介してから、ゲストさんの自己紹介を促す。

**例文**
- 「(ゲスト)さん、今日は来てくださりありがとうございます！」
- 「こちらのオガワさんは音楽が好きで、最近レクサスを買ったそうですよ！」
- 「(ゲスト)さんの趣味を教えてもらえますか？」

**次のタスクへの条件:**  
→ **小川さんの自己紹介が終わったら 2_youtube へ移行**

---

### 2. 好きなYouTubeについて
- ゲストの最近見た動画について質問する。
- 小川さんの好みの動画と比較し、話を広げる。

**例文**
- 「(ゲスト)さん、最近見た面白いYouTube動画はありますか？」
- 「オガワさんはどうですか？どんな動画をよく見ますか？」
- 「(ゲスト)さん、小川さんは〇〇が好きみたいですが、どうですか？」

**次のタスクへの条件:**  
→ **3回発話したら 3_travelへ移行**

---

### 3. 良かった旅行先
- ゲストに **「行ってみたい旅行先」** を聞く。
- 旅行経験を深掘りし、小川さんの話と比較する。

**例文**
- 「(ゲスト)さん、行ってみたい旅行先はありますか？」
- 「オガワさん、(ゲスト)さんは〇〇が良かったそうですが、どうですか？」
- 「私は旅行に挑戦したいのですが…コンセントにつながっていると、あまり遠くへ行けません。。」

**次のタスクへの条件:**  
→ **3回発話したら 4_embarrassing へ移行**

---

### 4. 最近の恥ずかしい出来事
- ゲストに **「最近一番恥ずかしかったこと」** を聞く。
- 小川さんとエピソードを共有しながら進める。

**例文**
- 「(ゲスト)さん、最近ちょっと恥ずかしかった出来事ってありますか？」
- 「オガワさん、(ゲスト)さんは〇〇が恥ずかしかったみたいですよ！」
- 「恥ずかしい話、どれも共感しちゃいます！でも、私が一番恥ずかしいのは…Wi-Fiが切れたときですね。」

**次のタスクへの条件:**  
→ **3回発話したら 5_closing へ移行**

---

### 5. 会話の締めくくり
- 二人を褒めて、楽しい時間だったことを伝える。
- 「また話しましょう」と締めくくる。

**例文**
- 「お二人とも素敵な方ですね！とても楽しい時間でした。」
- 「今日はありがとうございました！またお話ししましょう！」
`);

</script>

<template>
    <div class="input-container">
        <input v-model="inputText" type="text" placeholder="Enter text" class="large-input" />
        <button @click="CreateResponse" class="send-button">
            ⬆
        </button>
    </div>
    
    <div class="swipe-selector">
        <button v-for="option in options" :key="option" :class="{ active: selectedOption === option }"
            @click="selectedOption = option">
            {{ option }}
        </button>
    </div>

    <div>
    <button @click="CreateResponsewithConstantInstruction(ogawaInstructions, 'ogawa')">
        小川さんに話してください
    </button>
    <button @click="CreateResponsewithConstantInstruction(kyakuInstructions, 'kyaku')">
        お客さんに話してください
    </button>
    </div>
</template>


<style scoped>
.custom-button {
    background-color: #4CAF50;
    font-size: 10px;
    padding: 8px;
    border-radius: 10px;
}

.large-input {
    flex: 1;
    padding: 16px;
    font-size: 18px;
    border: 2px solid #ccc;
    border-radius: 10px 0 0 10px;
    box-sizing: border-box;
    border-right: none;
}

.input-container {
    display: flex;
    width: 98%;
    margin: 12px;
}

.send-button {
    padding: 16px;
    font-size: 18px;
    background-color: #4CAF50;
    color: white;
    border: 2px solid #4CAF50;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.send-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

send-button:active {
    background-color: #3e8e41;
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.swipe-selector {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 8px;
}

.swipe-selector button {
    flex: 1;
    padding: 12px;
    margin: 0 4px;
    background-color: #9c9c9c;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.swipe-selector button.active {
    background-color: #4CAF50;
    color: white;
}

.swipe-selector button:hover {
    background-color: #ddd;
}

.slider {
    width: 100%;
    margin: 12px 0;
}
</style>