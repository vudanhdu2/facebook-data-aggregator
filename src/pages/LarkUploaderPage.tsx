import { useMemo, useState } from "react";

type UploadResult = {
  type: "success" | "error";
  message: string;
  detail?: string;
};

type TokenResponse = {
  code: number;
  msg: string;
  tenant_access_token?: string;
  expire?: number;
};

const API_BASE = "https://open.feishu.cn/open-apis";

const LarkUploaderPage = () => {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [mdFile, setMdFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [uploadingMd, setUploadingMd] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  const activeToken = useMemo(() => accessToken.trim(), [accessToken]);

  const pushResult = (result: UploadResult) => {
    setResults((prev) => [result, ...prev]);
  };

  const getTenantToken = async () => {
    if (!appId.trim() || !appSecret.trim()) {
      pushResult({
        type: "error",
        message: "Vui lòng nhập App ID và App Secret trước khi lấy token.",
      });
      return;
    }

    setLoadingToken(true);
    try {
      const response = await fetch(`${API_BASE}/auth/v3/tenant_access_token/internal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: appId.trim(),
          app_secret: appSecret.trim(),
        }),
      });

      const data = (await response.json()) as TokenResponse;

      if (!response.ok || data.code !== 0 || !data.tenant_access_token) {
        pushResult({
          type: "error",
          message: "Không lấy được tenant access token.",
          detail: data.msg || `HTTP ${response.status}`,
        });
        return;
      }

      setAccessToken(data.tenant_access_token);
      pushResult({
        type: "success",
        message: "Lấy token thành công.",
        detail: `Token hết hạn sau ${data.expire ?? "?"} giây.`,
      });
    } catch (error) {
      pushResult({
        type: "error",
        message: "Có lỗi khi gọi API lấy token.",
        detail: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingToken(false);
    }
  };

  const uploadMarkdown = async () => {
    if (!mdFile) {
      pushResult({ type: "error", message: "Bạn chưa chọn file Markdown (.md)." });
      return;
    }

    if (!activeToken) {
      pushResult({ type: "error", message: "Vui lòng có access token trước khi upload." });
      return;
    }

    setUploadingMd(true);

    try {
      const form = new FormData();
      form.append("file_type", "stream");
      form.append("file_name", mdFile.name);
      form.append("file", mdFile);

      const response = await fetch(`${API_BASE}/im/v1/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
        body: form,
      });

      const data = await response.json();

      if (!response.ok || data.code !== 0) {
        pushResult({
          type: "error",
          message: `Upload Markdown thất bại (${mdFile.name}).`,
          detail: data.msg || `HTTP ${response.status}`,
        });
        return;
      }

      pushResult({
        type: "success",
        message: `Upload Markdown thành công (${mdFile.name}).`,
        detail: `file_key: ${data.data?.file_key ?? "(không có)"}`,
      });
    } catch (error) {
      pushResult({
        type: "error",
        message: "Lỗi khi upload Markdown.",
        detail: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setUploadingMd(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      pushResult({ type: "error", message: "Bạn chưa chọn file ảnh." });
      return;
    }

    if (!activeToken) {
      pushResult({ type: "error", message: "Vui lòng có access token trước khi upload." });
      return;
    }

    setUploadingImage(true);

    try {
      const form = new FormData();
      form.append("image_type", "message");
      form.append("image", imageFile);

      const response = await fetch(`${API_BASE}/im/v1/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
        body: form,
      });

      const data = await response.json();

      if (!response.ok || data.code !== 0) {
        pushResult({
          type: "error",
          message: `Upload ảnh thất bại (${imageFile.name}).`,
          detail: data.msg || `HTTP ${response.status}`,
        });
        return;
      }

      pushResult({
        type: "success",
        message: `Upload ảnh thành công (${imageFile.name}).`,
        detail: `image_key: ${data.data?.image_key ?? "(không có)"}`,
      });
    } catch (error) {
      pushResult({
        type: "error",
        message: "Lỗi khi upload ảnh.",
        detail: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">LarkSuite Uploader (Markdown + Ảnh)</h1>
          <p className="text-sm text-slate-600">
            Ứng dụng mẫu để lấy <code>tenant_access_token</code> và upload file Markdown / ảnh lên LarkSuite (Feishu) qua Open API.
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
            Lưu ý: nếu bị lỗi CORS khi chạy frontend trực tiếp, bạn nên gọi API qua backend proxy để bảo mật App Secret và ổn định hơn.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-semibold">1) Thông tin ứng dụng Lark</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-600">App ID</span>
              <input
                className="border rounded px-3 py-2"
                placeholder="cli_xxxxx"
                value={appId}
                onChange={(event) => setAppId(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-600">App Secret</span>
              <input
                className="border rounded px-3 py-2"
                placeholder="Nhập app secret"
                type="password"
                value={appSecret}
                onChange={(event) => setAppSecret(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={getTenantToken}
            disabled={loadingToken}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loadingToken ? "Đang lấy token..." : "Lấy tenant access token"}
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">2) Access token (có thể paste thủ công)</h2>
          <textarea
            className="border rounded px-3 py-2 w-full min-h-24"
            placeholder="Dán tenant_access_token vào đây"
            value={accessToken}
            onChange={(event) => setAccessToken(event.target.value)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold">3) Upload file</h2>

          <div className="border rounded p-4 space-y-2">
            <p className="font-medium">Upload Markdown (.md)</p>
            <input
              type="file"
              accept=".md,text/markdown"
              onChange={(event) => setMdFile(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={uploadMarkdown}
              disabled={uploadingMd}
              className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {uploadingMd ? "Đang upload..." : "Upload Markdown"}
            </button>
          </div>

          <div className="border rounded p-4 space-y-2">
            <p className="font-medium">Upload ảnh (png/jpg/webp...)</p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploadingImage}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {uploadingImage ? "Đang upload..." : "Upload ảnh"}
            </button>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Kết quả</h2>
          {results.length === 0 && <p className="text-sm text-slate-500">Chưa có thao tác nào.</p>}
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={`${result.message}-${index}`}
                className={`border rounded p-3 ${
                  result.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <p className="font-medium">{result.message}</p>
                {result.detail && <p className="text-sm">{result.detail}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LarkUploaderPage;
