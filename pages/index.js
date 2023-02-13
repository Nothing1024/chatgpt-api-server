import React from "react";

function App() {
  const [chatProfile, setChatProfile] = React.useState([
    "Chat机器人(id:123)",
    "您",
    null,
    null,
  ]);
  const [chatMsgList, setChatMsgList] = React.useState([]);
  const [promptInput, setPromptInput] = React.useState("");

  const sendChatGPT = async (promptInput) => {
    // send
    let body = { message: promptInput };
    if (chatProfile[2]) {
      body.conversationId = chatProfile[2];
      if (chatProfile[3]) {
        body.parentMessageId = chatProfile[3];
      }
    }
    await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body }),
    })
      .then((response) => response.json())
      .then((data) => {
        setChatProfile(
          (e) => [
            "Chat机器人|" + data.data.conversationId,
            e[1],
            data.data.conversationId,
            data.data.id,
          ],
        );

        setChatMsgList(
          (chatMsgList) => [
            { "type": "start", "msg": data.data.text },
            ...chatMsgList,
          ],
        );
      })
      .catch((error) => {
        console.log(error);
        setChatMsgList(
          (chatMsgList) => [
            { "type": "start", "msg": "出现错误,请检查网络后重新输入"},
            ...chatMsgList,
          ],
        );
        console.error(error);
      });

    console.log("finish");
  };
  const sendMsg = async () => {
    setChatMsgList(
      () => [{ "type": "end", "msg": promptInput }, ...chatMsgList],
    );
    await sendChatGPT(promptInput);
  };
  return (
    <>
      <div>

            <div>
              {chatMsgList.map((res, index) => (
                <div
                  key={index}
                  className={"chat " +
                    (res.type == "start" ? "chat-start" : "chat-end")}
                >
                  <div className="chat-header">
                    {res.type == "start" ? chatProfile[0] : chatProfile[1]}
                  </div>
                  <div className="chat-bubble">
                    {res.msg}
                  </div>
                </div>
              ))}
              <div className="fixed bottom-5 w-full">
              <div className="flex align-center justify-center ">
                <div className="mt-1 w-8/12">
                  <textarea
                    rows={2}
                    type="text"
                    className="textarea textarea-bordered w-full"
                    placeholder="请输入问题"
                    defaultValue={""}
                    onChange={(e) => {
                      setPromptInput(e.target.value);
                    }}
                  />
                </div>
                <button className="btn ml-5 mt-7" onClick={sendMsg}>
                  Send
                </button>
              </div>
              </div>
            </div>
      </div>
    </>
  );
}

export default App;
