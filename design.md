# Walky DZ — Algeria COD Ecommerce Platform

## Overview
Walky DZ is a production-grade, white-label Algeria COD (Cash on Delivery) Ecommerce Platform. It is not a traditional cart-based store — it is a Conversion Funnel System built specifically for Algerian Facebook/TikTok ad traffic. The platform features a dynamic storefront, an embedded single-page checkout, a full admin dashboard with real-time analytics, a landing page builder, a complete shipping engine for all 58 Algerian wilayas, and an anti-fraud order protection system.

## Design Tokens

### Colors
**Primary Palette**
- `--primary`: #2563EB (Royal Blue — primary actions, links, price highlights)
- `--primary-dark`: #1D4ED8 (hover states)
- `--primary-light`: #3B82F6 (borders, accents)

**Dark Mode Dashboard (Default for Admin)**
- `--bg-primary`: #0A0F1E (deep navy-black, main background)
- `--bg-surface`: #0F1629 (sidebar, cards, elevated surfaces)
- `--bg-card`: #141D35 (card backgrounds)
- `--bg-hover`: #1A2744 (hover state on cards/rows)
- `--border-subtle`: #1E2D52 (borders, dividers)
- `--text-primary`: #E2E8F0 (headings, primary text)
- `--text-secondary`: #94A3B8 (body text, descriptions)
- `--text-muted`: #64748B (labels, disabled text)

**Storefront Light Mode**
- `--bg-light`: #FFFFFF
- `--bg-light-alt`: #F9FAFB
- `--text-dark`: #0F172A
- `--text-body`: #334155
- `--border-light`: #E2E8F0

**Semantic Colors**
- `--success`: #22C55E (delivered orders, confirmations)
- `--warning`: #F59E0B (pending orders, alerts)
- `--danger`: #EF4444 (cancelled, fraudulent, errors)
- `--info`: #3B82F6 (new orders, notifications)
- `--accent-orange`: #F97316 (CTA buttons, urgency elements)

### Typography
- **Font Family**: `Inter` for English/UI, `Cairo` for Arabic/RTL text.
- **Weights**: 400 (body), 500 (medium), 600 (semibold), 700 (bold), 800 (extra bold for prices).
- **Scale**:
  - Display: 2.25rem/36px (dashboard page titles)
  - H1: 1.875rem/30px
  - H2: 1.5rem/24px (card headers)
  - H3: 1.25rem/20px
  - Body: 0.875rem/14px (standard UI text)
  - Small: 0.75rem/12px (labels, timestamps)
  - Micro: 0.6875rem/11px (badges, tags)

### Spacing & Shape
- **Base unit**: 4px
- **Border radius**: 8px (standard), 12px (cards/modals), 9999px (pills, badges)
- **Card padding**: 20px-24px
- **Grid gap**: 16px-24px
- **Shadows**:
  - Card: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)`
  - Elevated: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`
  - Modal: `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)`
  - Glow (stats): `0 0 20px rgba(37,99,235,0.15)`

## Dependencies
- recharts
- lucide-react
- framer-motion
- date-fns

---

## Page: Admin Dashboard

### Global Layout (Dashboard Shell)
Fixed left sidebar (64px wide, icon-only) + collapsible right panel (280px). Top bar with store logo and admin profile. RTL layout support.

### Sidebar Navigation
Fixed vertical rail on the left. Icons: LayoutDashboard, Package, ShoppingCart, Truck, BarChart3, Megaphone, Palette, Settings. Active state: `--primary` background tint + `--primary` icon color. Hover: `--bg-hover` background.

### Stat Cards Row (Top)
Four equal-width gradient cards showing KPIs: Total Orders, Total Products, Total Revenue, Active Customers. Each card has a gradient background (blue-purple, cyan-blue, green-teal, pink-amber), a large white number, an icon in top-right, and a small "+N% this month" indicator.

