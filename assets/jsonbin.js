/**
 * JSONBin.io v3 读写封装
 * 依赖：window.GJJ_CONFIG.jsonbin = { binId, masterKey }
 */
(function (global) {
  const API = 'https://api.jsonbin.io/v3/b';

  function conf() {
    return (global.GJJ_CONFIG && global.GJJ_CONFIG.jsonbin) || {};
  }

  function isConfigured() {
    const { binId, masterKey } = conf();
    return !!(binId && masterKey && String(binId).trim() && String(masterKey).trim());
  }

  function headers(extra) {
    const { masterKey } = conf();
    return Object.assign(
      {
        'Content-Type': 'application/json',
        'X-Master-Key': masterKey,
      },
      extra || {}
    );
  }

  async function readError(res) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.Message || JSON.stringify(body);
    } catch {
      detail = res.statusText || '';
    }
    return `JSONBin ${res.status}${detail ? '：' + detail : ''}`;
  }

  /** 读取最新数据，返回数组 */
  async function load() {
    if (!isConfigured()) throw new Error('未配置 JSONBin');
    const { binId } = conf();
    const res = await fetch(`${API}/${binId}/latest`, {
      method: 'GET',
      headers: headers({ 'X-Bin-Meta': 'false' }),
    });
    if (!res.ok) throw new Error(await readError(res));
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.record)) return data.record;
    throw new Error('JSONBin 数据格式应为数组');
  }

  /** 整份覆盖保存（关闭版本控制，节省免费额度） */
  async function save(rows) {
    if (!isConfigured()) throw new Error('未配置 JSONBin');
    if (!Array.isArray(rows)) throw new Error('保存数据必须是数组');
    const { binId } = conf();
    const res = await fetch(`${API}/${binId}`, {
      method: 'PUT',
      headers: headers({ 'X-Bin-Versioning': 'false' }),
      body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(await readError(res));
    return res.json();
  }

  /**
   * 用本地数组创建新 Bin，返回 binId
   * 创建成功后请把 binId 写回 config.js
   */
  async function create(rows, name) {
    const { masterKey } = conf();
    if (!masterKey) throw new Error('请先填写 masterKey');
    const res = await fetch(API, {
      method: 'POST',
      headers: headers({
        'X-Bin-Private': 'true',
        ...(name ? { 'X-Bin-Name': name } : {}),
      }),
      body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(await readError(res));
    const body = await res.json();
    const id = body?.metadata?.id || body?.id;
    if (!id) throw new Error('创建成功但未返回 Bin ID');
    return id;
  }

  global.GjjJsonBin = {
    isConfigured,
    load,
    save,
    create,
  };
})(typeof window !== 'undefined' ? window : globalThis);
