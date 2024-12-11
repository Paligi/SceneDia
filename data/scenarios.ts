export interface Word {
  word: string;
  translation: string;
  example: string;
  pronunciation?: string;
}

export interface Expression {
  original: string;
  translation: string;
}

export interface DialogueStep {
  speaker: 'user' | 'agent';
  text: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  expressions: Expression[];
  words: Word[];
  dialogue: DialogueStep[];
}

export const scenarios: Scenario[] = [
  {
    id: "restaurant",
    name: "在餐厅",
    description: "在餐厅点餐和用餐的场景",
    expressions: [
      { original: "我想要预订一张桌子", translation: "I'd like to reserve a table" },
      { original: "今天的特色菜是什么？", translation: "What's today's special?" },
      { original: "请给我一份菜单", translation: "Can I have a menu, please?" },
      { original: "我对花生过敏", translation: "I'm allergic to peanuts" },
      { original: "这道菜非常美味", translation: "This dish is delicious" }
    ],
    words: [
      { word: "menu", translation: "菜单", example: "Can I see the menu, please? 请让我看一下菜单。", pronunciation: "/ˈmenjuː/" },
      { word: "waiter", translation: "服务员", example: "Excuse me, waiter! Could you bring us some water?", pronunciation: "/ˈweɪtər/" },
      { word: "order", translation: "点菜", example: "Are you ready to order? 您准备好点菜了吗？", pronunciation: "/ˈɔːrdər/" },
      { word: "delicious", translation: "美味的", example: "The food was delicious! 这食物太美味了！", pronunciation: "/dɪˈlɪʃəs/" },
      { word: "bill", translation: "账单", example: "Could we have the bill, please? 请给我们账单好吗？", pronunciation: "/bɪl/" }
    ],
    dialogue: [
      { speaker: 'agent', text: "Good evening, do you have a reservation?" },
      { speaker: 'user', text: "Yes, I have a reservation for two under the name Smith." },
      { speaker: 'agent', text: "Perfect, please follow me to your table. Here are the menus. Today's special is grilled salmon with asparagus." },
      { speaker: 'user', text: "That sounds good. Does it contain any nuts? I'm allergic to peanuts." },
      { speaker: 'agent', text: "No, the salmon dish doesn't contain any nuts. But I'll make sure to inform the kitchen about your allergy." },
      { speaker: 'user', text: "Thank you. I'll have the salmon then, and a glass of white wine please." },
      { speaker: 'agent', text: "Excellent choice. I'll be back with your wine shortly." }
    ]
  },
  {
    id: "airport",
    name: "在机场",
    description: "在机场办理登机手续和通过安检的场景",
    expressions: [
      { original: "我需要办理登机手续", translation: "I need to check in" },
      { original: "我的航班延误了吗？", translation: "Is my flight delayed?" },
      { original: "行李超重要付多少费用？", translation: "How much is the fee for overweight luggage?" },
      { original: "安检在哪里？", translation: "Where is the security check?" },
      { original: "我的登机口是多少号？", translation: "What's my gate number?" }
    ],
    words: [
      { word: "flight", translation: "航班", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "check-in", translation: "登机手续", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "luggage", translation: "行李", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "boarding pass", translation: "登机牌", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "gate", translation: "登机口", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "delayed", translation: "延误的", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "overweight", translation: "超重的", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "security", translation: "安检", example: "Would you like some coffee? 你想喝点咖啡吗？" },
    ],
    dialogue: [
      { speaker: 'agent', text: "Good morning, how may I help you?" },
      { speaker: 'user', text: "Good morning, I need to check in for my flight." },
      { speaker: 'agent', text: "May I see your passport and booking reference, please?" },
      { speaker: 'user', text: "Here you are." },
      { speaker: 'agent', text: "Thank you. Are you checking any bags today?" },
      { speaker: 'user', text: "Yes, I have one suitcase to check." },
      { speaker: 'agent', text: "Alright, please place your suitcase on the scale. It's slightly overweight. You'll need to pay a fee or remove some items." },
      { speaker: 'user', text: "How much is the fee for overweight luggage?" },
      { speaker: 'agent', text: "The fee is $50 for overweight luggage." },
      { speaker: 'user', text: "I see. I'll pay the fee." },
      { speaker: 'agent', text: "Thank you. Here's your boarding pass. Your flight departs from gate 15 at 10:30 AM." },
      { speaker: 'user', text: "Where is the security check?" },
      { speaker: 'agent', text: "The security check is to your right, just follow the signs. Have a good flight!" },
      { speaker: 'user', text: "Thank you very much!" },
    ]
  },
  {
    id: "hotel",
    name: "酒店",
    description: "在酒店办理入住和咨询服务的场景",
    expressions: [
      { original: "我有一个预订", translation: "I have a reservation" },
      { original: "您能帮我叫醒服务吗？", translation: "Can you give me a wake-up call?" },
      { original: "Wi-Fi密码是什么？", translation: "What's the Wi-Fi password?" },
      { original: "我想延长住宿", translation: "I'd like to extend my stay" },
      { original: "健身房在哪里？", translation: "Where is the gym?" }
    ],
    words: [
      { word: "reservation", translation: "预订", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "check-in", translation: "入住", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "room key", translation: "房卡", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "amenities", translation: "设施", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "concierge", translation: "礼宾部", example: "Would you like some coffee? 你想喝点咖啡吗？" }
    ],
    dialogue: [
      { speaker: 'agent', text: "Good afternoon, welcome to our hotel. How may I assist you?" },
      { speaker: 'user', text: "Hello, I have a reservation under the name Johnson." },
      { speaker: 'agent', text: "Certainly, let me check that for you. Yes, I see your reservation. You're staying with us for three nights, is that correct?" },
      { speaker: 'user', text: "Yes, that's right." },
      { speaker: 'agent', text: "Perfect. Here's your room key. You're in room 305 on the third floor. The elevators are to your right." },
      { speaker: 'user', text: "Thank you. Could you tell me what the Wi-Fi password is?" },
      { speaker: 'agent', text: "Of course. The Wi-Fi password is 'WelcomeGuest2023'. You'll find it written in the welcome packet in your room as well." },
      { speaker: 'user', text: "Great, thanks. One more thing, where is the gym located?" },
      { speaker: 'agent', text: "The gym is on the second floor. It's open 24/7 and you can access it with your room key." },
      { speaker: 'user', text: "Perfect, thank you for your help." },
      { speaker: 'agent', text: "You're welcome. Enjoy your stay with us!" }
    ]
  },
  {
    id: "shopping",
    name: "购物",
    description: "在商店购物询问商品信息的场景",
    expressions: [
      { original: "这件衣服有别的颜色吗？", translation: "Do you have this in another color?" },
      { original: "试衣间在哪里？", translation: "Where are the fitting rooms?" },
      { original: "这个打折吗？", translation: "Is this on sale?" },
      { original: "我能退货吗？", translation: "Can I return this?" },
      { original: "您接受信用卡吗？", translation: "Do you accept credit cards?" }
    ],
    words: [
      { word: "size", translation: "尺码", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "discount", translation: "折扣", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "receipt", translation: "收据", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "cashier", translation: "收银员", example: "Would you like some coffee? 你想喝点咖啡吗？" },
      { word: "bargain", translation: "便宜货", example: "Would you like some coffee? 你想喝点咖啡吗？" }
    ],
    dialogue: [
      { speaker: 'agent', text: "Hello, welcome to our store. Can I help you find anything?" },
      { speaker: 'user', text: "Hi, yes, I'm looking for a blue shirt." },
      { speaker: 'agent', text: "Certainly, our shirt section is right over here. Here's a nice blue one. Would you like to try it on?" },
      { speaker: 'user', text: "Yes, please. Where are the fitting rooms?" },
      { speaker: 'agent', text: "The fitting rooms are at the back of the store, to your left." },
      { speaker: 'user', text: "Thank you. By the way, is this shirt on sale?" },
      { speaker: 'agent', text: "Yes, it is. All shirts are 20% off this week." },
      { speaker: 'user', text: "Great! I'll take it. Do you accept credit cards?" },
      { speaker: 'agent', text: "Yes, we do. I can help you at the register when you're ready." },
      { speaker: 'user', text: "I'm ready now. Oh, what's your return policy?" },
      { speaker: 'agent', text: "You can return or exchange items within 30 days with the receipt. Is there anything else you need?" },
      { speaker: 'user', text: "No, that's all. Thank you for your help." },
      { speaker: 'agent', text: "You're welcome. Have a great day!" }
    ]
  },
  {
    id: "coffee-shop",
    name: "咖啡店",
    description: "在咖啡店点饮品和小食的场景",
    expressions: [
      { original: "我想要一杯拿铁", translation: "I'd like a latte" },
      { original: "请问有无糖的选择吗？", translation: "Do you have sugar-free options?" },
      { original: "我要外带", translation: "I'd like it to go" },
      { original: "能加多一份浓缩吗？", translation: "Can I add an extra shot of espresso?" }
    ],
    words: [
      { word: "latte", translation: "拿铁", example: "One iced latte, please", pronunciation: "/ˈlɑːteɪ/" },
      { word: "espresso", translation: "浓缩咖啡", example: "An espresso shot", pronunciation: "/eˈspresəʊ/" },
      { word: "pastry", translation: "糕点", example: "Would you like a pastry with your coffee?", pronunciation: "/ˈpeɪstri/" }
    ],
    dialogue: [/* ... */]
  },
  {
    id: "doctor",
    name: "看医生",
    description: "在诊所就医和描述症状的场景",
    expressions: [
      { original: "我感觉不舒服", translation: "I'm not feeling well" },
      { original: "我头很痛", translation: "I have a headache" },
      { original: "这个药什么时候吃？", translation: "When should I take this medicine?" }
    ],
    words: [
      { word: "symptom", translation: "症状", example: "What are your symptoms?", pronunciation: "/ˈsɪmptəm/" },
      { word: "prescription", translation: "处方", example: "Here's your prescription", pronunciation: "/prɪˈskrɪpʃn/" }
    ],
    dialogue: [/* ... */]
  },
  {
    id: "transportation",
    name: "交通出行",
    description: "乘坐公共交通和打车的场景",
    expressions: [
      { original: "这趟车去市中心吗？", translation: "Does this bus go downtown?" },
      { original: "下一站在哪里下？", translation: "Which is the next stop?" }
    ],
    words: [/* ... */],
    dialogue: [/* ... */]
  }
];

