export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/kv";
import { getProducts, getBlogPosts, getSubmissions, getSubscribers } from "@/lib/kv";

const STATS_KEY = "page_visits";

export async function GET(request: NextRequest) {
  try {
    const [products, blogPosts, submissions, subscribers] = await Promise.all([
      getProducts(),
      getBlogPosts(),
      getSubmissions(),
      getSubscribers(),
    ]);

    // Get visit stats
    const store = getStore();
    const visits = (await store.get(STATS_KEY)) || { total: 0, today: 0, pages: {}, daily: {} };

    return NextResponse.json({
      products: Array.isArray(products) ? products.length : 0,
      blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
      messages: Array.isArray(submissions) ? submissions.length : 0,
      subscribers: Array.isArray(subscribers) ? subscribers.length : 0,
      visits: {
        total: visits.total || 0,
        today: visits.today || 0,
        pages: visits.pages || {},
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { products: 0, blogPosts: 0, messages: 0, subscribers: 0, visits: { total: 0, today: 0, pages: {} } },
      { status: 200 }
    );
  }
}

// Record a page visit
export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();
    const store = getStore();
    const visits = (await store.get(STATS_KEY)) || { total: 0, today: 0, pages: {}, daily: {} };

    const today = new Date().toISOString().split("T")[0];

    // Update total
    visits.total = (visits.total || 0) + 1;

    // Update today
    if (visits.currentDate !== today) {
      visits.today = 1;
      visits.currentDate = today;
    } else {
      visits.today = (visits.today || 0) + 1;
    }

    // Update per-page
    if (path) {
      if (!visits.pages) visits.pages = {};
      visits.pages[path] = (visits.pages[path] || 0) + 1;
    }

    // Update daily history
    if (!visits.daily) visits.daily = {};
    visits.daily[today] = (visits.daily[today] || 0) + 1;

    // Keep only last 30 days
    if (visits.daily) {
      const dates = Object.keys(visits.daily).sort().reverse();
      if (dates.length > 30) {
        const toRemove = dates.slice(30);
        toRemove.forEach(d => delete visits.daily[d]);
      }
    }

    await store.put(STATS_KEY, visits);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