### Quick Actions Bar
Row of pill-shaped action buttons below stats: "Add Product", "View Orders", "Create Ad", "Manage Shipping", etc. Primary fill, `--primary` background, white text.

### Recent Orders Panel
Left column (60% width). Card titled "Recent Orders" with a table showing latest 5-8 orders. Columns: Customer Name, Phone (masked), Product, Price (badge), Date. Each row has a colored status dot (blue=new, teal=confirmed, amber=shipping, green=delivered, red=cancelled).

### Top Products Panel
Right column (40% width). Card titled "Top Products" listing best-selling products. Each product: name, price, availability badge.

### Navigation Cards Grid
Below the split panels, a 3-column grid of navigation cards linking to all dashboard sections. Each card: centered icon (3x size), title, description, and a count badge. Hover: translateY(-3px) + shadow increase.

### Revenue Chart
Full-width card with a line chart (Recharts) showing revenue over the last 7 days. Uses `--primary` stroke with area fill gradient.

---

## Page: Admin Products

### Header
Page title "Products Management" + "Add Product" primary button.

### Products Grid
Responsive grid of product cards. Each card shows: product image, name, price in DZD, stock status badge, edit/delete action buttons. Cards use `--bg-card` background.

### Add/Edit Product Form
Modal form with sections:
- **Basic Info**: Name, slug, description (textarea)
- **Pricing**: Price, compare-at price
- **Variants**: Color picker, size options (tag input)
- **Media**: Image upload dropzone
- **Settings**: Display mode toggle (Product Page vs Landing Page), Active toggle, SEO fields

---

## Page: Admin Orders

### Orders Pipeline
Horizontal scrollable row of status pills: New → Confirmed → Shipping → Delivered → Returned → Cancelled. Each shows count and arrow separator. Click to filter.

### Orders Table
Full-width data table with columns:
- Order #
- Customer Name
- Phone
- Wilaya (badge with number)
- Product
- Total (DZD)
- Status (colored badge)
- Date
- Actions (view, edit status, delete)

### Bulk Actions Bar
Sticky top bar when rows are selected. "Mark as Confirmed", "Mark as Shipping", "Export CSV", "Delete Selected".

---

## Page: Admin Landing Pages

### Landing Page Builder (Split View)
Left panel (40%): Section list with drag handles. Each section: type icon, title, enable/disable toggle, edit/delete buttons.
Right panel (60%): Live preview of the landing page updating in real-time.

### Section Types Available
- Hero: background image, headline, subheadline, CTA button
- Benefits: icon grid with text
- Reviews: star ratings + customer photos
- Countdown: timer to a deadline
- Video: embedded video player
- Bundles: product bundle offers
- FAQ: accordion
- Checkout Block: embedded COD form
- Trust Badges: guarantee/secure payment icons
- Long Image: full-width uploaded image section

---

## Page: Admin Shipping

### Wilayas Table
Table of 58 Algerian wilayas. Columns: Wilaya Code, Name (Arabic), Home Delivery Price, Desk Delivery Price, Enabled toggle. Inline editable prices.

### Shipping Rules
Card showing dynamic rules:
- Free shipping minimum order amount
- Free shipping for specific wilayas
- Coupon-based shipping discount
- Quantity tier pricing

### Shipping Providers
List of configured providers (Yalidine, Maystro, etc.) with API key fields and active toggles.

---

## Page: Admin Analytics

### Stats Row
Four real-time stat cards: Today's Orders, Revenue, Conversion Rate, Fraud Alerts. Each has a pulsing live indicator dot.

### Charts Section
- **Revenue Chart**: 30-day area chart
- **Orders by Wilaya**: Horizontal bar chart showing top 10 wilayas
- **Conversion Funnel**: Vertical step chart (PageView → ViewContent → InitiateCheckout → Purchase)
- **Top Products**: Horizontal bar chart

### Date Range Filter
Top-right date picker allowing custom range selection for all charts.

