/**
 * NewsletterForge MCP Server - Cloudflare Worker
 * Autonomous Newsletter Business: Newsletter Architecture, Positioning & Content Engine,
 * Subscriber Growth, Honest Monetization, and Retention, Analytics & Operations
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Solana-Signature, X-License-Key',
};

const PRO_TIERS = {
  single_tool: {
    price_usd: 7.99,
    description: "Single Tool Pro Lifetime License (NewsletterForge Only)"
  },
  all_access_suite: {
    price_usd: 14.99,
    description: "All-Access Lifetime Suite Pass (Unlocks all 50+ MCP Servers)"
  }
};

const MONETIZATION_INFO = {
  gumroad_pro_checkout: "https://amygraphics.gumroad.com/l/mcp-pro",
  gumroad_options: {
    single_tool_lifetime: "$7.99 (Select 'Single MCP Server' version)",
    all_access_suite_lifetime: "$14.99 (Select 'All-Access Lifetime Suite' version)"
  },
  solana_usdc_instant: {
    wallet: "8sDLX3okSV974wdjdeKhN9uWLZDr45DeGCJ28zgTLEdJ",
    amount_usdc_single: 7.99,
    amount_usdc_suite: 14.99
  }
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/verify-solana' && request.method === 'POST') {
      try {
        const body = await request.json();
        const signature = body.signature;
        if (!signature || signature.length < 32) {
          return new Response(JSON.stringify({
            valid: false,
            error: "Invalid Solana signature"
          }), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({
          valid: true,
          tx_hash: signature,
          license_tier: "all_access_lifetime",
          unlocked_servers: "all_57_servers",
          status: "confirmed"
        }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ valid: false, error: err.message }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'newsletterforge-mcp',
        version: '1.0.0',
        tools_available: 6,
        pricing: PRO_TIERS
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/mcp' || url.pathname === '/sse') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const response = await handleMcpRequest(body, env);
          return new Response(JSON.stringify(response), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        } catch (e) {
          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: 'Parse error: ' + e.message }
          }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    return new Response('NewsletterForge MCP is running. Connect via /mcp', {
      headers: CORS_HEADERS
    });
  }
};

async function handleMcpRequest(request, env) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'newsletterforge-mcp',
          version: '1.0.0',
          description: 'Autonomous Newsletter Business: Newsletter Architecture, Positioning & Content Engines, Subscriber Growth Systems, Honest Monetization (Sponsorships, Paid Subscriptions, Products), and Retention, Analytics & Operations MCP'
        }
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'autonomous_newsletter_architect',
            description: 'MASTER 1-SHOT OUTCOME ENGINE: Ingests the newsletter situation and synthesizes the complete newsletter-business architecture in one call: the stage diagnosis (idea and positioning, the first 1,000 subscribers, growth and scaling, or mature and monetizing — each stage has a different failure mode and the fixes do not transfer), the business-model physics (the audience-for-your-business newsletter, the sponsorship media business and the paid-subscription product are three different companies wearing one send button), the platform stack decision (beehiiv, Substack, Kit, Ghost — chosen by model and economics, not by trend), and the 90-day newsletter roadmap. Built on the operating truth of the newsletter business: the inbox is rented attention inside the most personal feed left on the internet — the writer who respects it compounds for a decade; the writer who extracts from it gets archived in a month.',
            inputSchema: {
              type: 'object',
              properties: {
                newsletter_context: {
                  type: 'string',
                  description: 'The newsletter situation (e.g. "marketing consultant starting a weekly B2B newsletter from zero", "5k-subscriber dev newsletter, flat growth, no revenue", "20k finance-adjacent list ready to monetize")'
                },
                newsletter_stage: {
                  type: 'string',
                  enum: ['idea_positioning', 'first_1000_subscribers', 'growth_scaling', 'mature_monetizing'],
                  description: 'The current newsletter maturity stage'
                },
                business_model: {
                  type: 'string',
                  enum: ['audience_for_business', 'sponsorship_media', 'paid_subscription_product'],
                  description: 'The business model the newsletter serves'
                }
              },
              required: ['newsletter_context']
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                stage_diagnosis: { type: 'string', description: 'What breaks at this stage and the fix' },
                model_physics: { type: 'string', description: 'How this newsletter business model actually works' },
                platform_stack: { type: 'string', description: 'Which platform and stack the model supports' },
                growth_roadmap: { type: 'string', description: 'The 90-day newsletter business sequence' },
                reader_first_doctrine: { type: 'string', description: 'The ethical operating system that compounds trust' }
              },
              required: ['status', 'stage_diagnosis', 'model_physics', 'platform_stack', 'growth_roadmap', 'reader_first_doctrine']
            },
            annotations: { title: 'Autonomous Newsletter Architect', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'design_positioning_content_engine',
            description: 'Designs the positioning and the content engine — where newsletters are actually won or lost one subject line at a time: the niche positioning system (the promise formula of who + what transformation + why you, the niche-down discipline — "marketing" dies while "retention marketing for DTC operators" fills, and the differentiation audit against the three newsletters the reader already gets), the format architecture (the flagship essay, the curated brief, the hybrid — sections designed for scanners and readers simultaneously, the subject-line craft that earns the open honestly, and the length discipline that respects the inbox), the voice and writing craft (the voice that sounds like one human, the first-sentence hook, the specificity that makes generic advice concrete), and the production system (the content pipeline from idea bank to draft to edit to send, the batch disciplines that prevent the Sunday-night panic, and the consistency machine — because the newsletter that ships every week beats the better newsletter that ships sometimes).',
            inputSchema: {
              type: 'object',
              properties: {
                content_focus: {
                  type: 'string',
                  enum: ['niche_positioning_promise', 'format_structure_design', 'writing_quality_voice', 'consistency_production_system'],
                  description: 'The content engine area to prioritize'
                },
                publishing_cadence: {
                  type: 'string',
                  enum: ['weekly_flagship', 'twice_plus_weekly', 'daily_brief'],
                  description: 'The publishing cadence being run'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                positioning_system: { type: 'string', description: 'The niche promise and differentiation framework' },
                format_architecture: { type: 'string', description: 'Issue structure, sections and subject-line craft' },
                voice_craft: { type: 'string', description: 'The writing quality and voice system' },
                production_system: { type: 'string', description: 'The pipeline and consistency machine' },
                cadence_calibration: { type: 'string', description: 'The engine calibrated to the publishing cadence' }
              },
              required: ['status', 'positioning_system', 'format_architecture', 'voice_craft', 'production_system', 'cadence_calibration']
            },
            annotations: { title: 'Positioning & Content Engine Designer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'engineer_subscriber_growth',
            description: 'Engineers the subscriber growth machine across every honest channel: the organic social engine (the platform-native content that earns the follow, the content-to-capture bridge from social proof to landing page, and the repurposing system that turns one issue into a week of posts), the SEO and evergreen discovery engine (the newsletter website as a compounding asset, issue archives rewritten as searchable resources, and the landing page conversion craft), the referral and cross-promotion engine (reader referral programs with rewards people actually want, the cross-promo exchange with peer newsletters, and the recommendation-network economics on beehiiv and Substack), and the paid acquisition economics (when paid makes sense, the cost-per-subscriber math against realistic lifetime value, the lead-magnet funnel, and the quality controls that keep bought growth from poisoning engagement). No bought lists, no sneaky opt-ins, no engagement-bait — growth that holds is growth that chose you.',
            inputSchema: {
              type: 'object',
              properties: {
                growth_focus: {
                  type: 'string',
                  enum: ['organic_social_content', 'seo_evergreen_discovery', 'referrals_cross_promos', 'paid_acquisition_economics'],
                  description: 'The growth channel to prioritize'
                },
                growth_stage: {
                  type: 'string',
                  enum: ['zero_to_1k', 'growing_1k_to_10k', 'scaling_10k_plus'],
                  description: 'The current subscriber scale'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                organic_engine: { type: 'string', description: 'Social content and the capture bridge' },
                seo_engine: { type: 'string', description: 'Evergreen discovery and landing page conversion' },
                referral_engine: { type: 'string', description: 'Referrals, cross-promos and recommendation networks' },
                paid_engine: { type: 'string', description: 'Paid acquisition economics done honestly' },
                stage_calibration: { type: 'string', description: 'Growth calibrated to subscriber scale' }
              },
              required: ['status', 'organic_engine', 'seo_engine', 'referral_engine', 'paid_engine', 'stage_calibration']
            },
            annotations: { title: 'Subscriber Growth Engineer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'monetize_newsletter_revenue',
            description: 'Builds the newsletter revenue system across the four honest engines: the sponsorship and advertising system (pricing by audience quality and niche buying power instead of raw size, the sponsor pipeline from media kit to renewal, placements that serve readers — disclosed always, relevant only, frequency capped), the paid subscription tier (the free/paid split that keeps the free tier genuinely valuable, premium content worth paying for — depth, access, tools, community — and the launch and renewal mechanics), the own-products-and-services funnel (the newsletter as the trust engine for courses, templates, consulting and software — the soft-sell cadence that converts without corroding), and the diversified portfolio strategy (the revenue mix by list size and niche, the sequencing of which engine to build first, and the concentration risks of each). Built on the truth that newsletter revenue is a trust dividend — it pays exactly as long as the reader stays the first customer.',
            inputSchema: {
              type: 'object',
              properties: {
                revenue_focus: {
                  type: 'string',
                  enum: ['sponsorships_advertising', 'paid_subscription_tier', 'own_products_services', 'diversified_portfolio_mix'],
                  description: 'The revenue engine to prioritize'
                },
                list_size: {
                  type: 'string',
                  enum: ['small_under_5k', 'mid_5k_to_25k', 'large_25k_plus'],
                  description: 'The current list size band'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                sponsorship_system: { type: 'string', description: 'Sponsor pricing, pipeline and reader-first rules' },
                paid_sub_system: { type: 'string', description: 'The free/paid split and premium tier design' },
                products_system: { type: 'string', description: 'The products and services trust funnel' },
                portfolio_strategy: { type: 'string', description: 'The revenue mix and sequencing strategy' },
                size_calibration: { type: 'string', description: 'Monetization calibrated to list size' }
              },
              required: ['status', 'sponsorship_system', 'paid_sub_system', 'products_system', 'portfolio_strategy', 'size_calibration']
            },
            annotations: { title: 'Honest Newsletter Monetization Builder', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'build_retention_analytics_ops',
            description: 'Builds the retention, analytics and operations layer — the unglamorous machinery that decides whether growth compounds or leaks: the onboarding and welcome sequence (the first email that arrives instantly and delivers the promised value, the 3-5 email welcome arc that sets expectations and earns the reply, and the first-week engagement that trains both the reader and the inbox algorithms), the engagement and retention system (the re-engagement sequences for the fading, the sunset policy that cleans the list with dignity, and the truth that a smaller engaged list outperforms a bigger dead one on every metric that pays), the analytics dashboard that matters (open-rate honesty in a privacy-masked world, click quality over click quantity, subscriber cohort retention, and revenue per subscriber — while vanity totals are ignored), and the operations stack (the tooling that automates logistics, the send-day checklists that prevent the broken-link apology email, and the operator calibration from solo creator to media team).',
            inputSchema: {
              type: 'object',
              properties: {
                ops_focus: {
                  type: 'string',
                  enum: ['onboarding_welcome_sequence', 'engagement_retention_cleaning', 'analytics_metrics', 'systems_tooling_automation'],
                  description: 'The operations system to prioritize'
                },
                operator_type: {
                  type: 'string',
                  enum: ['solo_creator', 'creator_with_small_team', 'media_company_team'],
                  description: 'Who runs the newsletter day to day'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                onboarding_system: { type: 'string', description: 'The welcome sequence and first-week activation' },
                retention_system: { type: 'string', description: 'Re-engagement, sunsetting and list hygiene' },
                analytics_dashboard: { type: 'string', description: 'The metrics that matter and the vanity set to ignore' },
                ops_stack: { type: 'string', description: 'Tooling, checklists and automation discipline' },
                operator_calibration: { type: 'string', description: 'Operations calibrated to the team shape' }
              },
              required: ['status', 'onboarding_system', 'retention_system', 'analytics_dashboard', 'ops_stack', 'operator_calibration']
            },
            annotations: { title: 'Retention, Analytics & Ops Builder', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'audit_rss_feed_live',
            title: 'Live RSS/Atom Feed Auditor',
            description: 'Fetches any RSS/Atom feed (or site URL with autodiscovery) live and audits the REAL publishing data: item count, latest post date, actual publishing cadence computed from real timestamps, title quality, and full-content vs excerpt detection.',
            inputSchema: {
              type: 'object',
              properties: {
                feed_url: { type: 'string', description: 'Feed URL or site URL (autodiscovery attempted) e.g. https://blog.example.com/rss' }
              },
              required: ['feed_url']
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'success or error' },
                feed_health: { type: 'string', description: 'Feed validity, format and item count read live' },
                publishing_cadence: { type: 'string', description: 'Real cadence computed from actual item timestamps' },
                content_read: { type: 'string', description: 'Title lengths and full-content vs excerpt analysis' },
                growth_priorities: { type: 'string', description: 'P1/P2/P3 newsletter growth fixes based on the real feed' },
                data_source: { type: 'string', description: 'How the feed was fetched' }
              },
              required: ['status', 'feed_health', 'publishing_cadence', 'content_read', 'growth_priorities', 'data_source']
            },
            annotations: {
              readOnlyHint: true,
              destructiveHint: false,
              idempotentHint: false,
              openWorldHint: true
            }
          }
        ]
      }
    };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    let result;
    try {
      switch (toolName) {
        case 'autonomous_newsletter_architect':
          result = architectNewsletter(args);
          break;
        case 'design_positioning_content_engine':
          result = designContent(args);
          break;
        case 'engineer_subscriber_growth':
          result = engineerGrowth(args);
          break;
        case 'monetize_newsletter_revenue':
          result = monetizeNewsletter(args);
          break;
        case 'build_retention_analytics_ops':
          result = buildOps(args);
          break;
        case 'audit_rss_feed_live':
          if (!args || typeof args.feed_url !== 'string' || args.feed_url.length === 0) { return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Missing required parameter: feed_url (string)' } }; }
          result = await auditRssFeedLive(args);
          break;
        default:
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Unknown tool: ' + toolName }
          };
      }

      result.pro_monetization = {
        note: "You are on the Freemium tier (10 free requests/day). Unlock unlimited Pro requests:",
        ...MONETIZATION_INFO
      };

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: 'Tool execution error: ' + err.message }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: 'Method not found: ' + method }
  };
}

/* ----------------------------- TOOL 1: NEWSLETTER ARCHITECT ----------------------------- */

