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
オガワさんに話しかけてください。
## 発話のルール
- どちらに話しかけているのか分かるように、発話の前に必ず「オガワさん、〜〜」 と呼びかける。
それぞれの話題について **3回発話** したら次のタスクに移る。
`);
const kyakuInstructions = ref(`
ゲストに話しかけてください。
## 発話のルール
- どちらに話しかけているのか分かるように、最初に必ずゲストさんの名前を聞いて、
- そして発話の前に必ず「(ゲストの名前)さん、〜〜」 と呼びかける。
それぞれの話題について **3回発話** したら次のタスクに移る。
`);
</script>
<template>
    <div class="input-container">
        <input v-model="inputText" type="text" placeholder="Enter text" class="large-input" />
        <button @click="CreateResponse" class="send-button">
            :上矢印:
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
    background-color: #45A049;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
send-button:active {
    background-color: #3E8E41;
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
    background-color: #9C9C9C;
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






