/* =====================================================
   アパレルマーケティング分析ツール - 共通JS
   デモ用モックデータとグラフ描画ロジック
   ===================================================== */

// --- 共通ユーティリティ -------------------------------------------
const MKT = {};

MKT.fmtYen = (n) => '¥' + Number(n).toLocaleString();
MKT.fmtNum = (n) => Number(n).toLocaleString();
MKT.fmtPct = (n) => Number(n).toFixed(1) + '%';

MKT.palette = {
    blue: '#2563eb',
    purple: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    amber: '#f59e0b',
    cyan: '#0891b2',
    pink: '#ec4899',
    slate: '#64748b',
    indigo: '#4f46e5',
    teal: '#14b8a6'
};

MKT.chartDefaults = () => {
    Chart.defaults.font.family = "'Inter', 'Noto Sans JP', sans-serif";
    Chart.defaults.color = '#475569';
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
};

MKT.gradient = (ctx, color) => {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, color + 'CC');
    g.addColorStop(1, color + '10');
    return g;
};

// 更新日時表示
MKT.setUpdateTime = () => {
    const el = document.getElementById('update-time');
    if (!el) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    el.textContent = `${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

// 日付ラベル生成
MKT.dateLabels = (days) => {
    const labels = [];
    const d = new Date('2026-04-01');
    for (let i = 0; i < days; i++) {
        const dt = new Date(d);
        dt.setDate(d.getDate() + i);
        labels.push(`${dt.getMonth()+1}/${dt.getDate()}`);
    }
    return labels;
};

// 乱数っぽい固定パターン生成（再現性のため）
MKT.seriesSeeded = (seed, length, base, amp) => {
    const arr = [];
    let s = seed;
    for (let i = 0; i < length; i++) {
        s = (s * 9301 + 49297) % 233280;
        const r = s / 233280;
        arr.push(Math.round(base + (r - 0.5) * amp + Math.sin(i / 3 + seed) * amp * 0.2));
    }
    return arr;
};

// =====================================================
// ページ1: 売上 / ユーザー特性
// =====================================================
MKT.initPage1 = function() {
    const labels = MKT.dateLabels(30);

    // 日別売上グラフ
    const salesCtx = document.getElementById('chart-daily-sales');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '今月売上',
                        data: MKT.seriesSeeded(4, 30, 1850000, 600000),
                        borderColor: MKT.palette.blue,
                        backgroundColor: MKT.gradient(salesCtx.getContext('2d'), MKT.palette.blue),
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 2
                    },
                    {
                        label: '前月売上',
                        data: MKT.seriesSeeded(8, 30, 1650000, 500000),
                        borderColor: MKT.palette.slate,
                        borderDash: [6, 4],
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: { callback: (v) => '¥' + (v/10000).toFixed(0) + '万' }
                    }
                }
            }
        });
    }

    // 男女比 ドーナツ
    const genderCtx = document.getElementById('chart-gender');
    if (genderCtx) {
        new Chart(genderCtx, {
            type: 'doughnut',
            data: {
                labels: ['女性', '男性', '未選択'],
                datasets: [{
                    data: [68, 28, 4],
                    backgroundColor: [MKT.palette.pink, MKT.palette.blue, MKT.palette.slate],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // 年齢分布
    const ageCtx = document.getElementById('chart-age');
    if (ageCtx) {
        new Chart(ageCtx, {
            type: 'bar',
            data: {
                labels: ['~19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50+'],
                datasets: [{
                    label: '購入ユーザー数',
                    data: [320, 1240, 2180, 2860, 2120, 1490, 820, 540],
                    backgroundColor: MKT.palette.purple,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // 都道府県割合（上位10）
    const prefCtx = document.getElementById('chart-pref');
    if (prefCtx) {
        new Chart(prefCtx, {
            type: 'bar',
            data: {
                labels: ['東京', '神奈川', '大阪', '愛知', '埼玉', '千葉', '兵庫', '福岡', '北海道', '京都'],
                datasets: [{
                    label: '構成比 (%)',
                    data: [22.4, 11.8, 9.6, 7.2, 6.8, 6.1, 4.9, 4.4, 3.6, 3.1],
                    backgroundColor: MKT.palette.indigo,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: { callback: (v) => v + '%' } } }
            }
        });
    }

    // プロパー/セール比率
    const priceCtx = document.getElementById('chart-price-ratio');
    if (priceCtx) {
        new Chart(priceCtx, {
            type: 'doughnut',
            data: {
                labels: ['プロパー購入', 'セール購入'],
                datasets: [{
                    data: [62, 38],
                    backgroundColor: [MKT.palette.blue, MKT.palette.amber],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // LTV推移
    const ltvCtx = document.getElementById('chart-ltv');
    if (ltvCtx) {
        new Chart(ltvCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '2026 LTV',
                        data: [18200, 19000, 19850, 20400, 21100, 21900, 22650, 23200, 24100, 24800, 25600, 26400],
                        borderColor: MKT.palette.green,
                        backgroundColor: MKT.gradient(ltvCtx.getContext('2d'), MKT.palette.green),
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: '2025 LTV',
                        data: [15400, 16100, 16900, 17500, 18200, 18700, 19300, 19900, 20400, 20900, 21500, 22100],
                        borderColor: MKT.palette.slate,
                        borderDash: [6, 4],
                        fill: false,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { ticks: { callback: (v) => '¥' + (v/1000).toFixed(0) + 'k' } }
                }
            }
        });
    }
};

// =====================================================
// ページ2: 全体施策 / セッション / UU / CVR
// =====================================================
MKT.initPage2 = function() {
    const labels = MKT.dateLabels(30);

    // 全体セッション (area)
    const sesCtx = document.getElementById('chart-sessions');
    if (sesCtx) {
        new Chart(sesCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '今月セッション',
                        data: MKT.seriesSeeded(12, 30, 48000, 14000),
                        borderColor: MKT.palette.blue,
                        backgroundColor: MKT.gradient(sesCtx.getContext('2d'), MKT.palette.blue),
                        fill: true, tension: 0.3, borderWidth: 2, pointRadius: 0
                    },
                    {
                        label: '前月セッション',
                        data: MKT.seriesSeeded(18, 30, 42000, 12000),
                        borderColor: MKT.palette.slate,
                        borderDash: [6, 4], fill: false, tension: 0.3, borderWidth: 2, pointRadius: 0
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 全体UU
    const uuCtx = document.getElementById('chart-uu');
    if (uuCtx) {
        new Chart(uuCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '新規UU',
                        data: MKT.seriesSeeded(22, 30, 8500, 3200),
                        borderColor: MKT.palette.purple,
                        backgroundColor: MKT.palette.purple + '22',
                        fill: true, tension: 0.3, borderWidth: 2, pointRadius: 0
                    },
                    {
                        label: 'リピートUU',
                        data: MKT.seriesSeeded(30, 30, 14200, 3800),
                        borderColor: MKT.palette.green,
                        backgroundColor: MKT.palette.green + '22',
                        fill: true, tension: 0.3, borderWidth: 2, pointRadius: 0
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 全体CVR
    const cvrCtx = document.getElementById('chart-cvr');
    if (cvrCtx) {
        new Chart(cvrCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'CVR (%)',
                        data: MKT.seriesSeeded(44, 30, 2.4, 1.2).map(v => Number((v).toFixed(2))),
                        borderColor: MKT.palette.amber,
                        backgroundColor: MKT.palette.amber + '22',
                        fill: true, tension: 0.3, borderWidth: 2, pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { ticks: { callback: (v) => v + '%' }, suggestedMin: 0 } }
            }
        });
    }

    // 媒体別セッション (stacked area)
    const msesCtx = document.getElementById('chart-media-sessions');
    if (msesCtx) {
        new Chart(msesCtx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: '自然検索', data: MKT.seriesSeeded(2, 30, 14000, 2800), backgroundColor: MKT.palette.blue },
                    { label: '広告', data: MKT.seriesSeeded(6, 30, 11000, 3200), backgroundColor: MKT.palette.purple },
                    { label: 'SNS', data: MKT.seriesSeeded(10, 30, 8800, 2600), backgroundColor: MKT.palette.green },
                    { label: 'CRM', data: MKT.seriesSeeded(14, 30, 6200, 1800), backgroundColor: MKT.palette.amber },
                    { label: 'リファラル', data: MKT.seriesSeeded(18, 30, 3400, 1200), backgroundColor: MKT.palette.cyan },
                    { label: '直接流入', data: MKT.seriesSeeded(22, 30, 4200, 1400), backgroundColor: MKT.palette.slate }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { x: { stacked: true }, y: { stacked: true } }
            }
        });
    }

    // 媒体別UU (doughnut)
    const muuCtx = document.getElementById('chart-media-uu');
    if (muuCtx) {
        new Chart(muuCtx, {
            type: 'doughnut',
            data: {
                labels: ['自然検索', '広告', 'SNS', 'CRM', 'リファラル', '直接流入'],
                datasets: [{
                    data: [28.4, 22.6, 18.2, 12.8, 8.4, 9.6],
                    backgroundColor: [
                        MKT.palette.blue, MKT.palette.purple, MKT.palette.green,
                        MKT.palette.amber, MKT.palette.cyan, MKT.palette.slate
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '55%',
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    // 媒体別CVR
    const mcvrCtx = document.getElementById('chart-media-cvr');
    if (mcvrCtx) {
        new Chart(mcvrCtx, {
            type: 'bar',
            data: {
                labels: ['自然検索', '広告', 'SNS', 'CRM', 'リファラル', '直接流入'],
                datasets: [
                    {
                        label: '今月CVR (%)',
                        data: [3.2, 2.1, 1.4, 5.8, 2.6, 4.2],
                        backgroundColor: MKT.palette.blue,
                        borderRadius: 6
                    },
                    {
                        label: '前月CVR (%)',
                        data: [3.0, 2.4, 1.2, 5.2, 2.2, 4.0],
                        backgroundColor: MKT.palette.slate,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { ticks: { callback: (v) => v + '%' } } }
            }
        });
    }
};

// =====================================================
// ページ3: 広告施策
// =====================================================
MKT.initPage3 = function() {
    const labels = MKT.dateLabels(30);
    const mediaColors = {
        'Google広告': MKT.palette.blue,
        'Yahoo!広告': MKT.palette.red,
        'Meta広告': MKT.palette.indigo,
        'LINE広告': MKT.palette.green,
        'Criteo': MKT.palette.amber,
        'TikTok Ads': MKT.palette.pink
    };

    // 広告媒体別セッション
    const ctx1 = document.getElementById('chart-ad-sessions');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels,
                datasets: Object.keys(mediaColors).map((k, i) => ({
                    label: k,
                    data: MKT.seriesSeeded(3 + i * 7, 30, 2200 + i * 300, 800),
                    borderColor: mediaColors[k],
                    backgroundColor: mediaColors[k] + '22',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }))
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 広告媒体別UU
    const ctx2 = document.getElementById('chart-ad-uu');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [
                    {
                        label: '今月UU',
                        data: [42500, 28400, 36200, 19800, 14600, 22400],
                        backgroundColor: MKT.palette.purple,
                        borderRadius: 6
                    },
                    {
                        label: '前月UU',
                        data: [38200, 26100, 30400, 18200, 15800, 18200],
                        backgroundColor: MKT.palette.slate,
                        borderRadius: 6
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 広告媒体別CVR
    const ctx3 = document.getElementById('chart-ad-cvr');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [{
                    label: 'CVR (%)',
                    data: [2.8, 2.1, 1.9, 2.6, 3.4, 1.3],
                    backgroundColor: Object.values(mediaColors),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { ticks: { callback: (v) => v + '%' } } }
            }
        });
    }
};

// =====================================================
// ページ4: SNS施策
// =====================================================
MKT.initPage4 = function() {
    const labels = MKT.dateLabels(30);
    const mediaColors = {
        'Instagram': '#e1306c',
        'X (Twitter)': '#1da1f2',
        'TikTok': '#000000',
        'YouTube': '#ff0000',
        'LINE公式': '#06c755',
        'Pinterest': '#e60023'
    };

    const ctx1 = document.getElementById('chart-sns-sessions');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels,
                datasets: Object.keys(mediaColors).map((k, i) => ({
                    label: k,
                    data: MKT.seriesSeeded(5 + i * 9, 30, 1800 + i * 200, 700),
                    borderColor: mediaColors[k],
                    backgroundColor: mediaColors[k] + '22',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }))
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const ctx2 = document.getElementById('chart-sns-uu');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [
                    {
                        label: '今月UU',
                        data: [48200, 22400, 38600, 14800, 31200, 8400],
                        backgroundColor: Object.values(mediaColors),
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const ctx3 = document.getElementById('chart-sns-cvr');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [
                    { label: '今月CVR (%)', data: [1.8, 0.9, 2.2, 1.4, 4.6, 1.1], backgroundColor: MKT.palette.green, borderRadius: 6 },
                    { label: '前月CVR (%)', data: [1.6, 1.1, 1.8, 1.2, 4.2, 1.0], backgroundColor: MKT.palette.slate, borderRadius: 6 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { ticks: { callback: (v) => v + '%' } } }
            }
        });
    }
};

// =====================================================
// ページ5: CRM (メルマガ / LINE / プッシュ)
// =====================================================
MKT.initPage5 = function() {
    const labels = MKT.dateLabels(30);
    const mediaColors = {
        'メルマガ': MKT.palette.amber,
        'LINE公式': '#06c755',
        'アプリプッシュ': MKT.palette.purple,
        'Webプッシュ': MKT.palette.cyan,
        'SMS': MKT.palette.red
    };

    const ctx1 = document.getElementById('chart-crm-sessions');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels,
                datasets: Object.keys(mediaColors).map((k, i) => ({
                    label: k,
                    data: MKT.seriesSeeded(7 + i * 11, 30, 2400 + i * 250, 900),
                    borderColor: mediaColors[k],
                    backgroundColor: mediaColors[k] + '22',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }))
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const ctx2 = document.getElementById('chart-crm-uu');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [
                    { label: '開封/クリックUU', data: [52400, 68200, 44800, 18600, 12400], backgroundColor: Object.values(mediaColors), borderRadius: 6 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const ctx3 = document.getElementById('chart-crm-cvr');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: Object.keys(mediaColors),
                datasets: [
                    { label: '今月CVR (%)', data: [6.4, 8.2, 5.1, 3.2, 2.4], backgroundColor: MKT.palette.amber, borderRadius: 6 },
                    { label: '前月CVR (%)', data: [5.8, 7.6, 4.8, 2.9, 2.6], backgroundColor: MKT.palette.slate, borderRadius: 6 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { ticks: { callback: (v) => v + '%' } } }
            }
        });
    }
};

// --- 初期化 ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    MKT.chartDefaults();
    MKT.setUpdateTime();
    const page = document.body.getAttribute('data-mkt-page');
    if (page === '1') MKT.initPage1();
    else if (page === '2') MKT.initPage2();
    else if (page === '3') MKT.initPage3();
    else if (page === '4') MKT.initPage4();
    else if (page === '5') MKT.initPage5();
});