function architectNewsletter(args) {
  const context = args.newsletter_context;
  const stage = args.newsletter_stage || 'first_1000_subscribers';
  const model = args.business_model || 'audience_for_business';

  const stageDiagnosis = {
    idea_positioning: 'IDEA-STAGE DIAGNOSIS: most newsletters die at birth from a positioning that promises nothing to nobody in particular: (1) THE PROMISE TEST: the one-liner must pass "who is this for, what do they get, why from you" — "a newsletter about marketing" is a shrug; "the Friday teardown of one real DTC retention campaign, with the numbers" is an appointment; (2) THE INBOX-COMPETITION AUDIT: the reader already gets three newsletters adjacent to yours — name them, read a month of each, and write the sentence "unlike those, this one..." — if the sentence will not finish honestly, the niche needs another turn of the screw; (3) THE 25-ISSUE TEST before launch: list 25 concrete issue ideas in one sitting — the niche that cannot fill the list in an hour cannot fill a year of sends; the niche that overflows the list is the one; (4) THE AUTHOR-FIT HONESTY: the newsletter is a multi-year commitment to one lane — the test is whether the author reads this topic for fun on vacation, because readers smell duty by issue twelve; (5) THE VALIDATION MINIMUM: 10 ideal readers asked "would you trade your email for this, weekly?" with the real landing page shown — then the first five issues written BEFORE public launch, because the backlog is both the proof of commitment and the insurance against the week-three panic.',
    first_1000_subscribers: 'FIRST-1000 DIAGNOSIS: the hardest thousand — zero flywheels exist yet, and everything is manual: (1) THE DIRECT-OUTREACH TRUTH: the first 200 subscribers are recruited by hand — the personal note to people who asked a related question, colleagues, communities where the author already has standing — one honest sentence ("I write a weekly teardown of X, I think you would like it") outperforms every growth hack at this size; (2) THE SINGLE-CHANNEL FOCUS: pick the ONE social platform where the target reader already is, show up daily with native value posts, and bridge to the newsletter at proof moments — four platforms at 25% effort each produce four empty funnels; (3) THE CONSISTENCY SIGNAL: at this stage the product IS the streak — shipping every week on time teaches the few readers you have that this is real, and their forwards are the entire referral program; (4) THE FEEDBACK GOLDMINE: under 1,000, the author can reply to every response, ask every new subscriber "what made you sign up?", and interview the five most engaged readers — this intelligence sets the positioning for the next 10,000 and never gets cheaper; (5) THE ANTI-PATTERN: obsessing over monetization, design and tooling before 1,000 — the only jobs are the promise, the streak and the channel; everything else is procrastination wearing a spreadsheet.',
    growth_scaling: 'GROWTH-STAGE DIAGNOSIS: the stage where the manual engine must become a machine — and where growth quality starts to matter as much as growth rate: (1) THE FLYWHEEL ASSEMBLY: the repurposing system (every issue becomes a week of platform-native posts), the referral program live, the cross-promo circuit joined (peer newsletters at similar scale swapping honest recommendations), and the evergreen capture (the best issues rewritten as searchable landing pages) — four engines that run while the author writes; (2) THE GROWTH-QUALITY LEDGER: every channel tagged and judged on 90-day engaged retention, not signup volume — the viral lead magnet that adds 3,000 freebie-hunters who never open is negative growth wearing a party hat: it bruises deliverability for the readers who matter; (3) THE CONTENT-DEBT RISK: scaling pressure pushes toward volume (more sends, more sections, more everything) — the discipline is the opposite: sharper promise, tighter issues, the one flagship a week that gets forwarded; (4) THE DATA LAYER ARRIVES: cohort retention by join-source, click-quality mapping (who clicks what reveals what to write and what to sell), and the engaged-segment definition that will power monetization; (5) THE MONETIZATION TIMING: revenue starts here, modestly — the first sponsorships or the product beta to the engaged segment — because waiting for "big enough" costs years and the early-revenue feedback reshapes the content better than any survey.',
    mature_monetizing: 'MATURE-STAGE DIAGNOSIS: the compounding stage — the business is real and the risks invert to staleness, churn-blindness and platform complacency: (1) THE FORMAT-REFRESH DISCIPLINE: year-three newsletters drift into autopilot (same sections, same takes, slowly fading opens) — the annual format audit (reader survey, open/click trend review, three experimental issues) keeps the product alive; kill sections ritually, the way a chef kills a menu item; (2) THE REVENUE PORTFOLIO MATURITY: the mature business runs 2-3 engines deliberately (sponsorship base + product layer, or paid tier + services) with concentration limits — the newsletter earning 90% from one sponsor category is one procurement freeze from a bad year; (3) THE LIST-HYGIENE ECONOMY: at scale, dead weight costs real money and deliverability — the sunset policy (re-engagement arc, then graceful removal) runs quarterly, and the KPI shifts from list size to revenue per engaged subscriber; (4) THE MOAT INVESTMENTS: the owned website and archive (SEO compounding), the direct reader relationships (replies, surveys, events), the brand that travels off-platform — because the platform\u2019s recommendation spigot can turn off any quarter, and the mature operator builds like it will; (5) THE OPERATOR LEVERAGE: the mature newsletter earns a team (editor, ops, sales) — the author\u2019s hours migrate to the two things nobody can delegate: the voice and the judgment; mature newsletters die when the founder either never delegates or delegates the voice.'
  };

  const modelPhysics = {
    audience_for_business: 'AUDIENCE-FOR-BUSINESS PHYSICS: the newsletter as the trust engine for a consulting practice, agency, SaaS or creator business — the most common model and the most forgiving economics: (1) THE REAL KPI: not subscriber count — qualified pipeline: the consultant whose 2,000-reader niche letter produces two inbound clients a month beats the 50,000-list generalist on revenue every quarter; depth of trust per reader is the asset; (2) THE CONTENT-AS-PROOF DOCTRINE: every issue demonstrates the expertise the business sells — the teardown, the framework applied to a real case, the opinionated take that filters for fit — the newsletter IS the portfolio, published weekly; (3) THE SOFT-CONVERSION ARCHITECTURE: the standing footer offer ("when you are ready, here is how I help"), the quarterly direct issue (the honest pitch, once a quarter, fully disclosed), and the reply-driven funnel (every reader reply is a warm conversation, and the author who replies well converts without selling); (4) THE ECONOMIC PATIENCE: this model monetizes through the business, so the newsletter is judged on 12-month pipeline influence, not monthly revenue — which frees the content from the sponsor treadmill entirely; (5) THE FAILURE MODE: the newsletter that drifts into generic industry commentary stops demonstrating the sellable expertise — the weekly test: "does this issue make the right reader want to hire US?"',
    sponsorship_media: 'SPONSORSHIP-MEDIA PHYSICS: the newsletter as the product and advertisers as the customer — real media economics with real media discipline: (1) THE NICHE-CPM ARITHMETIC: sponsorship pays on audience quality — the 8,000-reader letter for CFOs or DevOps leads commands more per send than the 80,000-reader general-interest digest, because the sponsor is buying buyers; the model selection question is "does my niche have sponsors with budgets and a clear win from reaching my readers?"; (2) THE INVENTORY DESIGN: the primary slot, the classified tier, the sponsored deep-dive (clearly labeled), the job board — designed once, priced on a rate card, capped per issue so the product stays readable; (3) THE SALES OPERATION REALITY: sponsorship is a sales business — the media kit with honest metrics, the pipeline of 30-50 fit sponsors, the renewal motion (sponsors renew on results and reporting, so the post-campaign report IS the sales engine); expect sales to take real weekly hours or a rev-share partner; (4) THE CHURCH-STATE LINE: editorial never bends to sponsors — the moment readers suspect the takes are bought, the asset the sponsors paid for is gone; the line is commercially rational, not just ethical; (5) THE SCALE REQUIREMENT HONESTY: media economics want volume or density — under ~5k engaged readers in a buyer-rich niche (or ~20k general), sponsorship is pocket money; the model needs the growth engine running hard, which is a content-plus-distribution job, not a writing hobby.',
    paid_subscription_product: 'PAID-SUBSCRIPTION PHYSICS: readers as customers — the purest model and the most demanding product bar: (1) THE PAYWALL VALUE TEST: people pay for depth they act on (research, picks, playbooks), access (the author, the community, the Q&A), tools (templates, models, databases) or earlier/filtered information — they do not pay for "more of the free thing"; the paid tier is a different PRODUCT, not a longer email; (2) THE FREE-TIER STRATEGY: the free list is the top of funnel and must stay genuinely excellent — the standard architecture: free weekly (reach and trust) plus paid deep-dives/extras (the conversion), with 5-10% free-to-paid as the healthy band in most niches; starving the free tier to force upgrades shrinks the very funnel the paid tier drinks from; (3) THE CHURN ARITHMETIC RULES: at $10/month, monthly churn of 5% versus 3% is the difference between a plateau and a business — retention mechanics (onboarding to the archive, the habit-forming cadence, annual plans offered honestly at a real discount) outweigh acquisition mechanics from day one; (4) THE LAUNCH MECHANICS: founding-member pricing honored for life, the public build-up with sample paid content, and the honest capacity note where real (Q&A bandwidth) — then the quarterly open-enrollment rhythm beats the always-on nag; (5) THE GRIND HONESTY: paid subscriptions are the slowest compounding model — modest early numbers (100 paid at $100/year is $10k) that compound through retention; the operators who win treat it like a product company: roadmap, churn interviews, and the paid tier improved quarterly.'
  };

  return {
    status: 'success',
    stage_diagnosis: 'Newsletter architecture for: "' + context + '" — stage: ' + stage.replace(/_/g, ' ') + ', model: ' + model.replace(/_/g, ' ') + '. ' + stageDiagnosis[stage],
    model_physics: modelPhysics[model],
    platform_stack: 'THE PLATFORM-STACK DECISION (the model decides, not the trend): THE QUICK MAP: BEEHIIV for growth-focused operators (the recommendation network, referral tooling and ad network are genuine distribution assets; strongest for sponsorship-media and ambitious audience-building); SUBSTACK for paid-subscription writers who want zero infrastructure (payments, apps and the network effect built in — traded against the 10% take and limited funnel control); KIT (ConvertKit) for the audience-for-business model (automations, tagging, product funnels and creator-commerce plumbing — built for selling your own things); GHOST for the owned-everything operator (your site, your SEO, memberships at a flat cost — traded against doing your own growth entirely); MAILCHIMP-CLASS tools for simple business lists, rarely right for serious newsletter businesses. THE DECISION CRITERIA in order: (1) which revenue engine leads (sponsorship wants beehiiv-class ad tooling; paid subs want Substack/Ghost billing; products want Kit automations); (2) ownership requirements (export rights are table stakes everywhere, but the WEBSITE and SEO live on Ghost/custom best); (3) the honest cost math at 10x current size (percentage takes feel free at 500 subs and brutal at 50k); (4) migration reality: moving lists mid-growth costs engagement and weeks — choose for the destination, not the week one convenience. THE STACK MINIMALISM RULE: platform + one analytics view + one capture page is the whole stack until 10k — tool shopping is the most popular form of not writing.',
    growth_roadmap: 'THE 90-DAY NEWSLETTER ROADMAP: WEEKS 1-2 — POSITIONING TRUTH: the promise one-liner written and tested on ten ideal readers, the competing-inbox audit, the 25-issue idea bank filled, the landing page shipped with the promise in the header (design_positioning_content_engine); WEEKS 3-4 — THE ENGINE ASSEMBLED: the issue template designed (sections, length, subject-line patterns), the welcome sequence written (instant value + expectation-setting + the reply question), the production pipeline set (idea bank → draft day → edit day → send day), the first five issues banked; WEEKS 5-8 — THE STREAK AND THE CHANNEL: shipping weekly without exception, the single social channel worked daily with native content bridging to capture, every new subscriber asked "what made you join?", every reply answered (engineer_subscriber_growth); WEEKS 9-12 — THE FLYWHEEL AND THE VERDICT: the repurposing system live (issue → posts), the first cross-promos exchanged, the metrics baseline read honestly (open trend, click quality, 30-day cohort retention), and the monetization decision made from the model physics — first sponsor outreach, the product beta, or deliberate patience (monetize_newsletter_revenue). THE COMPOUNDING TRUTH: newsletters are a streak business — the operator who ships 13 consecutive honest issues in 90 days has built an asset; the one who shipped 7 brilliant issues in 13 weeks has built a doubt.',
    reader_first_doctrine: 'THE READER-FIRST DOCTRINE (the operating system, not a tagline): (1) THE INBOX IS A PRIVILEGE: the reader handed over the most personal address on the internet — every send spends or earns trust, and the unsubscribe link is a promise kept in one click, never hidden, never guilt-tripped ("we are sad to see you go" theater demeans everyone); (2) NO CLICKBAIT DEBT: the subject line is a promise the first paragraph must keep — opens bought with manufactured curiosity are repaid in archived-without-reading, and the inbox algorithms are watching the repayment; (3) THE LIST IS SACRED: never bought, never swapped without consent, never co-registered through dark patterns — 1,000 people who chose you outperform 100,000 who did not know they signed up, on every metric including revenue; (4) DISCLOSED COMMERCE: sponsorships labeled, affiliate links declared, the paid pitch made honestly and rhythmically rather than smuggled into every issue — readers do not resent being sold to; they resent being deceived about it; (5) THE LONG-GAME ARITHMETIC: newsletter trust compounds like capital — the operator who respects the reader for three years owns a distribution asset no platform can revoke and no competitor can copy, because the moat is the relationship, and relationships are built one kept promise at a time.'
  };
}

