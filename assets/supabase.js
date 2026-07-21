/**
 * Supabase REST（PostgREST）封装
 * 表名：repayments
 * 字段：row_index, period, pay_date, total, principal, interest, penalty, rate
 */
(function (global) {
  const TABLE = 'repayments';

  function conf() {
    return (global.GJJ_CONFIG && global.GJJ_CONFIG.supabase) || {};
  }

  function isConfigured() {
    const { url, anonKey } = conf();
    return !!(url && anonKey && String(url).trim() && String(anonKey).trim());
  }

  function baseUrl() {
    return String(conf().url).replace(/\/$/, '') + '/rest/v1';
  }

  function headers(extra) {
    const { anonKey } = conf();
    return Object.assign(
      {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: 'Bearer ' + anonKey,
      },
      extra || {}
    );
  }

  function normalize(row) {
    if (!row || typeof row !== 'object') return null;
    const index = row.index != null ? row.index : row.row_index;
    const date = row.date != null ? row.date : row.pay_date;
    if (index == null || date == null || row.period == null) return null;
    const item = {
      index: Number(index),
      period: Number(row.period),
      date: String(date),
      total: Number(row.total) || 0,
      principal: Number(row.principal) || 0,
      interest: Number(row.interest) || 0,
      penalty: Number(row.penalty) || 0,
    };
    if (row.rate != null && row.rate !== '') item.rate = Number(row.rate);
    return item;
  }

  function toDb(row) {
    const n = normalize(row);
    if (!n) throw new Error('无效的还款记录');
    return {
      row_index: n.index,
      period: n.period,
      pay_date: n.date,
      total: n.total,
      principal: n.principal,
      interest: n.interest,
      penalty: n.penalty,
      rate: n.rate != null ? n.rate : null,
    };
  }

  function fromDb(row) {
    return normalize(row);
  }

  async function readError(res) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.error_description || body.hint || JSON.stringify(body);
    } catch {
      detail = res.statusText || '';
    }
    return `Supabase ${res.status}${detail ? '：' + detail : ''}`;
  }

  async function load() {
    if (!isConfigured()) throw new Error('未配置 Supabase');
    const res = await fetch(
      `${baseUrl()}/${TABLE}?select=*&order=row_index.desc`,
      { headers: headers() }
    );
    if (!res.ok) throw new Error(await readError(res));
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error('Supabase 返回格式异常');
    return rows.map(fromDb).filter(Boolean);
  }

  async function insert(row) {
    if (!isConfigured()) throw new Error('未配置 Supabase');
    const res = await fetch(`${baseUrl()}/${TABLE}`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(toDb(row)),
    });
    if (!res.ok) throw new Error(await readError(res));
  }

  async function update(row) {
    if (!isConfigured()) throw new Error('未配置 Supabase');
    const res = await fetch(
      `${baseUrl()}/${TABLE}?row_index=eq.${encodeURIComponent(row.index)}`,
      {
        method: 'PATCH',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify(toDb(row)),
      }
    );
    if (!res.ok) throw new Error(await readError(res));
  }

  async function remove(index) {
    if (!isConfigured()) throw new Error('未配置 Supabase');
    const res = await fetch(
      `${baseUrl()}/${TABLE}?row_index=eq.${encodeURIComponent(index)}`,
      {
        method: 'DELETE',
        headers: headers({ Prefer: 'return=minimal' }),
      }
    );
    if (!res.ok) throw new Error(await readError(res));
  }

  /** 整表覆盖：先清空再批量插入（首次导入 / 手动全量保存） */
  async function saveAll(rows) {
    if (!isConfigured()) throw new Error('未配置 Supabase');
    if (!Array.isArray(rows)) throw new Error('保存数据必须是数组');

    const del = await fetch(`${baseUrl()}/${TABLE}?row_index=gte.0`, {
      method: 'DELETE',
      headers: headers({ Prefer: 'return=minimal' }),
    });
    if (!del.ok) throw new Error(await readError(del));

    if (!rows.length) return;

    const chunkSize = 200;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize).map(toDb);
      const res = await fetch(`${baseUrl()}/${TABLE}`, {
        method: 'POST',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify(chunk),
      });
      if (!res.ok) throw new Error(await readError(res));
    }
  }

  global.GjjSupabase = {
    isConfigured,
    load,
    insert,
    update,
    remove,
    saveAll,
  };
})(typeof window !== 'undefined' ? window : globalThis);
