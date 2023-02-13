import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db(process.env.MONGODB_DB);
const products = database.collection(process.env.MONGODB_COLLECTION);

export async function addNewItem(productInfo) {
  let output = {};
  output = await products.findOne({ key: productInfo.key });
  if (!output) {
    output = {
      status: "success",
      result: await products.insertOne(productInfo),
    };
  } else {output = {
      "status": "error",
      "result": "Key already exists, insert is forbidden",
    };}
  return output;
}

export async function deleteItem(key) {
  let output = await products.deleteOne({ key });
  return output;
}

export async function getItemList(mode) {
  const cursor = products.find();
  let result = [];
  await cursor.forEach((res) => {
    if (mode == "avaliable") {
      if (res.enabled == "1") {
        result.push({ ...res });
      }
    } else {
      result.push(res);
    }
  });
  return result;
}

export async function changeItemStatus(key) {
  let output = {};
  output = await products.findOne({ key: key });
  if (output) {
    const temp = await products.updateOne(
      { key: key },
      { $set: { ...output, enabled: output.enabled == "0" ? "1" : "0" } },
    );
    output = {
      status: "success",
      result: temp,
    };
  } else {
    output = {
      "status": "error",
      "result": "key not found",
    };
  }
  return output;
}

export async function useAPI(key, tokens) {
  let output = {};
  output = await products.findOne({ key: key });
  if (output) {
    const temp = await products.updateOne(
      { key: key },
      { $set: { ...output, usage: parseFloat(output.usage) + tokens } },
    );
    output = {
      status: "success",
      result: temp,
    };
  } else {
    output = {
      "status": "error",
      "result": "key not found",
    };
  }
  return output;
}