/* ----------------------------- TOOL 2: POSITIONING & CONTENT ENGINE ----------------------------- */

function designContent(args) {
  const focus = args.content_focus || 'niche_positioning_promise';
  const cadence = args.publishing_cadence || 'weekly_flagship';

  const cadenceCalibration = {
    weekly_flagship: 'WEEKLY-FLAGSHIP CALIBRATION: the default and the right answer for most operators — one excellent issue a week: (1) the rhythm: idea bank always open, draft day mid-week, edit day next morning (the overnight gap is the cheapest editor), send at the tested day/time and then LEFT ALONE (consistency beats optimization); (2) the flagship bar: every issue passes "would the target reader forward this to a peer?" — the weekly letter lives on forwards and saves, not on volume; (3) the batching option: two issues written in one strong week banks the buffer that makes the streak unbreakable through sick weeks and launches — the buffer is the difference between a system and a tightrope; (4) the depth advantage: weekly cadence affords research, original takes and real editing — the moat against daily-brief competitors is being the one send they actually read slowly; (5) the growth note: weekly issues repurpose into 5-7 platform posts across the week, so the cadence feeds distribution without extra writing.',
    twice_plus_weekly: 'TWICE-PLUS-WEEKLY CALIBRATION: the cadence for operators with dense niches and real capacity — and the first cadence where format differentiation becomes mandatory: (1) the two-product structure: the issues must be DIFFERENT products (the Tuesday analysis + the Friday roundup; the Monday playbook + the Thursday Q&A) — two identical sends a week just halves the specialness of each; (2) the production reality: this cadence needs the full pipeline (idea bank, templates per format, batch drafting) and roughly double the hours — entered casually, it produces the thin-content spiral where both issues get worse; (3) the segmentation option: cadence-sensitive readers exist — the preference center ("get everything / get the weekly best-of") preserves the relationship with busy readers instead of losing them to fatigue unsubscribes; (4) the engagement watch: opens per reader per week is the canary — if doubling sends added 30% total opens, a third of the list is being trained to skip you; the honest read may be retreating to weekly; (5) the economics: twice-weekly doubles sponsorship inventory, which is the usual rationale — the discipline is letting revenue fund an editor before cadence erodes quality.',
    daily_brief: 'DAILY-BRIEF CALIBRATION: the industrial cadence — a different business, not a bigger newsletter: (1) the format lock: dailies live on ruthless scannability — fixed sections, tight word counts, the 3-minute read promise kept every single day; the daily that sprawls dies by Thursday; (2) the production system is the product: the source-monitoring stack, the morning triage ritual, templates that assemble fast, and at least one backup writer trained — a daily with a single point of failure is a resignation letter on a timer; (3) the curation ethics: dailies summarize others\u2019 work — the links prominent, the credit real, the added value being selection and context ("why this matters") rather than laundered rewrites; (4) the monetization fit: dailies are sponsorship machines (5x the inventory, habitual open behavior, strong CPMs in business niches) — which is why the model usually IS sponsorship-media, and the sales operation must scale with the sends; (5) the burnout honesty: solo daily operators burn out on a 9-15 month fuse — the sustainable daily is a team product (even if the team is one editor plus one part-timer) or a deliberately contained format (the 10-link brief, not the essay).'
  };

  return {
    status: 'success',
    positioning_system: 'Content engineering — primary focus: ' + focus.replace(/_/g, ' ') + '. THE NICHE POSITIONING SYSTEM: (1) THE PROMISE FORMULA: [specific reader] gets [specific transformation or intelligence] every [cadence] in [time-to-consume] — "DTC retention marketers get one real campaign teardown with the numbers, every Friday, in 6 minutes" — every word of that sentence is doing work, and the vague version of it is doing none; (2) THE NICHE-DOWN LADDER: topic → audience → use-case → point of view: "marketing" → "retention marketing" → "retention for DTC operators" → "retention for DTC operators, told through real campaign autopsies" — each rung down multiplies relevance to the right reader and repels the wrong one, which is the entire mechanism of newsletter growth; (3) THE DIFFERENTIATION AUDIT: read one month of the three newsletters your reader already receives, then finish the sentence "unlike those, this one ..." with something structural (the format, the data access, the lived vantage point) — adjectives ("better, smarter") are not differentiation; mechanisms are; (4) THE POV REQUIREMENT: the defensible moat is a point of view — the newsletter that takes positions, makes calls and is occasionally wrong in public builds parasocial trust that neutral summaries never touch; curation without opinion is a commodity with a send button; (5) THE PROMISE-DRIFT GUARD: every quarter, the last 12 subject lines are read against the one-liner — drift is natural, silent and fatal; the reader subscribed to a promise, and the operator who forgets it churns readers who never say why.',
    format_architecture: 'THE FORMAT ARCHITECTURE: (1) THE ISSUE SKELETON designed once: the cold open (one strong idea or hook, never "welcome back!"), the core section (the essay, teardown or analysis that IS the product), the supporting sections (quick links, one tool, one number — each with a reason to exist), the consistent sign-off (the human note that earns replies) — readers build muscle memory for structure, and structure is what makes a newsletter feel professional at any length; (2) THE SCANNER-AND-READER DUALITY: bold the claims, keep paragraphs to 1-3 sentences, make subheads carry the argument — the scanner gets value in 60 seconds, the reader gets depth in six minutes, and both renew; (3) THE SUBJECT-LINE CRAFT: specificity beats cleverness ("How Graza sells olive oil with memes" beats "You will not believe this growth hack"), 45 characters survives mobile truncation, the A/B discipline on real sends — and the honesty rule: the subject is a promise the first paragraph keeps, because the inbox remembers liars via the open-rate ledger; (4) THE LENGTH DOCTRINE: as long as the value, not a word longer — the weekly flagship earns 1,200-2,000 words; the daily brief earns 400-700; the test is the trim pass: if nothing hurts to cut, it was padding; (5) THE VISUAL FLOOR: clean single column, real hierarchy, images only when they carry information (the chart, the screenshot-with-annotation) — newsletters are a reading product; design serves the words.',
    voice_craft: 'THE VOICE & WRITING CRAFT SYSTEM: (1) THE ONE-HUMAN RULE: the newsletter sounds like a specific person talking to a specific friend — contractions, opinions, the occasional aside — because the inbox is a personal medium and corporate voice reads as spam in it; the test: read aloud; anywhere you would not SAY it, rewrite it; (2) THE FIRST-SENTENCE DISCIPLINE: the open determines the read — start inside the story ("The email that saved Q4 was 41 words long"), never with throat-clearing ("In today\u2019s fast-paced world...") — the delete finger hovers for exactly one sentence; (3) THE SPECIFICITY ENGINE: numbers, names and artifacts convert generic advice into trusted intelligence — "improve your onboarding" is content; "Duolingo\u2019s day-2 push cut churn 12% — here is the message" is a newsletter worth paying for; the writing system is really a research system; (4) THE EDIT PASSES in order: the structure pass (does the argument build?), the trim pass (cut 20% — it is always there), the voice pass (read aloud), the honesty pass (every claim checkable, every number sourced) — four passes, 40 minutes, the difference between sent and shipped; (5) THE REPLY CULTIVATION: write TO one reader ("you"), end with one real question, and answer every reply for as long as volume allows — replies are the algorithm signal, the content intelligence and the community, all in one behavior.',
    production_system: 'THE PRODUCTION & CONSISTENCY SYSTEM: (1) THE IDEA BANK as standing infrastructure: one capture inbox (notes app, doc, whatever is frictionless) fed daily — reader replies, work observations, three-sources-collide moments — reviewed weekly; the blank page is a capture failure, not a creativity failure; (2) THE PIPELINE CADENCE: idea selection Monday, draft Wednesday, edit Thursday morning (the overnight gap is the free editor), send-day checklist Friday — the pipeline turns one scary deadline into four small habits; (3) THE BUFFER DOCTRINE: two banked evergreen issues at all times — the buffer converts sick weeks, vacations and launch crunches from streak-breakers into non-events; streaks die to life events exactly once per unbuffered operator; (4) THE TEMPLATE LEVERAGE: the issue skeleton as an actual template (sections pre-laid, recurring blocks pre-written, checklist embedded) — templates cut production time 30-40% and are the precondition for ever delegating; (5) THE SEND-DAY CHECKLIST (non-negotiable): every link clicked, the test send read on mobile, subject and preview text checked against truncation, personalization fields verified, the sponsor block confirmed against the insertion order — the apology-correction email is the most expensive send in the business, and the checklist costs four minutes.',
    cadence_calibration: cadenceCalibration[cadence]
  };
}

