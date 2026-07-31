# Midas Frontend UI - Discovery & Implementation

## Overview

The Midas frontend is a React-based financial management application with a comprehensive UI layout consisting of:
- **Sticky Header** (60px): Logo, title, search, and user menu
- **Responsive Sidebar** (250px desktop, 70px tablet, drawer on mobile): 4-section navigation
- **Content Area**: Full-width responsive main content
- **Footer** (60px): Status indicator, version, and links

## Layout Architecture

```
┌─────────────────────────────────────────────┐
│  HEADER (sticky, 60px)                      │
│  Logo | Title | Search | User Menu          │
├──────────────┬──────────────────────────────┤
│  SIDEBAR     │  CONTENT AREA                │
│ (250px)      │  (responsive)                │
│              │  ├─ Page Title               │
│  4 Sections  │  ├─ Filter Bar               │
│  16 Items    │  ├─ Data Table/Cards         │
│              │  └─ Pagination               │
├──────────────┴──────────────────────────────┤
│  FOOTER (60px)                              │
│  Status | Version | Links                   │
└─────────────────────────────────────────────┘
```

## Navigation Structure

### Sidebar Sections (4 total)

#### 1. ACCOUNTS (5 items)
- 📊 Dashboard - Overview and key metrics
- 💳 My Accounts - View all bank accounts
- 📥 Money Sources - Income sources
- 📤 Money Sinks - Expense categories
- 🏷️ Categories - Transaction categories

#### 2. TRANSACTIONS (4 items)
- 💸 Transfers - View all transfers
- ➕ New Transfer - Create new transfer
- 🔄 Reclaimable - View reclaimable transfers (Account→Sink marked for recovery)
- ✅ Recovery - View recovery transfers (Source→Account linked to reclaimable)

#### 3. REPORTS (4 items)
- 📈 Overview - Financial overview
- 💰 Spending - Spending analysis
- 💵 Income - Income analysis
- 📜 History - Transaction history

#### 4. SETTINGS (4 items)
- ⚙️ Preferences - User preferences
- 🔐 Security - Security settings
- 🔑 API Keys - API key management
- 🚪 Logout - Sign out

## Color Scheme

```css
--primary: #1a365d      /* Dark blue */
--secondary: #2d3748    /* Charcoal */
--accent: #3b82f6       /* Bright blue */
--success: #10b981      /* Green */
--warning: #f59e0b      /* Amber */
--error: #ef4444        /* Red */
--bg-light: #f9fafb     /* Off-white */
--bg-white: #ffffff     /* White */
--text-primary: #1f2937 /* Dark gray */
--text-secondary: #6b7280 /* Medium gray */
--border: #e5e7eb       /* Light gray */
```

## Component Hierarchy

```
Layout
├── Header
│   ├── Logo (icon + text)
│   ├── Search Input
│   └── User Menu
├── Main Container (grid: sidebar + content)
│   ├── Sidebar
│   │   └── NavSection (x4)
│   │       └── NavItem (x4 per section)
│   └── Content Area
│       └── Page Content (Dashboard, Transfers, etc.)
└── Footer
    ├── Status Indicator
    └── Links
```

## Pages Implemented

### Dashboard (`/`)
- **Content**: 4 stat cards showing:
  - Total Balance
  - This Month's Income
  - This Month's Expenses
  - Pending Recovery
- **Features**: Grid layout, hover effects

### Transfers (`/transfers`)
- **Content**: Table of all transfers
- **Columns**: Date, Description, Type, Amount, Status, Actions
- **Features**: Search, type filter, status filter, pagination
- **Type Badges**: Income (green), Expense (amber), Standard (blue)
- **Status Badges**: Completed (green), Pending (amber), Failed (red)

### Reclaimable (`/reclaimable`)
- **Content**: Table of Account→Sink transfers marked as reclaimable
- **Columns**: Date, Description, Amount, Expected Source, Status, Actions
- **Status**: Shows "Pending Recovery" for unrecovered transfers
- **Purpose**: Track expenses that should be recovered from a source

### Recovery (`/recovery`)
- **Content**: Table of Source→Account transfers linked to reclaimable transfers
- **Columns**: Date, Description, Amount, Reclaimed From, Status, Actions
- **Status**: Shows "Completed" when linked to original transfer
- **Purpose**: Track payback of reclaimable expenses

### Accounts (`/accounts`)
- **Content**: Table of bank accounts
- **Columns**: Name, IBAN, Currency, Balance, Actions
- **Features**: Add account button, edit/delete per account

## Responsive Behavior

