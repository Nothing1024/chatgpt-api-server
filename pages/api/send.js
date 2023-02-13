import { changeItemStatus, getItemList, useAPI } from "../utils/mongodb";
import { ChatGPTAPI } from "chatgpt";
import { getChatGPTAPI } from "../utils/api";

// const chat = new ChatGPTAPI({
//   apiKey: apiKey,
// });

export default async function handler(req, res) {
  if (req.method === "POST") {
    let result = {};
    const jsonData = await req.body;
    if (jsonData.message || true) {
      // get Msg and MsgID
      let reqInfo = {};
      if (jsonData.conversationId && jsonData.parentMessageId) {
        reqInfo = {
          conversationId: jsonData.conversationId,
          parentMessageId: jsonData.parentMessageId,
        };
      }
      const message = jsonData.message;
      const api = await getChatGPTAPI();
      result = await api.ChatGPTAPI.sendMessage(message, { ...reqInfo });
      console.log("---");
      if (result?.detail?.usage?.total_tokens) {
        await useAPI(api.key, result.detail.usage.total_tokens);
      }
    }
    res.status(200).json({ status: "success", data: result });
  } else {
    res.status(405).json({ status: "failure", message: "Method not allowed" });
  }
}