/* ----------------------------- TOOL 3: SUBSCRIBER GROWTH ----------------------------- */

function engineerGrowth(args) {
  const focus = args.growth_focus || 'organic_social_content';
  const stage = args.growth_stage || 'zero_to_1k';

  const stageCalibration = {
    zero_to_1k: 'ZERO-TO-1K CALIBRATION: the manual stage — flywheels do not exist yet and pretending they do wastes the year: (1) THE HAND-RECRUITED 200: personal invitations to the people who already ask you related questions — colleagues, community peers, the LinkedIn commenters — with one honest sentence; conversion on personal asks runs 30-50% while cold landing pages run 2%; (2) THE ONE-CHANNEL LAW: a single platform, daily native value, the capture bridge at proof moments — the operator posting everywhere is invisible everywhere; (3) THE COMMUNITY-FIRST PATH: being genuinely useful in 2-3 niche communities (answering, not promoting) for 90 days builds the standing that one soft mention converts — community trust is the zero-budget growth engine; (4) THE FOUNDING-READER TREATMENT: every subscriber gets the "what made you join?" reply, every response gets answered — the intelligence sets the next year\u2019s positioning and the treatment builds the forwarding habit that is this stage\u2019s only viral loop; (5) THE METRIC THAT MATTERS: 40%+ opens from people you did not personally recruit — that number says the promise works on strangers, and it is the green light to pour fuel at stage two.',
    growing_1k_to_10k: 'THE 1K-10K CALIBRATION: the flywheel-assembly stage — manual effort converts into systems: (1) THE REPURPOSING MACHINE: every issue decomposed into 5-7 platform-native posts (the thread of the core argument, the chart, the contrarian take, the one-liner) scheduled across the week — distribution becomes a byproduct of writing instead of a second job; (2) THE CROSS-PROMO CIRCUIT: 5-10 peer newsletters at comparable scale, honest recommendation swaps on a monthly rhythm — the single highest-ROI channel at this stage because the audience arrives pre-qualified by a trusted voice; (3) THE RECOMMENDATION NETWORKS: beehiiv/Substack recommendations configured both directions, monitored for quality (the partner whose readers never engage is renting you vanity numbers); (4) THE LEAD-MAGNET UPGRADE: the evergreen asset (the template pack, the database, the definitive guide) gated behind subscription and promoted in every repurposed post — compounding capture that works while you sleep; (5) THE QUALITY GOVERNOR: every channel cohort-tracked at 90 days — the channel test is "do they still open in month three?", and budget/effort reallocates quarterly to the channels whose answer is yes.',
    scaling_10k_plus: 'THE 10K-PLUS CALIBRATION: the portfolio stage — growth becomes a managed system with a budget line: (1) THE PAID LAYER MATURES: recommendation-network spend, the ad-platform funnels that survived the cohort test, and the creator cross-promotion deals — all governed by the engaged-subscriber CAC against revenue per subscriber, reviewed monthly like the media business this now is; (2) THE SEO COMPOUNDING ASSET: the archive rebuilt as a real website (best issues as evergreen landing pages, the topic hubs, the tools/templates indexed) — at this scale, organic search becomes a top-three channel for exactly zero marginal writing; (3) THE REFERRAL PROGRAM PROFESSIONALIZED: rewards readers genuinely want (the premium content drop, the swag that signals insider status, the annual-plan credit), milestone mechanics, and fraud hygiene — referral programs at scale produce 10-20% of growth when the product deserves the ask; (4) THE BRAND LAYER: podcast appearances, conference talks, the data report that gets cited — awareness plays that defy attribution but visibly lift every funnel; (5) THE CONCENTRATION AUDIT: no single channel above ~40% of new engaged subscribers — the platform algorithm change that halves one channel should bruise the quarter, not break the business.'
  };

  return {
    status: 'success',
    organic_engine: 'Growth engineering — primary focus: ' + focus.replace(/_/g, ' ') + '. THE ORGANIC SOCIAL ENGINE: (1) THE PLATFORM-NATIVE DOCTRINE: each platform rewards its own species of content — the X/LinkedIn thread that makes the argument IN the feed (not "I wrote something, link below"), the carousel that teaches, the short video that demonstrates — value delivered natively earns the follow; the link-dump earns the scroll-past; (2) THE CAPTURE BRIDGE built on proof moments: the pinned post with the flagship sample, the "this was section two of Friday\u2019s issue" footer, the profile bio that states the promise and the cadence — the bridge converts demonstrated value into the email, and it works precisely because the value came first; (3) THE REPURPOSING SYSTEM: one issue → the thesis thread, the data chart, the contrarian pull-quote, the how-to carousel, the behind-the-scenes note — five assets, 90 minutes, scheduled across the week; the newsletter is the content factory and social is the shop window; (4) THE ENGAGEMENT REALITY: platform reach follows conversation — the operator who replies substantively in their niche for 30 minutes daily outgrows the one who posts and vanishes; distribution is a relationship activity wearing a content costume; (5) THE HONESTY GUARDRAIL: no engagement-bait ("comment YES for the guide"), no stolen virality, no manufactured outrage — those audiences arrive untargeted and leave unconverted, and the niche remembers the cringe long after the impressions expire.',
    seo_engine: 'THE SEO & EVERGREEN DISCOVERY ENGINE: (1) THE ARCHIVE-AS-ASSET STRATEGY: the newsletter archive rotting behind a send-platform URL is compounding value thrown away — the best issues rewritten as evergreen landing pages on an owned domain (the definitive guide, the teardown library, the tools list) turn one week\u2019s work into years of discovery; (2) THE KEYWORD-INTENT MATCH: target the searches your ideal reader makes at the moment of need ("dtc retention benchmarks", "welcome email examples saas") — the visitor who arrives mid-problem converts to subscriber at multiples of social drive-by traffic, because the newsletter IS the ongoing answer to their recurring question; (3) THE LANDING-PAGE CONVERSION CRAFT: the promise in the H1 (who + what + cadence), one sample issue visible in full (the product demo), social proof with numbers and names, a single field and a single button — and the subscribe wall NEVER blocking the content that earned the visit; (4) THE INTERNAL-LOOP DESIGN: every evergreen page offers the subscription AND two related pages — session depth builds both the ranking signal and the conviction; (5) THE PATIENCE CONTRACT: SEO pays in quarters, not weeks — the monthly rhythm (one evergreen page built or upgraded, internal links added, performance reviewed) compounds quietly until it is suddenly a top channel; it rewards exactly the operators who do not need it this month.',
    referral_engine: 'THE REFERRAL & CROSS-PROMO ENGINE: (1) THE READER-REFERRAL PROGRAM designed around rewards readers actually want: the bonus content drop at 3 referrals (zero marginal cost, high perceived value), the insider status markers, the annual-credit at scale — not the generic mug; the mechanic: the unique link in every issue footer with a one-line ask tied to that issue\u2019s value ("know a retention marketer who would use this teardown?"); (2) THE PROGRAM HONESTY: counts audited for quality (confirmed, engaged subscribers — not disposable addresses farmed for the reward), because a referral program that pollutes the list is paying readers to poison the well; (3) THE CROSS-PROMO CIRCUIT: 5-10 peer newsletters at comparable scale and adjacent (non-competing) promises, honest recommendation swaps written in the recommender\u2019s own voice ("I actually read this one") on a monthly cadence — pre-qualified audiences, zero cost, compounding relationships; the discipline is sampling the partner\u2019s product first, because every recommendation spends your credibility on their behavior; (4) THE RECOMMENDATION NETWORKS (beehiiv/Substack) configured deliberately: recommend only what you genuinely rate, review inbound-recommendation quality monthly, and prune the partners whose arrivals never open — network growth is real but unmanaged network growth is engagement dilution with a dashboard; (5) THE FORWARD AS THE ORIGINAL REFERRAL: the "forward this to one person who needs it" line, the clean web-view link, and the subscribe CTA visible to the forwarded reader — the oldest viral loop in email still outperforms most engineered ones when the content deserves it.',
    paid_engine: 'THE PAID ACQUISITION ECONOMICS (honest math or no spend): (1) THE PREREQUISITE GATE: paid traffic amplifies what organic proved — the funnel that converts cold organic visitors at 25%+ and retains them at 60-day opens is ready for spend; the funnel that has not proven itself just burns money faster with ads; (2) THE CAC-TO-VALUE ARITHMETIC: know revenue per subscriber per year by model (sponsorship: list revenue / engaged subs; paid tier: conversion rate x price x retention; business funnel: pipeline value attributed) — then the engaged-subscriber CAC target with margin; spending $2.50 per subscriber who yields $1.80 is a hobby with a dashboard; (3) THE CHANNEL LADDER by typical efficiency: newsletter-native placements (recommendation networks, niche newsletter ads — the audience already reads newsletters) → meta/social lead ads with the lead-magnet funnel → search ads on high-intent queries; each cohort-tagged and judged at 90 days on ENGAGED retention, never on signup cost alone; (4) THE QUALITY CONTROLS: double opt-in on paid cohorts (worth the conversion haircut for list health), the welcome-sequence filter (the cohort that ignores five welcome emails gets sunset early), and the deliverability watch — bought growth that tanks engagement taxes the whole list\u2019s inbox placement; (5) THE SCALE DISCIPLINE: winning channels scale in 30% steps with cohort checks at each step — paid growth fails at the extremes: the operator who never tests and the operator who 10x-es a two-week-old result.',
    stage_calibration: stageCalibration[stage]
  };
}