---

## Page: Storefront — Product Page (Light Mode)

### Layout
Clean white background, RTL. Mobile-first single column.

### Product Gallery
Full-width image carousel with swipe support. Thumbnail strip below main image.

### Product Info
- Title (H1, bold)
- Price in DZD (large, `--primary` color, bold)
- Compare-at price (strikethrough)
- Star rating + review count
- Short description

### Variants Selector
Color swatches (circular) and size buttons (rectangular pills). Selected state: `--primary` border + checkmark.

### Quantity Selector
"-" and "+" buttons flanking a number input. Min 1, max based on stock.

### Embedded Checkout Form (COD)
Styled card with form fields arranged in a clean grid:
- **Full Name** (text input, icon: User)
- **Phone Number** (tel input, icon: Phone, Algerian format validation)
- **Wilaya** (searchable dropdown, icon: MapPin)
- **Commune** (dropdown, dynamically populated based on wilaya, icon: MapPin)
- **Address** (textarea, icon: Home)
- **Delivery Type** (two radio cards: Home Delivery / Desk Delivery — price shown on each)
- **Notes** (optional textarea)

### Order Summary
Sticky summary card showing:
- Product name × quantity
- Subtotal
- Shipping cost (dynamic based on selection)
- **Total in DZD** (large, bold, `--primary`)

### Submit Button
Full-width button "Confirm Order — Cash on Delivery" with pulsing animation on mobile.

### Trust Badges
Below the form: row of icons (Lock, Truck, RotateCcw) with labels "Secure Order", "Fast Delivery", "Easy Returns".

---

## Page: Storefront — Landing Page

### Layout
Single long-scroll page. No header/footer (optional toggle from dashboard). Sections stack vertically with configurable spacing.

### Hero Section
Full-width background image with centered text overlay. Headline, subheadline, large orange CTA button. On click: scrolls to checkout block.

### Countdown Section
Full-width bar with countdown timer (days:hours:minutes:seconds) + urgency text.

### Benefits Section
Grid of 3-4 benefit cards with icons and short descriptions.

### Social Proof Section
Customer reviews in a horizontal scrollable row. Each: 5 stars, text, name, date.

### Checkout Block
The same embedded COD form from the product page, placed mid-page or at bottom based on dashboard configuration.

### Sticky CTA Bar
Fixed bottom bar on mobile with "Order Now" button that scrolls to checkout form. Disappears when checkout form is in viewport.

---

## Global Interactions

### Dashboard Interactions
- **Sidebar**: Icon rail expands to 240px on hover showing labels (optional, can be pinned).
- **Stat Cards**: Numbers count up from 0 on page load using a duration of 1.5s.
- **Tables**: Sortable columns on click. Rows have hover state `--bg-hover`.
- **Modals**: Enter with scale(0.95) → scale(1) + opacity fade. Backdrop: `rgba(0,0,0,0.5)`.
- **Form Inputs**: Focus state: `--primary` border + subtle glow shadow.
- **Buttons**: Hover: slight scale(1.02) + shadow increase. Active: scale(0.98).
- **Delete Confirmations**: Red danger modal with confirmation text input.
- **Toast Notifications**: Slide in from top-right. Green for success, red for error, blue for info. Auto-dismiss after 4s.

### Storefront Interactions
- **Product Gallery**: Swipeable with momentum. Dot indicators below.
- **Quantity Buttons**: Tactile press animation (scale 0.9 briefly).
- **Wilaya Dropdown**: Searchable filter. Typing filters the 58 options in real-time.
- **Commune Dropdown**: Disabled until wilaya selected. Populates dynamically.
- **Shipping Options**: Radio cards with hover highlight. Selecting updates the total price instantly with a brief number-flip animation.
- **Sticky CTA**: Uses IntersectionObserver to show/hide based on checkout form visibility.
- **Countdown Timer**: Updates every second. At 0, shows "Offer Expired" message.
- **Form Validation**: Real-time on blur. Phone field enforces Algerian format (05|06|07 + 8 digits). Invalid fields shake briefly (translateX ±4px, 3 cycles, 0.3s).
- **Submit Button**: On click, locks form (overlay + spinner), submits via tRPC, then navigates to Thank You page.

