# Midas Frontend - UI Layout Reference

This document describes the frontend UI structure for the Midas financial management system. Use this as a reference for replicating the layout in your chosen frontend framework.

## Overview

The frontend follows a classic 3-layout pattern:
- **Header**: Top navigation bar
- **Left Sidebar**: Navigation menu with categories
- **Content Area**: Main content display
- **Footer**: Bottom footer information

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├──────────────┬────────────────────────────────────────────┤
│              │                                              │
│  LEFT        │                                              │
│  SIDEBAR     │          CONTENT AREA                        │
│              │                                              │
│              │                                              │
├──────────────┴────────────────────────────────────────────┤
│                        FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo/Brand
│   ├── Title/App Name
│   ├── User Menu (Top Right)
│   └── Settings Icon
├── MainLayout
│   ├── Sidebar
│   │   ├── Navigation Section 1 (Accounts)
│   │   │   ├── Menu Item 1.1
│   │   │   ├── Menu Item 1.2
│   │   │   └── Menu Item 1.3
│   │   ├── Navigation Section 2 (Transactions)
│   │   │   ├── Menu Item 2.1
│   │   │   ├── Menu Item 2.2
│   │   │   └── Menu Item 2.3
│   │   └── Navigation Section 3 (Reports)
│   │       ├── Menu Item 3.1
│   │       ├── Menu Item 3.2
│   │       └── Menu Item 3.3
│   └── ContentArea
│       ├── Page Title/Breadcrumb
│       ├── Page Content
│       └── Page Footer/Pagination
└── Footer
    ├── Copyright
    ├── Links
    └── Status Indicators