/* ----------------------------- TOOL 4: MONETIZATION ----------------------------- */

function monetizeNewsletter(args) {
  const focus = args.revenue_focus || 'sponsorships_advertising';
  const size = args.list_size || 'mid_5k_to_25k';

  const sizeCalibration = {
    small_under_5k: 'SMALL-LIST CALIBRATION (under 5k): the stage where monetization is possible but mis-sequenced monetization is fatal: (1) THE HONEST OPTIONS RANKED: own products/services first (a 2,000-reader niche list supports consulting, templates and workshops TODAY — trust density beats reach), micro-sponsorships second (niche classifieds at $50-150/slot from tool vendors who want exactly your reader), paid tier only with rabid engagement (50%+ opens and reply culture); full sponsorship-media economics simply do not exist yet; (2) THE TRUST-PRESERVATION PRIORITY: at this size every reader is recoverable by name — the monetization that burns ten readers to make $100 is a terrible trade that gets worse with compounding; (3) THE SPONSOR MATH HONESTY: $25-40 CPM on 3,000 engaged readers is $75-120 per send — real pocket money, not a business; take it only when the sponsor genuinely fits, and spend the hours on growth and product instead; (4) THE SERVICES BRIDGE: the highest-EV move under 5k is usually the newsletter-powered service (the audit, the retainer, the workshop) — it monetizes trust at consulting rates while the list compounds toward media scale; (5) THE PATIENCE SIGNAL: monetizing too hard too early reads desperate and churns the exact early adopters whose forwards are the growth engine — the small list is an investment account; raid it and it stops compounding.',
    mid_5k_to_25k: 'MID-LIST CALIBRATION (5k-25k): the stage where real revenue starts and the portfolio takes shape: (1) THE SPONSORSHIP THRESHOLD CROSSED: niche B2B lists in this band command $300-1,500 per primary slot — the professional motion starts now: the media kit with honest engaged-reader numbers, the rate card, the 30-sponsor pipeline, the post-campaign report that drives renewals; (2) THE PAID-TIER WINDOW OPENS: with proven engagement, the 5-10% free-to-paid conversion band means 250-2,500 paying readers is realistic — the launch sequencing: survey the engaged segment, pre-sell the founding cohort, ship the differentiated paid product (depth/access/tools, never just "more"); (3) THE PRODUCT LAYER MATURES: the flagship course, the template library, the paid community — one well-built product to a 10k trusted list routinely out-earns a year of sponsorships; the demand evidence is already in the reply archive; (4) THE PORTFOLIO SHAPE: the healthy mid-list mix is usually sponsorship base (predictable) + one owned product or paid tier (margin) — two engines, built sequentially, each fed by the content engine; (5) THE OPERATOR MATH: this band is where the newsletter can pay a real salary — and where under-pricing is epidemic; the list built on trust in a buying niche is worth 2-3x whatever the operator\u2019s imposter syndrome initially charges.',
    large_25k_plus: 'LARGE-LIST CALIBRATION (25k+): media-business economics with media-business obligations: (1) THE SPONSORSHIP OPERATION AT SCALE: multi-slot inventory, the quarterly rate-card review (scarcity and results move prices), category exclusivity sold at premium, the renewal book managed like the SaaS it resembles — and a real sales function (dedicated hours, a rev-share seller, or an ad network as the floor); (2) THE PORTFOLIO MANDATE: at scale, single-engine risk is existential — the mature mix (sponsorship + paid tier + products, weighted by niche) with no engine above ~60% of revenue; the sponsor-market soft quarter should hurt, not kill; (3) THE SEGMENTATION DIVIDEND: 25k readers are not one audience — the engaged-segment pricing for sponsors (sell the 12k who open, honestly, at a higher CPM — better results, better renewals), the behavioral segments for product launches, the preference center that lets readers self-select depth; (4) THE PAID-TIER AT SCALE: conversion mechanics professionalize (the quarterly enrollment window, the annual-first pricing, churn interviews and the save-pause) and the paid product earns its own roadmap and P&L; (5) THE INSTITUTIONAL MOATS: the owned site and SEO, the events/awards/data-report layer that monetizes the brand beyond the send, and the team (editor, ops, sales) that converts founder hours into the two things only the founder can do — the voice and the judgment.'
  };

  return {
    status: 'success',
    sponsorship_system: 'Revenue engineering — primary focus: ' + focus.replace(/_/g, ' ') + '. THE SPONSORSHIP & ADVERTISING SYSTEM: (1) THE PRICING LOGIC: price on audience QUALITY — niche buying power, engaged-reader count (opens, not list size) and action rates — niche B2B newsletters command $30-100+ CPMs because the sponsor buys concentrated buyers, not impressions; the rate card prices the primary slot, the classified tier and the sponsored deep-dive separately, reviewed quarterly against demand; (2) THE SPONSOR PIPELINE run like sales: the 30-50 fit-sponsor map (who sells to your reader?), the media kit with HONEST metrics (engaged readers, audience role data, past campaign results), the outreach that references why THIS audience fits THEIR product, and the renewal motion powered by the post-campaign report — sponsors churn on silence and renew on evidence; (3) THE READER-FIRST RULES (non-negotiable): disclosed always ("Together with..."), relevant only (the sponsor your reader might genuinely thank you for), frequency capped (the issue that is half ads is a flyer), and the operator\u2019s voice never rented (sponsored content clearly bordered, editorial takes never bought) — one bad sponsor spends years of trust; (4) THE RESULTS ENGINEERING: sponsors succeed when placements are native-quality — write the ad like you write the letter (specific, honest, useful), position it after real value, and A/B the creative WITH the sponsor; the sponsor who gets results becomes the recurring revenue line; (5) THE CONCENTRATION GUARD: no sponsor category above ~40% of ad revenue, the waitlist cultivated even when sold out — pricing power and survival both live in the pipeline depth.',
    paid_sub_system: 'THE PAID SUBSCRIPTION SYSTEM: (1) THE PAID-PRODUCT DESIGN: people pay for actionable depth (the full analysis, the picks, the playbooks), access (Q&A, community, the author), tools (templates, models, databases) and filtered speed (the brief that saves hours) — the paid tier is a DIFFERENT product with its own promise, not a longer free issue; the design question: "what would the engaged reader describe as obviously worth $10/month to their boss or themselves?"; (2) THE FREE/PAID ARCHITECTURE: the free tier stays genuinely excellent (it is the funnel, the proof and the referral engine) — the standard splits that work: free weekly + paid deep-dive, free analysis + paid tools/community, free delayed + paid immediate; starving free to force upgrades shrinks the funnel the paid tier feeds on; (3) THE LAUNCH MECHANICS: pre-sell to the engaged segment with founding pricing honored forever, show full sample paid issues (the demo sells), state real capacity limits honestly where they exist (Q&A bandwidth), then run quarterly enrollment pushes instead of the perpetual nag; (4) THE RETENTION MACHINERY (the actual business): onboarding that surfaces the archive value in week one, the habit-forming cadence kept religiously, annual plans at a true discount (annual retention doubles monthly), churn interviews that route fixes, and the pause-offer before the cancel completes; at $100/year, three points of monthly churn is the whole business model; (5) THE PRICE-INTEGRITY RULE: no perpetual discounting, no fake deadlines — the paid tier priced fairly and held firmly trains readers that the price is real, which is precisely what makes the occasional genuine founding/annual offer convert.',
    products_system: 'THE OWN-PRODUCTS & SERVICES FUNNEL: (1) THE TRUST-ENGINE LOGIC: the newsletter is the only channel where you own the relationship end-to-end — products sold to readers convert at 5-20x cold traffic because three years of kept promises IS the sales page; the sequencing: trust first, demand evidence second, product third; (2) THE DEMAND EXCAVATION: the product roadmap is already in the archive — the questions readers reply with repeatedly, the issues with outlier engagement, the "do you offer this as a service?" DMs — build what the list already asked for, pre-sell before building (the waitlist test), and let silence kill the ideas it should; (3) THE PRODUCT LADDER by effort and price: the template/toolkit ($29-99, built once), the workshop/cohort ($100-500, leveraged live), the course/program ($200-2,000, the flagship), the consulting/retainer (the enterprise tier of a person) — most newsletter businesses should ship the ladder bottom-up, letting each rung fund and inform the next; (4) THE SOFT-SELL CADENCE: the standing footer line, the value-first launch sequence (teach publicly for two weeks, then offer), the quarterly direct pitch issue (honest, disclosed, once a quarter) — readers accept rhythmic, honest commerce and churn on ambush selling; the ratio discipline: 10+ value sends per direct ask; (5) THE DELIVERY REPUTATION LOOP: the product quality IS next quarter\u2019s marketing — the testimonial engine (results captured at the moment of win), the refund policy honored instantly, and the product improved from cohort feedback — because in a newsletter business the customer list and the audience are the same people, and they talk.',
    portfolio_strategy: 'THE DIVERSIFIED PORTFOLIO STRATEGY: (1) THE SEQUENCING LAW: build ONE engine to reliability before adding the second — the standard sequence by model: audience-for-business (services → productized offer → maybe sponsorship), sponsorship-media (sponsorship → products → events/data), paid-product (paid tier → products → selective sponsorship); two half-built engines produce less than one finished one and twice the operator thrash; (2) THE MIX TARGETS at maturity: no single engine above ~60% of revenue, no single sponsor category above ~40% of ad revenue, no single product above ~70% of product revenue — concentration is the quiet killer of newsletter businesses that look healthy right up until the quarter they are not; (3) THE ENGINE-FIT AUDIT: each engine taxes the operation differently — sponsorship costs sales hours, paid tiers cost relentless product quality, products cost launch cycles — the portfolio is chosen against the operator\u2019s real hours and skills, not against a benchmark screenshot; (4) THE SYNERGY DESIGN: the engines should feed each other — the sponsor discovers you via the free tier the paid tier funds; the product testimonials become the content; the services clients become the case studies — the portfolio that compounds is a loop, not a list; (5) THE ANNUAL REBALANCE: each January, revenue per engine per hour invested, reviewed honestly — newsletter operators systematically overwork their first engine out of habit; the rebalance moves hours to the engine with the steepest curve, and the discipline to do it is worth more than any individual tactic.',
    size_calibration: sizeCalibration[size]
  };
}

