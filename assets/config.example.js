/**
 * 云端配置（个人用）
 *
 * 优先顺序：Supabase > JSONBin > 本地 data.json
 *
 * —— Supabase（推荐，免费额度按月刷新）——
 * 1. https://supabase.com 注册并创建项目
 * 2. Project Settings → API：复制 Project URL、anon public key
 * 3. SQL Editor 执行 assets/supabase-setup.sql
 * 4. 填到下面 supabase 两项；首次打开页面若表为空，会提示导入本地 data.json
 *
 * —— JSONBin（可选备用）——
 * binId + masterKey；与 Supabase 同时填写时以 Supabase 为准
 *
 * 注意：密钥写在前端可被看到，仅适合自己用。
 */
window.GJJ_CONFIG = {
  supabase: {
    url: '',
    anonKey: '',
  },
  jsonbin: {
    binId: '',
    masterKey: '',
  },
};
