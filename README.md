# 📰 NewsletterForge MCP — Newsletter Growth, Positioning, Sponsorships, Paid Subscriptions & Monetization Engine

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![Smithery](https://img.shields.io/badge/Smithery-Live-brightgreen)](https://smithery.ai)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Your newsletter has 847 subscribers after a year. Growth is flat, opens are sliding, you have no idea whether to sell sponsorships or launch a paid tier, and every Sunday night is a panic about what to write.** NewsletterForge is an autonomous newsletter-business MCP server that turns AI agents into newsletter operators — positioning that fills niches instead of shrugging at them, content engines that ship every week, growth machines across organic/SEO/referrals/paid, and honest monetization through sponsorships, paid subscriptions and your own products.

> **Reader-first, by design.** No clickbait debt, no bought lists, no hidden unsubscribe links, no smuggled ads. The inbox is rented attention — the writer who respects it compounds for a decade.

## 🛠️ Tools

| Tool | What It Does |
|------|-------------|
| `newsletter.architect` | **Master 1-shot engine** — ingests your situation and synthesizes the complete architecture: stage diagnosis (idea → first 1k → scaling → monetizing), business-model physics (audience-for-business vs sponsorship media vs paid subscriptions), platform stack (beehiiv/Substack/Kit/Ghost), and the 90-day roadmap |
| `newsletter.positioning` | Niche positioning & the promise formula, issue format architecture, voice & writing craft, and the production system — calibrated for weekly flagship, twice-weekly, or daily brief cadences |
| `newsletter.growth` | Organic social engines, SEO & evergreen discovery, referral programs & cross-promos, and paid acquisition economics — calibrated for 0→1k, 1k→10k, or 10k+ scale |
| `newsletter.monetization` | Sponsorship pricing & pipelines, paid subscription tiers, own-products funnels, and the diversified portfolio strategy — calibrated to list size |
| `newsletter.retention` | Welcome sequences, re-engagement & list hygiene, the analytics that matter (cohort retention, revenue per subscriber), and the ops stack — calibrated for solo creators to media teams |

## ⚡ Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, Cline…):

```json
{
  "mcpServers": {
    "newsletterforge": {
      "url": "https://newsletterforge-api.agentweb-hub.workers.dev/mcp"
    }
  }
}
```

Or via Smithery: search **newsletterforge-mcp**.

## 🔴 NEW in v1.1 — Live Tool: `newsletter.audit_feed_live`

Fetches any RSS/Atom feed live (with autodiscovery) and audits the REAL publishing data: item count, actual cadence computed from real timestamps, freshness, and full-content vs excerpt detection.

No API key needed — works out of the box.

## 💰 Pricing

**Start free — 10 requests/day, no signup, no card.**

| Plan | Price | What You Get |
|------|-------|--------------|
| Free | $0 | 10 requests/day, all 5 tools |
| Pro (NewsletterForge only) | **$7.99** lifetime | Unlimited requests |
| All-Access Suite | **$14.99** lifetime | Unlocks **all 57 MCP servers** in the AgentWeb hub |

### 💳 Pay with Card / PayPal (Gumroad)
👉 **[Get Pro Access — amygraphics.gumroad.com/l/mcp-pro](https://amygraphics.gumroad.com/l/mcp-pro)**

### ◎ Pay with Solana (USDC)
Send to this wallet, then POST your tx signature to `/verify-solana`:

```
8sDLX3okSV974wdjdeKhN9uWLZDr45DeGCJ28zgTLEdJ
```

## 🌐 Explore the Full Hub

**57 autonomous MCP servers** — SEO, lead gen, email deliverability, local SEO, customer support, B2B sales, community building, hiring, newsletters & more:
👉 **[mcp-hub.agentweb-hub.workers.dev](https://mcp-hub.agentweb-hub.workers.dev)** · [NewsletterForge page](https://mcp-hub.agentweb-hub.workers.dev/mcp/newsletterforge)

## 📄 License

MIT — see [LICENSE](LICENSE).
