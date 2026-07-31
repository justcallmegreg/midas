# Midas Frontend Layout

This directory contains a **copyable, production-ready UI layout** for the Midas financial management system.

## 📁 What's Included

### `layout-template.html` ⭐
A **complete, standalone HTML file** with embedded CSS containing:

- **Sticky Header** (60px) - Logo, title, user menu
- **Responsive Sidebar** (250px → 70px → drawer)
  - ACCOUNTS section (5 items)
  - TRANSACTIONS section (4 items, including Reclaimable & Recovery)
  - REPORTS section (4 items)
  - SETTINGS section (4 items)
- **Content Area** - Full-width responsive layout
- **Data Table** - Example table with filtering and pagination
- **Footer** (60px) - Status, links, version

### Documentation Files
- `LAYOUT_REFERENCE.md` - Complete specifications and design system
- `UI_DISCOVERY.md` - Architecture details
- `REACT_COMPONENTS_GUIDE.md` - React implementation examples

## 🚀 Quick Start

1. **Open in browser**: Double-click `layout-template.html` or open in your browser
2. **Inspect & copy**: All code is in one file - easy to inspect and extract
3. **Customize**: Modify CSS variables or HTML structure as needed

## 🎨 Design System

**Color Variables** (CSS):
```css
--primary-color: #1a365d;      /* Dark blue */
--accent-color: #3b82f6;       /* Bright blue */
--success-color: #10b981;      /* Green */
--warning-color: #f59e0b;      /* Amber */
--error-color: #ef4444;        /* Red */
```

**Responsive Breakpoints**:
- Desktop: 1200px+ (full layout)
- Tablet: 768px-1199px (sidebar collapses to icons)
- Mobile: <768px (sidebar becomes drawer)

## 📋 Features

✅ Fully responsive (mobile-first)  
✅ Accessibility-friendly (semantic HTML, ARIA labels)  
✅ No dependencies (pure HTML/CSS)  
✅ Easy to customize  
✅ Production-ready  
✅ Can be used with any framework (React, Vue, Svelte, etc.)  

## 🔄 How to Use

### Option 1: Copy the entire HTML file
Use `layout-template.html` as your base and modify content

### Option 2: Extract HTML structure
Copy the DOM structure into your framework of choice

### Option 3: Extract CSS only
Use the stylesheet in your existing project

## 📱 Layout Structure

```
┌─────────────────────────────────────┐
│  Header (sticky)  M Midas           │
├──────────┬────────────────────────┤
│          │                         │
│ Sidebar  │  Content Area          │
│ (250px)  │  (responsive)          │
│          │                         │
├──────────┴────────────────────────┤
│  Footer - Status | Version | Links │
└─────────────────────────────────────┘
```

## 🎯 Navigation Structure

```
ACCOUNTS
├─ Dashboard
├─ My Accounts
├─ Money Sources
├─ Money Sinks
└─ Categories

TRANSACTIONS
├─ Transfers
├─ New Transfer
├─ Reclaimable (Account→Sink recovery pending)
└─ Recovery (Source→Account refund processed)

REPORTS
├─ Overview
├─ Spending
├─ Income
└─ History

SETTINGS
├─ Preferences
├─ Security
├─ API Keys
└─ Logout
```

## 💡 Customization Tips

1. **Change colors**: Update CSS variable values in the `<style>` tag
2. **Adjust sidebar width**: Change `grid-template-columns: 250px 1fr;` to desired width
3. **Add/remove menu items**: Duplicate/remove `<a class="sidebar-item">` elements
4. **Update header**: Modify `.header-left` and `.header-right` sections
5. **Customize table columns**: Add/remove `<th>` and `<td>` elements

## 📖 Documentation

- For design specifications: see `LAYOUT_REFERENCE.md`
- For React integration: see `REACT_COMPONENTS_GUIDE.md`
- For architecture details: see `UI_DISCOVERY.md`