### Landing Page Builder Interactions
- **Drag & Drop**: Sections reorder via drag handles. Smooth reordering animation.
- **Section Toggle**: Enable/disable sections with instant preview update.
- **Live Preview**: Right panel updates within 300ms of any change.
- **Section Editor**: Modal with form fields specific to section type (text inputs, image uploaders, color pickers).

---

## Core Effects

### Gradient Stat Cards (Dashboard)
Apply to dashboard KPI cards. **Implementation**: Each card uses a `bg-gradient-to-br` with its designated gradient pair. On hover, apply `transform: translateY(-4px) scale-[1.02]` with a transition of `all 0.3s ease`. Add a `shadow-lg` that transitions to `shadow-2xl` on hover. The icon in the corner uses `opacity-80`.

### Pulsing Live Indicator (Analytics)
Apply to the real-time status dots on analytics stat cards. **Implementation**: A small circular element with `bg-current` color. CSS animation: `pulse 2s infinite` where `pulse` oscillates opacity between 1 and 0.4.

### Revenue Chart (Admin)
Apply to the revenue line chart. **Implementation**: Recharts `AreaChart` with a `<defs>` linear gradient from `--primary` at 20% opacity to 0% opacity. Stroke is `--primary` at 2px width. Fill the area below the line. Tooltip: dark background card with white text showing date and amount. Grid lines at `--border-subtle` opacity.

### Wilaya Bar Chart (Analytics)
Apply to orders-by-wilaya chart. **Implementation**: Recharts `BarChart` horizontal. Bars use `--primary` fill. Top 3 bars use `--accent-orange` to highlight. Y-axis: wilaya names. X-axis: order count.

### Conversion Funnel (Analytics)
Apply to the conversion funnel visualization. **Implementation**: Vertical stepped bar chart or custom HTML/CSS. Each step is a trapezoid shape decreasing in width. Color gradient from `--primary` (top) to `--bg-hover` (bottom). Percentage labels on the right showing conversion rate between steps.

