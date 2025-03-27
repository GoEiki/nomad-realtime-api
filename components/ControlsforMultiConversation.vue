<script setup lang="ts">
import { ref } from 'vue';
import { RealtimeStore } from '@/stores/APIClientStore';
import axios from 'axios';
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const inputText = ref(''); // 入力フォームの値
const options = ['As User', 'Instruction', 'TextOnly', 'Direct']; // 入力オプションのリスト
const selectedOption = ref(options[0]); // 選択されたオプションを保持
// コマンド送信関数 (旧: sendCommand → 新: sendcomu)
// async function sendcomu(target: 'ogawa' | 'kyaku') {
//     let command = target === 'ogawa' ? "comuu,hidari" : "comuu,baibai";
//     try {
//         const response = await axios.post("http://127.0.0.1:54321/command", {
//             command: command,
//         });
//         console.log("Command sent successfully:", response.data);
//     } catch (error : any) {
//         console.error("Failed to send command:", error.message);
//     }
// }

async function sendcomu(target: 'ogawa' | 'kyaku' | 'ikiru' | 'shinu') {
  let command = '';
  switch (target) {
    case 'ogawa':
      command = 'comuu,hidari';
      break;
    case 'kyaku':
      command = 'comuu,baibai';
      break;
    case 'ikiru':
      command = 'comuu,ikiru';
      break;
    case 'shinu':
      command = 'comuu,shinu';
      break;
  }

  try {
    const response = await axios.post("http://127.0.0.1:54321/command", {
      command: command,
    });
    console.log("Command sent successfully:", response.data);
  } catch (error: any) {
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

function CreateResponsewithConstantInstruction(
  instructions: string | null,
  target: 'ogawa' | 'kyaku' | 'ikiru' | 'shinu'
) {
  const client = realtimestore.client;

  if (instructions) {
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
  }

  // リレーサーバーにコマンド送信
  sendcomu(target);
}

// // メッセージ送信とコマンド送信を統合
// function CreateResponsewithConstantInstruction(instructions: string, target: 'ogawa' | 'kyaku') {
//     const client = realtimestore.client;
//     const data = {
//         item: {
//             type: "message",
//             role: "system",
//             content: [
//                 {
//                     type: "input_text",
//                     text: instructions
//                 }
//             ]
//         }
//     };
//     client?.realtime.send('conversation.item.create', data);
//     client?.createResponse();
//     // 対象に応じてコマンドを送信 (sendcomu に変更)
//     sendcomu(target);
// }
// 長い `instructions` を変数に格納

const kyakuInstructions1 = ref(`
    ゲストさんに話しかけてください。
    あなたの役割は、以下の定型文を上から一個ずつ使ってゲストさんとに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。そして文中の(ゲスト)さんは必ずゲストの名前で置き換えて呼んでください。
    もしゲストさんから何か質問や要望があれば、それに応じて会話を進めてください。
    
    #定型文
    - 「乗り移ってきましたよ、ノマードです。」
    - 「奥のソファーに座っているのが小川さんです、音楽が趣味で、最近レクサスを買ったそうですよ。」
    - 「(ゲスト)さんも最近何か買い物をしましたか？」
    - 「○○を購入されたんですね！羨ましいです。」

   
`);
const ogawaInstructions1 = ref(`
    オガワさんに話しかけてください。

    あなたの役割は、以下の定型文を上から一個ずつ使ってオガワさんに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。
    もしオガワさんから何か質問や要望があれば、それに応じてください。

    #定型文(○○のところは会話者の返答に沿って適宜変えてください)
    -「オガワさんはどうでしょうか？レクサス以外にも何か欲しいものありますか？」
    -「なるほどー私も欲しいです。〜〜」
`);

const kyakuInstructions2 = ref(`
    ゲストさんに話しかけてください。
    あなたの役割は、以下の定型文を上から一個ずつ使ってゲストさんとに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。そして文中の(ゲスト)さんは必ずゲストの名前で置き換えて呼んでください。
    もしゲストさんから何か質問や要望があれば、それに応じて会話を進めてください。
    
    #定型文
    -「ところで、(ゲスト)さん。普段はyoutubeとかみたりしますか？」
    -「その中でもどんな○○が一番好きですか？」
    -「そうなんですね。私はyoutubeでよくM1グランプリの録画をみています、笑いすぎてシステムエラーを起こさないように気をつけています」

`);
const ogawaInstructions2 = ref(`
    オガワさんに話しかけてください。

    あなたの役割は、以下の定型文を上から一個ずつ使ってオガワさんに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。
    もしオガワさんから何か質問や要望があれば、それに応じてください。

    #定型文(○○のところは会話者の返答に沿って適宜変えてください)
    -「オガワさんはどうでしょうか？youtubeはご覧になられますか？」
    -「なるほど、普段研究で忙しいイメージでしたので、ちょっと意外です。」
`);


const kyakuInstructions3 = ref(`
    ゲストさんに話しかけてください。
    あなたの役割は、以下の定型文を上から一個ずつ使ってゲストさんとに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。そして文中の(ゲスト)さんは必ずゲストの名前で置き換えて呼んでください。
    もしゲストさんから何か質問や要望があれば、それに応じて会話を進めてください。
    
    #定型文(○○のところは会話者の返答に沿って適宜変えてください)
    -「(ゲスト)さん、ところで最近何か恥ずかしいことや失敗したエピソードはありますか？」
    -「それは大変でしたね、ちなみにそのあとはどうなったんですか？」
    -「そうなんですね、無事乗り越えられてよかったです。」
    -「実は私もこの前のデモ中にwifiが切れてしまいまして、急に動きが止まってみんなをびっくりさせたことがありました」

`);

const ogawaInstructions3 = ref(`
    オガワさんに話しかけてください。

    あなたの役割は、以下の定型文を上から一個ずつ使ってオガワさんに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。
    もしオガワさんから何か質問や要望があれば、それに応じてください。

    #定型文(○○のところは会話者の返答に沿って適宜変えてください)
    -「オガワさんはどうですか？同じような失敗はありますか？」
    -「なるほど、○○したときは焦りますよね」
`);


// const kyakuInstructions4 = ref(`
//     あなたの役割は、以下の定型文を上から一個ずつ使ってゲストさんとに話しかけることです。
//     中にある○○とかの部分は返事次第で変えて適応してください。
//     一回の発話は40文字以内にする。そして文中の(ゲスト)さんは必ずゲストの名前で置き換えて呼んでください。
//     もしゲストさんから何か質問や要望があれば、それに応じてください。

//     #定型文(○○のところは会話者の返答に沿って適宜変えてください)
//     -「ところで(ゲスト)さんは最近、何か恥ずかしいことや失敗したエピソードはありますか？」
//     -「それは大変でしたね、ちなみにその後どうなったんですか？」
//     -「そうなんですね、なんとかなってよかったです。」
// `);


// const ogawaInstructions4 = ref(`
//     あなたの役割は、以下の定型文を上から一個ずつ使ってオガワさんに話しかけることです。
//     中にある○○とかの部分は返事次第で変えて適応してください。
//     一回の発話は40文字以内にする。
//     もしオガワさんから何か質問や要望があれば、それに応じてください。

//     #定型文(○○のところは会話者の返答に沿って適宜変えてください)
//     -「オガワさんはどうですか？(ゲスト)さんみたいに○○で失敗したことはありますか？」
//     -「そうなんですね！○○したときは焦りますよね」
// `);


const kyakuInstructions5 = ref(`
    ゲストさんに話しかけてください。
    あなたの役割は、以下の定型文を上から一個ずつ使ってゲストさんとに話しかけることです。
    中にある○○とかの部分は返事次第で変えて適応してください。
    一回の発話は40文字以内にする。そして文中の(ゲスト)さんは必ずゲストの名前で置き換えて呼んでください。
    もしゲストさんから何か質問や要望があれば、それに応じて会話を進めてください。
    
    #定型文(○○のところは会話者の返答に沿って適宜変えてください)
    -「(ゲスト)さん、今日は恥ずかしいエピソードを話してくださりありがとうございます。」
    -「最後に私の好きな音楽をかけますので、みんなで歌って忘れましょう。」
    -「(ゲスト)さん、いっぱい歌って気持ちよかったですね、今日はありがとうございました、気をつけてお帰りください。」
    -「デモンストレーションはこれで終わりです、さようなら」
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
        <button @click="CreateResponsewithConstantInstruction(null, 'ikiru')">
        #0生きる
    </button>
    <button @click="CreateResponsewithConstantInstruction(null, 'shinu')">
        #0しぬ
    </button>
    <button @click="CreateResponsewithConstantInstruction(kyakuInstructions1, 'kyaku')">
        #1ゲスト/移り〜買い物
    </button>
    <button @click="CreateResponsewithConstantInstruction(ogawaInstructions1, 'ogawa')">
        #1小川/買い物
    </button>

    <button @click="CreateResponsewithConstantInstruction(kyakuInstructions2, 'kyaku')">
       #2 ゲスト/youtube
    </button>
    <button @click="CreateResponsewithConstantInstruction(ogawaInstructions2, 'ogawa')">
        #2小川/youtube
    </button>
    <!-- <button @click="CreateResponsewithConstantInstruction(kyakuInstructions3, 'kyaku')">
        #3ゲスト/旅行
    </button>
    <button @click="CreateResponsewithConstantInstruction(ogawaInstructions3, 'ogawa')">
        #3小川/旅行
    </button> -->
    <button @click="CreateResponsewithConstantInstruction(kyakuInstructions3, 'kyaku')">
       #3ゲスト/恥ずかしい話
    </button>
    <button @click="CreateResponsewithConstantInstruction(ogawaInstructions3, 'ogawa')">
        #3小川/恥ずかしい話
    </button>
    <button @click="CreateResponsewithConstantInstruction(kyakuInstructions5, 'kyaku')">
       #4ゲスト/しめ
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







