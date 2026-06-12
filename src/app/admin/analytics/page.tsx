"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp, Calendar, Globe, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";

interface StatsData {
  products: number;
  blogPosts: number;
  messages: number;
  subscribers: number;
  visits: {
    total: number;
    today: number;
    pages: Record<string, number>;
    daily?: Record<string, number>;
  };
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;
  }

  const visits = stats?.visits || { total: 0, today: 0, pages: {}, daily: {} };
  const topPages = Object.entries(visits.pages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  // Daily trend data
  const dailyData = visits.daily || {};
  const dailyEntries = Object.entries(dailyData).sort(([a], [b]) => a.localeCompare(b));
  const maxDaily = Math.max(...dailyEntries.map(([, v]) => v), 1);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">流量统计</h1>
          <p className="mt-1 text-sm text-text-muted">网站访问量、页面热度等数据分析</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="btn-outline inline-flex items-center gap-2 text-sm">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "刷新中..." : "刷新数据"}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">总访问量</p>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <Eye size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{visits.total.toLocaleString()}</p>
          <p className="mt-1 text-xs text-text-muted">累计所有页面访问</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">今日访问</p>
            <div className="rounded-lg bg-green-100 p-2 text-green-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{visits.today.toLocaleString()}</p>
          <p className="mt-1 text-xs text-text-muted">
            {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">产品总数</p>
            <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
              <Globe size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{stats?.products || 0}</p>
          <p className="mt-1 text-xs text-text-muted">已上架产品</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">订阅用户</p>
            <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
              <Calendar size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{stats?.subscribers || 0}</p>
          <p className="mt-1 text-xs text-text-muted">邮件订阅用户</p>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="mb-8 rounded-xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-primary mb-4">近30天访问趋势</h2>
        {dailyEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <TrendingUp size={40} className="mb-2 opacity-30" />
            <p className="text-sm">暂无每日访问数据</p>
            <p className="text-xs mt-1">有用户访问后会自动记录</p>
          </div>
        ) : (
          <div className="relative">
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-40">
              {dailyEntries.map(([date, count]) => {
                const height = (count / maxDaily) * 100;
                const isToday = date === new Date().toISOString().split("T")[0];
                return (
                  <div key={date} className="flex-1 flex flex-col items-center group relative">
                    <div
                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer ${
                        isToday ? "bg-primary" : "bg-primary/40"
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${date}: ${count} 次访问`}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {date}: {count} 次
                    </div>
                    {/* Date label (show every few) */}
                    {dailyEntries.length <= 15 || dailyEntries.indexOf([date, count]) % 5 === 0 || isToday ? (
                      <span className={`text-[10px] mt-1 ${isToday ? "text-primary font-bold" : "text-text-muted"}`}>
                        {date.slice(5)}
                      </span>
                    ) : (
                      <span className="text-[10px] mt-1 text-transparent">-</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
              <span>{dailyEntries[0]?.[0] || "-"}</span>
              <span className="text-primary font-medium">今日</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Pages */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-base font-semibold text-primary mb-4">热门页面排行</h2>
          {topPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
              <Eye size={40} className="mb-2 opacity-30" />
              <p className="text-sm">暂无页面访问数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPages.map(([path, count], i) => {
                const total = visits.total || 1;
                const percentage = ((count / total) * 100).toFixed(1);
                const maxCount = topPages[0]?.[1] || 1;
                const barWidth = (count / maxCount) * 100;

                return (
                  <div key={path}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? "bg-yellow-100 text-yellow-700" :
                          i === 1 ? "bg-gray-100 text-gray-600" :
                          i === 2 ? "bg-orange-100 text-orange-700" :
                          "bg-gray-50 text-gray-400"
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-text truncate" title={path}>{path}</span>
                      </div>
                      <span className="text-sm font-medium text-primary shrink-0 ml-2">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          i === 0 ? "bg-yellow-400" :
                          i === 1 ? "bg-gray-400" :
                          i === 2 ? "bg-orange-400" :
                          "bg-primary/30"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">占比 {percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-base font-semibold text-primary mb-4">数据概览</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-text-muted">总访问量</span>
              <span className="text-lg font-bold text-primary">{visits.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-text-muted">今日访问</span>
              <span className="text-lg font-bold text-green-600">{visits.today.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-text-muted">页面数量</span>
              <span className="text-lg font-bold text-primary">{Object.keys(visits.pages || {}).length}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-text-muted">有数据天数</span>
              <span className="text-lg font-bold text-primary">{Object.keys(visits.daily || {}).length} 天</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">平均每日</span>
              <span className="text-lg font-bold text-primary">
                {dailyEntries.length > 0
                  ? Math.round(visits.total / dailyEntries.length).toLocaleString()
                  : 0}
              </span>
            </div>
          </div>

          {/* Quick tips */}
          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h3 className="text-sm font-medium text-blue-700 mb-1">统计说明</h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>每次页面加载自动记录一次访问</li>
              <li>数据存储在 KV 中，部署后持续累积</li>
              <li>每日访问趋势保留最近 30 天</li>
              <li>页面排行显示访问量最高的页面</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
