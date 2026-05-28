import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  // 「warikan-store」という名前のあなた専用の安全なデータ保存領域を確保
  const store = getStore("warikan-store");

  const headers = {
    "Content-Type": "application/json",
  };

  // 1. プロジェクトの新規作成 (POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const projectId = body.id; // フロントエンドから送られてきた部屋ID
      
      // データベースに保存
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
      
      // データを上書き保存
      await store.setJSON(id, body);
      return new Response(JSON.stringify(body), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  }

  // 3. プロジェクトデータの取得 (GET)
  if (req.method === "GET") {
    try {
      if (!id) return new Response(JSON.stringify({ error: "IDが指定されていません" }), { status: 400, headers });
      
      // データベースから読み込み
      const data = await store.getJSON(id);
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

// 💡 AI講師解説：このプログラムのURLを「/api/warikan」に指定する設定です
export const config = {
  path: "/api/warikan"
};
