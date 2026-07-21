/**
 * 每期还款总额走势折线图配置
 * 依赖：由页面传入 colors / rateAxis / rateSeries / rateLegend / fmtRate
 */
(function (global) {
  function buildLineChartOption({
    data,
    labels,
    colors,
    rateAxis,
    rateSeries,
    rateLegend,
    fmtRate,
    getRate,
    grid,
    axisFont,
    confine,
  }) {
    const lineRates = data.map((d) => getRate(d));

    return {
      color: [colors.total, colors.principal, colors.interest, colors.rate],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        confine: !!confine,
        formatter(params) {
          const i = params[0].dataIndex;
          let html = `${params[0].axisValue}（${data[i].date}）<br/>`;
          for (const p of params) {
            if (p.seriesName === '利率') {
              html += `${p.marker}${p.seriesName}：${fmtRate(p.value)}<br/>`;
            } else {
              html += `${p.marker}${p.seriesName}：${Number(p.value).toFixed(2)}<br/>`;
            }
          }
          return html;
        },
      },
      legend: { ...rateLegend, data: ['总额', '本金', '利息', '利率'] },
      grid: grid || { left: 56, right: 56, top: 40, bottom: 48 },
      dataZoom: [{ type: 'inside', start: 0, end: 100 }],
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLabel: { rotate: 40, fontSize: axisFont || 11 },
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: { fontSize: axisFont || 11 },
          splitLine: { lineStyle: { type: 'dashed', color: '#d8e0ea' } },
        },
        rateAxis,
      ],
      series: [
        {
          name: '总额',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2.5 },
          data: data.map((d) => d.total),
        },
        {
          name: '本金',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1.5 },
          data: data.map((d) => d.principal),
        },
        {
          name: '利息',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1.5 },
          data: data.map((d) => d.interest),
        },
        rateSeries(lineRates),
      ],
    };
  }

  global.GjjCharts = global.GjjCharts || {};
  global.GjjCharts.buildLineChartOption = buildLineChartOption;
})(typeof window !== 'undefined' ? window : globalThis);
