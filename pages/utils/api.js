import { changeItemStatus, getItemList, useAPI } from "../utils/mongodb";
import { ChatGPTAPI } from "chatgpt";
let instance;
class ChatAPI {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  async init() {
    if (!this.key) {
      const key = await this.getAPIKey();
      this.key = key;
      this.ChatGPTAPI = new ChatGPTAPI({
        apiKey: key,
      });
      this.UsageLimit = process.env.LIMIT;
    }
  }

  async getAPIKey() {
    // get API key
    let itemList = await getItemList("avaliable");
    const tokens = 50;
    if (itemList.length > 0) {
      let selectedItem = itemList[Math.floor(Math.random() * itemList.length)];
      while (
        itemList.length > 0 && selectedItem.usage + tokens >= this.UsageLimit
      ) {
        await changeItemStatus(selectedItem.key);
        itemList = await getItemList("avaliable");
        selectedItem = itemList[Math.floor(Math.random() * itemList.length)];
      }
      if (itemList.length > 0) {
        return selectedItem.key;
      }
    }
  }
}

// await useAPI(selectedItem.key, tokens);

export async function getChatGPTAPI() {
  const new1 = new ChatAPI();
  await new1.init();
  return new1  
}