```

## Component Specifications

### Header

**Location**: Top of page, full width
**Height**: ~60-70px
**Background**: Primary brand color (suggest: #1a365d or similar dark blue)
**Text Color**: White

**Contains**:
- Logo (left side, ~40x40px)
- App Title "Midas" (next to logo)
- Spacer
- User profile icon (right side)
- Settings/Logout menu (right side)
- Optional: notification bell

**Sticky**: Yes (stays at top when scrolling)

### Left Sidebar

**Location**: Left side, below header
**Width**: 250-280px (collapsible to ~70px on mobile)
**Height**: Full viewport - header height - footer height
**Background**: Light gray or white (#f7fafc or #ffffff)
**Border**: Right border (1px, light gray)

**Contains**:
- Midas logo/icon at top
- Multiple navigation sections (collapsible)
- Each section has a category title (e.g., "Accounts", "Transactions", "Reports")
- Menu items with icons and labels
- Search bar (optional)
- Collapse/Expand toggle button

**Navigation Sections**:

1. **Accounts**
   - Dashboard
   - My Accounts
   - Money Sources
   - Money Sinks
   - Categories

2. **Transactions**
   - Transfer List
   - New Transfer
   - Reclaimable Transfers
   - Recovery History
   - Pending Recoveries

3. **Reports & Analytics**
   - Overview
   - Spending Analysis
   - Income Analysis
   - Transfer History
   - Audit Log

4. **Settings** (below other sections)
   - Profile Settings
   - Security
   - Preferences
   - API Keys
   - Logout

**Styling**:
- Menu items: 40-48px height
- Icons: 20x20px, left aligned with 16px margin
- Text: 14px, medium weight when active, normal when inactive
- Active item: Background highlight (subtle blue or gray)
- Hover: Subtle background change
- Sub-items: 8px left padding indent

### Content Area

**Location**: Between header, sidebar, and footer
**Width**: 100% - sidebar width
**Padding**: 24px or 32px
**Background**: #f7fafc or white

**Contains** (page dependent):
- Page title
- Breadcrumb navigation (optional)
- Action buttons (Create New, Filter, Export, etc.)
- Search/filter bar
- Main content (table, cards, forms, etc.)
- Pagination (if applicable)

**Common Patterns**:

#### Table Page Layout
```
┌─────────────────────────────────────────┐
│ Page Title                               │
│ [Search] [Filter] [Export] [+ New]     │
├─────────────────────────────────────────┤
│ Table with columns                      │
│ Row 1                                   │
│ Row 2                                   │
│ Row 3                                   │
├─────────────────────────────────────────┤
│ Showing 1-10 of 50  [Prev] [1][2][3] [Next] │
└─────────────────────────────────────────┘
```

#### Form Page Layout
```
┌─────────────────────────────────────────┐
│ Page Title                               │
│ Form with multiple sections              │
│                                          │
│ Section 1                                │
│   [Input] [Input]                       │
│   [Input] [Input]                       │
│                                          │
│ Section 2                                │
│   [Input]                               │
│   [TextArea]                            │
│                                          │
│ [Save] [Cancel]                         │
└─────────────────────────────────────────┘
```

#### Dashboard Layout
```
┌─────────────────────────────────────────┐
│ Welcome, User Name                       │
├─────────────────────────────────────────┤
│ [Summary Card 1] [Summary Card 2]       │
│ [Summary Card 3] [Summary Card 4]       │
├─────────────────────────────────────────┤
│ Recent Transfers (Table)                │
├─────────────────────────────────────────┤
│ [Chart/Analytics]                       │
└─────────────────────────────────────────┘
```

### Footer

**Location**: Bottom of page, full width
**Height**: ~60px
**Background**: Dark gray (#2d3748 or similar)
**Text Color**: Light gray or white

**Contains**:
- Copyright notice
- Version number
- Links (Terms, Privacy, Help, etc.)
- Status indicators (API status, database status)
- Optional: Last updated timestamp

**Sticky**: No (scrolls with content)

## Color Scheme

### Suggested Palette

- **Primary**: #1a365d (Dark blue)
- **Secondary**: #2d3748 (Charcoal)
- **Accent**: #3b82f6 (Bright blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Background**: #f7fafc (Light gray)
- **Surface**: #ffffff (White)
- **Text Primary**: #1f2937 (Dark gray)
- **Text Secondary**: #6b7280 (Medium gray)
- **Border**: #e5e7eb (Light border)

## Typography

- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Body Text**: 14px, line-height 1.5
- **Page Title**: 28-32px, bold
- **Section Title**: 18-20px, semi-bold
- **Menu Items**: 14px, medium
- **Small Text**: 12px, regular
- **Labels**: 12px, medium, uppercase or title-case

## Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (sidebar collapses to icons)
- **Mobile**: < 768px (sidebar becomes drawer, hamburger menu)

## Accessibility

- All interactive elements have focus states
- Color is never the only differentiator
- Icons have aria-labels
- Forms have proper labels and error messages
- Content has proper heading hierarchy
- Keyboard navigation fully supported

## Spacing/Grid

Use a base spacing unit of 4px:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Common UI Elements

### Buttons

**Primary Button**:
- Background: #3b82f6
- Text: white
- Padding: 10px 16px
- Border radius: 6px
- Font weight: 500

**Secondary Button**:
- Background: transparent
- Border: 1px #3b82f6
- Text: #3b82f6
- Padding: 10px 16px

**Ghost Button**:
- Background: transparent
- Text: #3b82f6
- Padding: 10px 16px

### Form Inputs

- Border: 1px solid #e5e7eb
- Padding: 8px 12px
- Border radius: 4px
- Focus: 2px solid #3b82f6
- Font size: 14px

### Cards

- Background: white
- Border: 1px solid #e5e7eb
- Border radius: 8px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px or 24px

## Navigation Patterns

### Breadcrumb
```
Home > Accounts > My Accounts > Account Details
```

### Tabs
```
[Tab 1 (Active)] [Tab 2] [Tab 3]
```

### Pagination
```
[Prev] [1] [2] [3] [4] [5] [Next]
or
Showing 1-10 of 50 records
```

## Mobile Considerations

- Sidebar converts to hamburger menu drawer
- Header height increases slightly for touch targets
- Content padding reduces to 16px
- Tables convert to card-based layout or horizontal scroll
- Buttons increase to 44px minimum height for touch

## Example Page: Transfers List

```
┌──────────────────────────────────────────────────────────────────┐
│ Midas │ User Profile ⚙️                                           │
├──────────────┬───────────────────────────────────────────────────┤
│ Accounts     │ Transfers                                          │
│ ├─ Dashboard │ [Search...] [Filter] [Export] [+ New Transfer]   │
│ ├─ My Acc.   │                                                    │
│ ├─ Sources   │ ID      | From      | To        | Amount | Date   │
│ └─ Sinks     │ ─────────────────────────────────────────────────│
│ Transactions │ TRN001 | Account 1  | Sink 1    | $100   | 2024...│
│ ├─ Transfers │ TRN002 | Source 1   | Account 2 | $50    | 2024...│
│ ├─ New       │ TRN003 | Account 1  | Sink 2    | $75    | 2024...│
│ ├─ Reclaim   │ TRN004 | Source 2   | Account 1 | $100   | 2024...│
│ └─ Recovery  │                                                    │
│ Reports      │ Showing 1-4 of 4 records                          │
│ └─ ...       │ [Prev] [1] [Next]                                │
│ Settings     │                                                    │
│ └─ ...       │                                                    │
├──────────────┴───────────────────────────────────────────────────┤
│ © 2024 Midas | v1.0.0 | Status: OK                               │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Notes

- This layout is **framework-agnostic** - can be implemented in React, Vue, Svelte, etc.
- Use CSS Grid for the main layout (header, sidebar, content, footer)
- Sidebar can use `position: fixed` or flex layout
- Content area should be scrollable independently
- Consider using a UI component library (Material-UI, Shadcn/ui, Tailwind, etc.)
- Implement responsive design with media queries or CSS Grid auto-fit

## File Structure (Suggested)

```
frontend/
├── public/
│   ├── index.html
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   └── ...other components
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── TransfersList.jsx
│   │   ├── NewTransfer.jsx
│   │   └── ...other pages
│   ├── styles/
│   │   ├── globals.css
│   │   ├── layout.css
│   │   └── theme.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── LAYOUT_REFERENCE.md (this file)
```

---

**Last Updated**: 2024
**Version**: 1.0 Layout Reference
