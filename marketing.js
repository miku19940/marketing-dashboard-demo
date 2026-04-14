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

    // 日別売上 棒グラフ
    const salesCtx = document.getElementById('chart-daily-sales');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: '今月売上',
                        data: MKT.seriesSeeded(4, 30, 1850000, 600000),
                        backgroundColor: MKT.palette.blue,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: '前月売上',
                        data: MKT.seriesSeeded(8, 30, 1650000, 500000),
                        backgroundColor: MKT.palette.slate + '88',
                        borderRadius: 4,
                        borderSkipped: false
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
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + MKT.fmtYen(ctx.raw)
                        }
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

    // 日別 購入金額構成 (プロパー / セール) 積み上げ棒
    const priceDailyCtx = document.getElementById('chart-price-daily');
    if (priceDailyCtx) {
        const dailyLabels = MKT.dateLabels(30);
        const properData = MKT.seriesSeeded(55, 30, 1150000, 420000);
        const saleData = MKT.seriesSeeded(78, 30, 700000, 320000);
        new Chart(priceDailyCtx, {
            type: 'bar',
            data: {
                labels: dailyLabels,
                datasets: [
                    {
                        label: 'プロパー購入',
                        data: properData,
                        backgroundColor: MKT.palette.blue,
                        borderRadius: 3,
                        borderSkipped: false
                    },
                    {
                        label: 'セール購入',
                        data: saleData,
                        backgroundColor: MKT.palette.amber,
                        borderRadius: 3,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        ticks: { callback: (v) => '¥' + (v/10000).toFixed(0) + '万' }
                    }
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + MKT.fmtYen(ctx.raw)
                        }
                    }
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
                        fill: true, tension: 0.3, borderWidth: 2,
                        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: MKT.palette.blue
                    },
                    {
                        label: '前月セッション',
                        data: MKT.seriesSeeded(18, 30, 42000, 12000),
                        borderColor: MKT.palette.slate,
                        borderDash: [6, 4], fill: false, tension: 0.3, borderWidth: 2,
                        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: MKT.palette.slate
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + MKT.fmtNum(ctx.raw) + ' セッション'
                        }
                    }
                }
            }
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
                        fill: true, tension: 0.3, borderWidth: 2,
                        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: MKT.palette.purple
                    },
                    {
                        label: 'リピートUU',
                        data: MKT.seriesSeeded(30, 30, 14200, 3800),
                        borderColor: MKT.palette.green,
                        backgroundColor: MKT.palette.green + '22',
                        fill: true, tension: 0.3, borderWidth: 2,
                        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: MKT.palette.green
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + MKT.fmtNum(ctx.raw) + ' UU'
                        }
                    }
                }
            }
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
                        label: 'CVR',
                        data: MKT.seriesSeeded(44, 30, 2.4, 1.2).map(v => Number((v).toFixed(2))),
                        borderColor: MKT.palette.amber,
                        backgroundColor: MKT.palette.amber + '22',
                        fill: true, tension: 0.3, borderWidth: 2,
                        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: MKT.palette.amber
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                scales: { y: { ticks: { callback: (v) => v + '%' }, suggestedMin: 0 } },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + ctx.raw.toFixed(2) + '%'
                        }
                    }
                }
            }
        });
    }

    // 媒体別UU構成比 (doughnut)
    const muuCtx = document.getElementById('chart-media-uu');
    if (muuCtx) {
        new Chart(muuCtx, {
            type: 'doughnut',
            data: {
                labels: ['自然検索', '広告', 'SNS', 'CRM', '直接流入', 'リファラル'],
                datasets: [{
                    data: [28.4, 22.6, 18.2, 12.8, 9.6, 8.4],
                    backgroundColor: [
                        MKT.palette.blue, MKT.palette.purple, MKT.palette.green,
                        MKT.palette.amber, MKT.palette.slate, MKT.palette.cyan
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.label + ': ' + ctx.parsed.toFixed(1) + '%'
                        }
                    }
                }
            }
        });
    }
};

// =====================================================
// ページ3: 広告施策 (グラフは削除済み。数値テーブルのみ)
// =====================================================
MKT.initPage3 = function() {};

// =====================================================
// ページ4: SNS施策 (グラフは削除済み。数値テーブルのみ)
// =====================================================
MKT.initPage4 = function() {};

// =====================================================
// ページ5: CRM (グラフは削除済み。数値テーブルのみ)
// =====================================================
MKT.initPage5 = function() {};

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
