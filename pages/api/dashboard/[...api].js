import {
  addNewItem,
  changeItemStatus,
  deleteItem,
  getItemList,
} from "../../utils/mongodb";

export default async function handler(req, res) {
  if (process.env.DASHBOARD_DEBUG != "true") {
    let result = 1;
    const { api } = req.query;
    if (api[0] == "createNewAPI") {
      let obj = {};
      obj.key = api[1];
      obj.enabled = api[2] ?? false;
      obj.usage = api[3] ?? 0;
      result = await addNewItem({ ...obj });
    } else if (api[0] == "deleteAPI") {
      if (api.length == 1) {
        result = {
          "status": "error",
          "result": "id needed",
        };
      } else {
        result = await deleteItem(api[1]);
        if (result["deletedCount"] == 0) {
          result = {
            "status": "error",
            "result": "Not Found",
          };
        } else {
          result = {
            "status": "success",
            "result": result,
          };
        }
      }
    } else if (api[0] == "getAPIList") {
      result = await getItemList(api[1] ?? "all");
    } else if (api[0] == "changeAPIStatus") {
      result = {
        "status": "success",
        "result": await changeItemStatus(api[1]),
      };
    }
    await res.status(200).json(result ? result : {});
  }

  await res.status(200).json({ "msg": "error" });
}
