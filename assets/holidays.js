/**
 * 2026 年国务院放假安排（法定节假日 + 调休补班）
 */
(function (global) {
  const OFF = "off";
  const WORK = "work";

  /** @type {Record<string, { type: 'off'|'work', name: string }>} */
  const map = Object.create(null);

  function range(start, end, name, type) {
    const [ys, ms, ds] = start.split("-").map(Number);
    const [ye, me, de] = end.split("-").map(Number);
    const cur = new Date(ys, ms - 1, ds);
    const last = new Date(ye, me - 1, de);
    while (cur <= last) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      map[`${y}-${m}-${d}`] = { type, name };
      cur.setDate(cur.getDate() + 1);
    }
  }

  function day(key, name, type) {
    map[key] = { type, name };
  }

  // 元旦
  range("2026-01-01", "2026-01-03", "元旦", OFF);
  day("2026-01-04", "补班", WORK);

  // 春节
  range("2026-02-15", "2026-02-23", "春节", OFF);
  day("2026-02-14", "补班", WORK);
  day("2026-02-28", "补班", WORK);

  // 清明
  range("2026-04-04", "2026-04-06", "清明", OFF);

  // 劳动节
  range("2026-05-01", "2026-05-05", "劳动", OFF);
  day("2026-05-09", "补班", WORK);

  // 端午
  range("2026-06-19", "2026-06-21", "端午", OFF);

  // 中秋（国庆调休补班落在 9/20）
  range("2026-09-25", "2026-09-27", "中秋", OFF);
  day("2026-09-20", "补班", WORK);

  // 国庆
  range("2026-10-01", "2026-10-07", "国庆", OFF);
  day("2026-10-10", "补班", WORK);

  const LIST = [
    { name: "元旦", off: "1/1–1/3", work: "1/4 补班" },
    { name: "春节", off: "2/15–2/23", work: "2/14、2/28 补班" },
    { name: "清明", off: "4/4–4/6", work: "无" },
    { name: "劳动节", off: "5/1–5/5", work: "5/9 补班" },
    { name: "端午", off: "6/19–6/21", work: "无" },
    { name: "中秋", off: "9/25–9/27", work: "无" },
    { name: "国庆", off: "10/1–10/7", work: "9/20、10/10 补班" },
  ];

  function get(dateKey) {
    return map[dateKey] || null;
  }

  global.HolidayCalendar = { get, LIST, YEAR: 2026 };
})(typeof window !== "undefined" ? window : globalThis);