### Desktop (1200px+)
- Full layout with all elements visible
- Sidebar: 250px, fully expanded with labels
- Header search: Full width (300px)
- Navigation section titles visible

### Tablet (768px - 1199px)
- Sidebar collapses to 70px (icons only)
- Navigation labels hidden
- Search reduced to 200px
- Section titles hidden
- Active item indicator: bottom border instead of left

### Mobile (<768px)
- Sidebar becomes drawer menu (off-canvas)
- Toggle button appears in header
- Sidebar overlays content on open
- Header search: hidden
- User name: hidden
- Footer: center-aligned, reduced info

## Typography

- **Font**: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- **Page Titles**: 28px, weight 700
- **Section Titles**: 18px, weight 600
- **Table Headers**: 13px, weight 600, uppercase, letter-spacing 0.5px
- **Body Text**: 14px, weight 400
- **Small Text**: 12px or 11px, weight 400

## Spacing Grid

- **Unit**: 4px
- **Common Values**: 4, 8, 12, 16, 24, 32, 48px
- **Padding**: 12-24px for content
- **Gap**: 12-16px between elements
- **Margin**: 24-32px for page sections

## Interactive Elements

### Buttons
- **Primary**: Blue background, white text, hover darkens
- **Secondary**: Light background, gray text, hover darkens
- **Danger**: Red outline, red text, hover fill
- **Small**: 6x12px padding, used in tables

### Form Inputs
- **Style**: Light background, 1px gray border
- **Focus**: Blue border + light blue shadow
- **Width**: Full width or constrained (300px search)

### Tables
- **Header**: Light background
- **Rows**: Hover highlights with light background
- **Borders**: 1px gray between rows
- **Padding**: 12px per cell

### Badges
- **Style**: Small rounded boxes with colored background and text
- **Types**: Success (green), Warning (amber), Error (red), Info (blue)
- **Text**: Uppercase, 12px, weight 600, letter-spacing 0.5px

## Navigation Interactions

### Active State
- Desktop: Left border (3px blue) + blue text + blue background (10% opacity)
- Tablet: Bottom border (3px blue) + blue text
- Mobile: Same as tablet

### Hover State
- Light background color
- Text changes to primary color
- Smooth transition (0.2s)

### Sidebar Toggle (Mobile)
- Hamburger menu icon (☰)
- Appears at top-left when sidebar closed
- Closes automatically when navigation item clicked

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **ARIA Labels**: Buttons, navigation items have labels
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Color Contrast**: Text meets WCAG AA standards
- **Focus Indicators**: Blue outline on focused elements
- **Link Colors**: Blue (#3b82f6) visible against white background
- **Font Sizing**: Base 14px is easily readable

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Main layout wrapper
│   │   ├── Header.jsx         # Header component
│   │   ├── Sidebar.jsx        # Sidebar with navigation
│   │   ├── NavSection.jsx     # Section container
│   │   ├── NavItem.jsx        # Menu item
│   │   ├── Footer.jsx         # Footer component
│   │   └── [component].css    # Corresponding styles
│   ├── pages/
│   │   ├── Dashboard.jsx      # Dashboard page
│   │   ├── Transfers.jsx      # Transfers list
│   │   ├── Reclaimable.jsx    # Reclaimable transfers
│   │   ├── Recovery.jsx       # Recovery transfers
│   │   ├── Accounts.jsx       # Accounts list
│   │   └── [page].css         # Page styles
│   ├── App.jsx                # Main app with routing
│   ├── App.css                # App styles
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── .gitignore                 # Git ignore rules
```

## Key Features

### 1. Responsive Design
- Mobile-first approach with 3 breakpoints
- Sidebar transitions from full to icon-only to drawer
- All content reflows appropriately

### 2. Reclaimable Transfers Support
- Dedicated menu items for reclaimable and recovery transfers
- Separate pages to manage both transfer types
- Status badges to indicate recovery state

### 3. React Router Integration
- Client-side routing with React Router v6
- All navigation uses React Link components
- Active route tracking for sidebar highlighting

### 4. Component Reusability
- NavItem component reused for all menu items
- NavSection component used for all navigation sections
- Common.css for shared page styles

### 5. Professional Styling
- Consistent spacing and typography
- Subtle shadows and hover effects
- Color-coded status indicators
- Proper visual hierarchy

## Running the Application

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Development server runs on `http://localhost:3000`

## Notes

- This is a **layout-focused frontend** with mock data
- Ready for API integration to fetch real data
- All pages have placeholder content that can be replaced with API calls
- Component structure is clean and maintainable
- Styling is modular with shared CSS utility classes
