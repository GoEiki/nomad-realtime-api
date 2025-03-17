<script setup lang="ts">
import { ref } from 'vue';
import { RealtimeStore } from '@/stores/APIClientStore';

const realtimestore = RealtimeStore(); // Pinia ストアを取得
const inputText = ref(''); // 入力フォームの値
const options = ['As User', 'Instruction', 'TextOnly', 'Direct']; // 入力オプションのリスト
const selectedOption = ref(options[0]); // 選択されたオプションを保持

// RealTime API にリクエストを送信、selectedOption に応じて応答の属性を変更
function CreateResponse() {
    const client = realtimestore.client;
    if (inputText.value) {
        if (selectedOption.value === 'Instruction') {
            const data = {
                item: {
                    type: "message",
                    role: "system",
                    content: [
                        {
                            type: "input_text",
                            text: inputText.value
                        }
                    ]
                }
            }
            client?.realtime.send('conversation.item.create', data);
            client?.createResponse();
        }
        else if (selectedOption.value === 'TextOnly') {
            const data = {
                item: {
                    type: "message",
                    role: "system",
                    content: [
                        {
                            type: "input_text",
                            text: inputText.value
                        }
                    ]
                }
            }
            client?.realtime.send('conversation.item.create', data);
            const metadata = {
                response: {
                    modalities: ["text"],
                },
            }
            client?.realtime.send('response.create', metadata);
        }
        else if (selectedOption.value === 'Direct') {
            const data = {
                item: {
                    type: "message",
                    role: "system",
                    content: [
                        {
                            type: "input_text",
                            text: `そのまま以下の文を発話してください。「${inputText.value}」`
                        }
                    ]
                }
            }
            client?.realtime.send('conversation.item.create', data);
            client?.realtime.send('response.create', {});
        }
        else if (selectedOption.value === 'As User') {
            const data = {
                item: {
                    type: "message",
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: inputText.value
                        }
                    ]
                }
            }
            client?.realtime.send('conversation.item.create', data);
            client?.realtime.send('response.create', {});
        }
        else {
            console.error('Invalid option');
        }
    }
    else {
        client?.createResponse();
    }
    inputText.value = '';

}
function CreateResponsewithConstantInstruction(instructions: string) {
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
    }
    client?.realtime.send('conversation.item.create', data);
    client?.createResponse();
}

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
        <button @click="CreateResponsewithConstantInstruction('発話する前に”オガワさん”って呼びかけてから、話してください')">小川さんに話してください</button>
        <button @click="CreateResponsewithConstantInstruction('発話する前に”タミヤさん”と呼びかけてから、話してください')">ゲストに話しかけてください</button>
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