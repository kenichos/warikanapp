import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const store = getStore("warikan-store");

  const headers = {
    "Content-Type": "application/json",
  };

  // 1. プロジェクトの新規作成 (POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const projectId = body.id;
      await store.setJSON(projectId, body); 
      return new Response(JSON.stringify(body), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  }

  // 2. 立て替えデータの追加・削除など、プロジェクトの更新 (PUT)
  if (req.method === "PUT") {
    try {
      if (!id) return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400, headers });
      const body = await req.json();
      await store.setJSON(id, body); 
      return new Response(JSON.stringify(body), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  }

  // 3. プロジェクトデータの取得 (GET) 💡ここを正しい仕様に修正しました！
  if (req.method === "GET") {
    try {
      if (!id) return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400, headers });
      
      // 💡 正しい読み込み方の記述（{ type: "json" } を指定）
      const data = await store.get(id, { type: "json" });
      if (!data) {
        return new Response(JSON.stringify({ error: "プロジェクトが見つかりません" }), { status: 404, headers });
      }
      return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: "許可されていない操作です" }), { status: 405, headers });
};

export const config = {
  path: "/api/warikan"
};