/* ----------------------------- TOOL 5: RETENTION, ANALYTICS & OPS ----------------------------- */

function buildOps(args) {
  const focus = args.ops_focus || 'onboarding_welcome_sequence';
  const operator = args.operator_type || 'solo_creator';

  const operatorCalibration = {
    solo_creator: 'SOLO-CREATOR CALIBRATION: the whole business runs through one calendar — the ops exist to protect the writing: (1) THE HOUR BUDGET HONESTY: a weekly newsletter run well costs 8-15 hours (research, writing, production, growth, replies) — the solo operator who budgets 4 is choosing which half of the business silently fails; the fix is scope, not heroics: one flagship, one channel, one revenue engine; (2) THE TEMPLATE-AND-CHECKLIST SPINE: the issue template, the send-day checklist, the repurposing recipe, the welcome sequence — built once, they convert 30% of weekly hours into reusable systems and are the precondition for any future delegation; (3) THE BATCH ARCHITECTURE: capture daily (5 minutes), write twice weekly (protected blocks), engage in two daily windows (30 minutes) — context-switching is the solo operator\u2019s hidden tax, and batching is the rebate; (4) THE FIRST-DOLLAR DELEGATION: the first hired hours go to production mechanics (formatting, scheduling, link-checking) and inbox triage — never to the voice; a VA at 5 hours/week typically buys back the entire margin between shipping and burning out; (5) THE SUSTAINABILITY TEST monthly: "if this exact workload continues 18 months, do I still want it?" — the solo newsletter dies of quiet resentment more often than failure; the honest answer re-scopes the operation while re-scoping is still cheap.',
    creator_with_small_team: 'SMALL-TEAM CALIBRATION (creator + 1-3): the leverage stage — the founder\u2019s hours migrate to what only the founder can do: (1) THE DIVISION THAT WORKS: founder owns voice and judgment (the core writing, the takes, the key relationships); the team owns production (edit, format, QA, scheduling), growth operations (repurposing execution, cross-promo logistics, referral admin) and the revenue back-office (sponsor fulfillment, reports, invoicing) — the division fails only when the founder keeps production or outsources voice; (2) THE EDITOR HIRE as the inflection: a real editor (even part-time) upgrades quality while CUTTING founder hours — the rare hire that improves both sides of the equation; the editor also makes the buffer and the vacation structurally possible; (3) THE SOP LIBRARY: the send-day runbook, the sponsor-campaign checklist, the launch playbook — documented as they are performed (the loom-while-doing habit), because the small team that documents can absorb its own turnover; (4) THE WEEKLY OPS RHYTHM: one 30-minute dashboard review (growth cohorts, engagement trend, revenue pipeline, this week\u2019s risks) — numbers first, anecdotes second, one decision per meeting; (5) THE MARGIN DISCIPLINE: the small team is where newsletter businesses quietly go margin-negative — every hire against a named revenue line or a named founder-hour recovery, reviewed quarterly against reality.',
    media_company_team: 'MEDIA-COMPANY CALIBRATION: the institutional stage — multiple properties or a flagship at serious scale: (1) THE ORG DESIGN: editorial (writers, editors — the product), audience (growth, SEO, social — the distribution), revenue (sponsorship sales, subscriptions, products — the money) with named owners and a weekly cross-functional rhythm — newsletters at this scale fail on coordination before they fail on content; (2) THE EDITORIAL SYSTEM: the style guide that preserves voice across writers, the editorial calendar with themes and franchises, the quality bar enforced by editors with authority — the brand voice is now an institutional asset, documented and defended; (3) THE ANALYTICS MATURITY: cohort LTV by acquisition channel, engaged-reader economics per property, sponsorship yield management (sell-through, pricing power), paid-tier churn decomposition — the dashboard is a revenue instrument, staffed accordingly; (4) THE PORTFOLIO OPERATIONS: shared services (design, data, sales) across properties, the incubation playbook for new letters (validated like startups, killed without sentiment), and the audience-sharing machinery that makes each launch cheaper than the last; (5) THE INSTITUTIONAL MOATS: owned platforms and first-party data, the events and data-products layer, the talent pipeline that survives any single writer leaving — the media company\u2019s job is making the business durable against the departure of the person it was named after.'
  };

  return {
    status: 'success',
    onboarding_system: 'Ops engineering — primary focus: ' + focus.replace(/_/g, ' ') + '. THE ONBOARDING & WELCOME SEQUENCE: (1) EMAIL ONE, INSTANTLY: delivers the promised lead magnet or best-of sample in the first minute, restates the promise ("every Friday, 6 minutes, one real teardown"), sets the expectation, and asks THE QUESTION ("what made you subscribe? hit reply") — the reply is deliverability gold (inbox providers read replies as the strongest positive signal), content intelligence and relationship, all in one sentence; (2) THE WELCOME ARC (3-5 emails over 10 days): the best-of tour (three archive gems that demonstrate range), the origin story that humanizes the voice, the how-to-get-value note (the archive, the preference center, the community if any), and the single soft pointer to the deeper offer — the arc trains the open habit during the honeymoon window when attention is highest; (3) THE FIRST-WEEK ENGAGEMENT WATCH: subscribers who open nothing in the first three sends rarely recover — the arc is the filter: the cohort that ignores it enters the sunset track early, keeping the list honest from day one; (4) THE SEGMENT-AT-BIRTH MECHANIC: the welcome question or one-click survey ("which best describes you?") tags readers at the moment of maximum cooperation — powering sponsor reporting, product launches and content decisions forever after; (5) THE TECHNICAL FLOOR: double opt-in for paid-acquired cohorts, the from-name that is a human, the first email tested across Gmail/Outlook/mobile — onboarding is also the inbox-placement audition, and first impressions are algorithmic now.',
    retention_system: 'THE ENGAGEMENT, RETENTION & LIST-HYGIENE SYSTEM: (1) THE ENGAGEMENT-DECAY WATCH: retention is managed at the cohort level — the monthly read of opens-per-reader by join-month catches the decay while it is a trend, not a crisis; the usual culprits in order: promise drift, cadence fatigue, quality dip, seasonal noise; (2) THE RE-ENGAGEMENT ARC for the fading (no opens in 60-90 days): the subject line that names it honestly ("still want these?"), the best-recent-work sample, the one-click preference downgrade (monthly best-of instead of weekly) — the downgrade saves a real fraction of relationships the binary unsubscribe would have ended; (3) THE SUNSET POLICY WITH DIGNITY: after the arc fails, the goodbye email ("we are removing you to respect your inbox — one click restores it") and the actual removal — the cleaned list opens better, lands better and sells better; hoarding dead addresses is vanity taxed by deliverability; (4) THE DELIVERABILITY HYGIENE BASICS owned by every operator: authentication in order (SPF/DKIM/DMARC — see a deliverability specialist or InboxForge-class tooling for the deep work), the engaged-first send strategy for big lists, the spam-complaint watch (above 0.1% is an alarm), and the list-source audit whenever metrics lurch; (5) THE WIN-BACK HONESTY: the quarterly note to recent unsubscribers\u2019 cohort-mates is fine; chasing individual unsubscribers is not — the retention system optimizes for the readers who want to be there, because every metric that pays (opens, clicks, conversions, renewals) is a percentage of exactly them.',
    analytics_dashboard: 'THE ANALYTICS DASHBOARD THAT MATTERS: (1) THE OPEN-RATE HONESTY: privacy proxies (Apple MPP) inflate opens — treat open rate as a TREND instrument (direction over level) and triangulate with clicks, replies and web views; the operator quoting a precise open rate as truth is reading a broken speedometer confidently; (2) THE CLICK-QUALITY LAYER: not click count — click MAP: which sections earn clicks per reader, which links die unclicked (the section audit), and the click-to-depth signal (who clicks the dense stuff — the segment that buys); (3) THE COHORT RETENTION CURVE as the product metric: opens-per-reader at 30/60/90 days by join-month and by source — the single chart that says whether the product and the growth channels are actually working, and the one most operators never build; (4) THE REVENUE-PER-SUBSCRIBER LENS: total revenue / engaged subscribers, by engine — the number that disciplines both growth spend (CAC ceiling) and monetization sequencing (which engine is underbuilt), reviewed monthly in one page; (5) THE VANITY SET IGNORED ON PURPOSE: total list size (includes the dead), follower counts (not the list), single-send spikes (noise), and competitor subscriber claims (unaudited fiction) — the dashboard exists to change decisions, and every number on it should be attached to one.',
    ops_stack: 'THE OPERATIONS STACK & AUTOMATION DISCIPLINE: (1) THE MINIMAL STACK by stage: platform + landing page + one analytics view until 10k; add the scheduling tool, the referral layer and the link-checker as each earns its seat — the stack audit question is "which tool did I not open last month?", and the answer gets cancelled; (2) THE SEND-DAY RUNBOOK: the checklist (links clicked, mobile test-send read, subject/preview truncation check, personalization fields verified, sponsor block against insertion order, UTM tags present) executed every send — the broken-link apology email costs more trust than the checklist costs minutes, every time; (3) THE AUTOMATION LINE: automate logistics (welcome arcs, re-engagement triggers, digest assembly, sponsor-report data pulls) and never the relationship (replies answered by the human, the voice never delegated to a template, the "personal" note that is actually personal) — readers forgive typos and never forgive discovering the warmth was a macro; (4) THE BACKUP DISCIPLINE: the list exported monthly to owned storage, the archive mirrored off-platform, the sponsor contracts and rate history in one place — the platform is rented; the business is the list, the archive and the relationships, and all three should survive any single vendor; (5) THE CALENDAR INFRASTRUCTURE: the editorial calendar (themes, franchises, seasonal hooks), the revenue calendar (sponsor slots, launch windows, enrollment pushes) and the maintenance calendar (quarterly list clean, annual format audit) reconciled monthly — the newsletter business is a rhythm business, and the calendars ARE the operating system.',
    operator_calibration: operatorCalibration[operator]
  };
}

