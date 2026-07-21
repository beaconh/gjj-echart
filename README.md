# 公积金还款明细图表

静态页面 + ECharts。数据默认读 `assets/data.json`；可接 **Supabase**（推荐）或 JSONBin 做云端增删改查。

优先级：`Supabase` > `JSONBin` > 本地文件。

---

## 启用 Supabase（推荐）

### 1. 注册并创建项目

1. 打开 [supabase.com](https://supabase.com) → Start your project  
2. 用 GitHub / 邮箱登录  
3. **New project**：选区域（如 Northeast Asia / Singapore）、设数据库密码（自己记住即可）  
4. 等项目创建完成（约 1～2 分钟）

### 2. 建表

1. 左侧 **SQL Editor** → New query  
2. 打开本仓库 `assets/supabase-setup.sql`，**全文复制**粘贴进去  
3. 点 **Run**，看到 success 即可  

这会创建表 `repayments`，并允许用 anon 密钥读写（仅适合个人自用）。

### 3. 复制密钥

1. 左侧 **Project Settings**（齿轮）→ **API**  
2. 复制：  
   - **Project URL**（形如 `https://xxxx.supabase.co`）  
   - **anon public** key（长字符串）

### 4. 写入配置

编辑 `assets/config.js`：

```js
window.GJJ_CONFIG = {
  supabase: {
    url: 'https://xxxx.supabase.co',
    anonKey: 'eyJhbGciOi...',
  },
  jsonbin: {
    binId: '',
    masterKey: '',
  },
};
```

### 5. 打开页面

用 Live Server 打开（不要用 `file://`）。  
标题旁显示 **Supabase 云端** 即成功。

若表是空的，会弹窗问是否导入本地 `data.json` → 选「导入」。

之后增删改会按条同步到 Supabase。

---

## JSONBin（可选备用）

免费额度约一次性 1 万次请求。填写 `jsonbin.binId` / `masterKey` 即可；若已配 Supabase 则不会走 JSONBin。

---

## 注意

- `anon` 密钥写在前端可被看到，**只适合自己用**，不要公开分享。  
- 免费档有月度额度，个人用一般够。  
- 需 http(s) 访问（Live Server）。