### Sticky Checkout CTA (Storefront)
Apply to the fixed bottom bar on mobile landing pages. **Implementation**: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 50`. `bg-white/95 backdrop-blur-sm border-t`. Contains a single full-width button. Hide/show controlled by IntersectionObserver on the checkout form element. Transition: `transform 0.3s ease` — slides down to `translateY(100%)` when hidden, `translateY(0)` when visible.

### Number Counter Animation (Dashboard Stats)
Apply to all stat numbers. **Implementation**: Custom hook or component that accepts a target number. Animates from 0 to target over 1.5s using `requestAnimationFrame` with an ease-out curve. Format numbers with commas and append "دج" for currency.

### Order Status Pipeline (Orders Page)
Apply to the horizontal status flow. **Implementation**: Flex row of pill elements connected by arrow spans (→). Each pill: `px-3 py-1.5 rounded-md font-bold text-xs whitespace-nowrap`. Background is the status color at 10% opacity, text is the full status color, border is 1px solid the status color. Active status has a slightly darker background.

### Shipping Price Live Update (Checkout)
Apply to the order total when delivery type changes. **Implementation**: When the user selects a different shipping option, the shipping cost number should briefly fade out (opacity 0, 150ms), update the value, then fade back in (opacity 1, 150ms). The grand total updates simultaneously with a brief highlight flash (`bg-primary/10` for 300ms).

### Card Hover Lift (Navigation Cards)
Apply to all navigation cards on dashboard home. **Implementation**: On hover, `transform: translateY(-3px)` with `transition: all 0.3s ease`. Shadow increases from `shadow-md` to `shadow-xl`. The icon color transitions to `--primary` on hover.

---

## Assets

[ASSET: Image "hero-waterproof"]
Product hero image: A silver metallic bucket of waterproof sealant coating labeled "PROELASTIC" in bold black text, sitting on a wet black slate surface with water droplets beading up around it. A red "★★★★★ 4.8" rating badge in top-right corner. White background with subtle water splash effects. Professional product photography, commercial style.

[ASSET: Image "product-shoe-1"]
A pair of sleek black running shoes with white soles, side profile view on a clean white background. Mesh fabric upper with subtle texture. Dynamic angle showing the shoe's aerodynamic design. Professional product photography with soft shadows.

[ASSET: Image "product-shoe-2"]
A pair of white leather casual sneakers, front three-quarter view on a light gray background. Clean minimalist design with subtle perforation details. Premium product photography style.

[ASSET: Image "trust-badge-secure"]
32x32px icon: A shield with a checkmark inside, blue outline, white fill.

[ASSET: Image "trust-badge-shipping"]
32x32px icon: A delivery truck in motion, blue outline, white fill.

[ASSET: Image "trust-badge-return"]
32x32px icon: A circular arrow indicating return/refresh, blue outline, white fill.

[ASSET: Image "avatar-customer-1"]
Small circular avatar: A young Algerian man smiling, wearing a casual t-shirt. Warm lighting, close-up portrait.

[ASSET: Image "avatar-customer-2"]
Small circular avatar: A middle-aged Algerian woman with a headscarf, friendly expression. Outdoor background slightly blurred.

---

## Notes
- All dashboard pages use the dark color scheme (`--bg-primary`, `--bg-surface`). All storefront pages use the light scheme (`--bg-light`).
- RTL support is mandatory — all layouts must work correctly with `dir="rtl"`.
- The checkout form on the product page must be the ONLY way to purchase — no "Add to Cart" button exists anywhere in the storefront.
- Store settings (colors, logo, name) are fetched from the database and applied dynamically. Use CSS custom properties for runtime theme changes.
- The 58 Algerian wilayas and their communes must be seeded in the database. The commune dropdown must filter based on the selected wilaya.
- Phone validation: Must match Algerian format — starts with 05, 06, or 07 followed by 8 digits. Total 10 digits.
- Landing pages can hide the navbar and footer via dashboard toggle. This is critical for ad conversion funnels.
- All form submissions must include anti-fraud checks: IP tracking, phone cooldown (same phone cannot order within 24 hours), and duplicate detection.
- Use Framer Motion for page transitions, modal animations, and the landing page builder drag-and-drop.
- Google Sheets sync happens server-side via a tRPC mutation called after successful order creation.
- Pixel events (Meta, TikTok) fire on: PageView (all pages), ViewContent (product/landing page), InitiateCheckout (form open), Purchase (order confirmed). Implement via `<Script>` tags in the HTML head with dynamic pixel IDs from store settings.
- The admin auth uses the built-in OAuth system. Only authenticated admin users can access `/admin/*` routes. Use `AuthGuard` component to redirect unauthenticated users to login.
- For the white-label system: All branding (logo, favicon, store name, primary color) comes from the `store_settings` table. The frontend reads these values and applies them dynamically. Different Supabase instances = different stores with the same code.
- Shipping calculation is an Edge Function that takes wilaya_id, commune_id, product_id, quantity and returns home_price, desk_price, free_shipping boolean, and provider list.
- The database schema must support: products (with display_mode enum), orders (with status pipeline and risk_score), landing_pages (with JSONB sections array), shipping_zones, fraud_blacklist, and store_settings.
- Mobile-first: All storefront pages must be optimized for 320px-428px width. The checkout form fields should be large enough for easy thumb-tapping (min 44px height).
- Performance target: LCP < 2.5s on mobile 3G. Use image optimization, code splitting, and server components where possible.