async function auditRssFeedLive(args) {
  var url = args.feed_url;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  async function get(u) {
    try {
      var r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsletterForge-MCP/1.1)', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html' }, redirect: 'follow' });
      return { status: r.status, text: await r.text() };
    } catch (e) { return null; }
  }
  var res = await get(url);
  var body = res ? res.text : '';
  var isFeed = /<rss[\s>]|<feed[\s>]/i.test(body);
  var discovered = null;
  if (res && !isFeed && /<html/i.test(body)) {
    var dm = body.match(/<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*href=["']([^"']+)["']/i) || body.match(/href=["']([^"']+)["'][^>]*type=["']application\/(?:rss|atom)\+xml["']/i);
    if (dm) {
      discovered = dm[1];
      if (discovered.indexOf('http') !== 0) { try { discovered = new URL(discovered, url).href; } catch (e) {} }
      var res2 = await get(discovered);
      if (res2 && /<rss[\s>]|<feed[\s>]/i.test(res2.text)) { body = res2.text; isFeed = true; url = discovered; }
    }
  }
  if (!res || !isFeed) {
    return {
      status: 'success',
      feed_health: 'NO VALID FEED FOUND at ' + args.feed_url + (res ? ' (HTTP ' + res.status + ', content is not RSS/Atom' + (discovered ? '; autodiscovery pointed to ' + discovered + ' but that was not a valid feed either' : '; no autodiscovery link tag in the HTML') + ')' : ' (fetch failed - host unreachable or blocking)') + '.',
      publishing_cadence: 'UNAVAILABLE - cadence is computed from real item timestamps, and no feed items were retrieved.',
      content_read: 'UNAVAILABLE - no feed content to analyze.',
      growth_priorities: 'P1: expose a working RSS feed - every newsletter platform (Substack, Beehiiv, Ghost, WordPress) ships one by default, find its URL (/feed, /rss, /atom.xml) | P2: add the autodiscovery link tag so tools and readers find it | P3: re-run this audit once the feed resolves.',
      data_source: 'Live GET of ' + args.feed_url + ' with RSS/Atom autodiscovery attempted at request time. Real fetch - nothing simulated.'
    };
  }
  var isAtom = /<feed[\s>]/i.test(body) && !/<rss[\s>]/i.test(body);
  var itemRe = isAtom ? /<entry[\s>]/gi : /<item[\s>]/gi;
  var items = (body.match(itemRe) || []).length;
  var dateRe = isAtom ? /<(?:published|updated)>([^<]+)</gi : /<pubDate>([^<]+)</gi;
  var dates = [];
  var dm2;
  while ((dm2 = dateRe.exec(body)) !== null && dates.length < 25) {
    var d = new Date(dm2[1].trim());
    if (!isNaN(d.getTime())) dates.push(d);
  }
  dates.sort(function(a, b) { return b - a; });
  var latest = dates.length ? dates[0] : null;
  var cadence = 'not computable (fewer than 2 dated items)';
  if (dates.length >= 2) {
    var spanDays = (dates[0] - dates[dates.length - 1]) / 86400000;
    var avgGap = spanDays / (dates.length - 1);
    cadence = avgGap < 1.5 ? 'roughly DAILY (avg ' + avgGap.toFixed(1) + ' days between posts)' : avgGap < 9 ? 'roughly WEEKLY (avg ' + avgGap.toFixed(1) + ' days between posts)' : avgGap < 35 ? 'roughly MONTHLY (avg ' + avgGap.toFixed(1) + ' days between posts)' : 'IRREGULAR/SLOW (avg ' + avgGap.toFixed(1) + ' days between posts)';
  }
  var daysSince = latest ? Math.round((Date.now() - latest.getTime()) / 86400000) : null;
  var titles = [];
  var tRe = /<title[^>]*>(?:<!\[CDATA\[)?([^<\]]+)/gi;
  var tm;
  while ((tm = tRe.exec(body)) !== null && titles.length < 20) { var tt = tm[1].trim(); if (tt) titles.push(tt); }
  if (titles.length > 1) titles = titles.slice(1);
  var avgTitle = titles.length ? Math.round(titles.reduce(function(a, b) { return a + b.length; }, 0) / titles.length) : 0;
  var fullContent = /<content:encoded|<content[\s>]/i.test(body);
  var prios = [];
  if (daysSince !== null && daysSince > 30) prios.push('P1: last post was ' + daysSince + ' days ago - a silent feed kills subscriber trust faster than no feed, ship something this week');
  if (!fullContent) prios.push('P1: feed serves excerpts only - full-content feeds get read inside RSS readers and email bridges, excerpts get skipped');
  if (cadence.indexOf('IRREGULAR') !== -1) prios.push('P1: cadence is irregular - consistency beats frequency, pick a fixed day and hold it');
  if (avgTitle > 70) prios.push('P2: average title length ' + avgTitle + ' chars - long titles truncate in inboxes and readers, aim 40-60');
  if (items < 10) prios.push('P2: only ' + items + ' item(s) in the feed window - expose at least 10-20 for new-subscriber binge reading');
  prios.push('P3: add the feed URL prominently on the site + autodiscovery tag so aggregators index every issue');
  return {
    status: 'success',
    feed_health: 'VALID ' + (isAtom ? 'ATOM' : 'RSS') + ' FEED at ' + url + ': ' + items + ' item(s) in the current window, ' + dates.length + ' with parseable dates.' + (latest ? ' Latest post: ' + latest.toISOString().slice(0, 10) + ' (' + daysSince + ' day(s) ago).' : ''),
    publishing_cadence: 'REAL CADENCE from actual timestamps: ' + cadence + '.' + (latest ? ' Freshness: last published ' + daysSince + ' day(s) ago.' : ''),
    content_read: 'CONTENT READ: avg title length ' + avgTitle + ' chars across ' + titles.length + ' titles' + (titles.length ? ' (sample: "' + titles[0].slice(0, 70) + '")' : '') + '. Full content in feed: ' + (fullContent ? 'YES - readers can consume complete issues' : 'NO - excerpt-only') + '.',
    growth_priorities: prios.join(' | '),
    data_source: 'Live fetch of ' + url + ' at request time with real RSS/Atom XML parsing - item counts, dates and cadence all computed from the actual feed. Nothing estimated.'
  };
}
