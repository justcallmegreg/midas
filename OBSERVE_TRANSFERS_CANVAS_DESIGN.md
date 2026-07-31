# Observe > Transfers Canvas - Design Specification

**Status**: Phase 1 Complete - Design & Mockup Only  
**Phase**: Design & Visual Validation (Brainstorm → Mockup → Feedback)  
**Next Phase**: React Implementation (deferred, requires design approval)

---

## Executive Summary

This document specifies the design for the **Observe > Transfers** view in Midas - a Fallout-inspired UML sequence diagram canvas visualizing the flow of financial transfers from Sources through Accounts to Sinks.

### What This Is
- ✅ Design specification with technical details
- ✅ Interactive HTML mockup (transfers-canvas-mockup.html)
- ✅ Visual validation guide
- ✅ Rationale for design decisions

### What This Is NOT
- ❌ React component implementation
- ❌ Sidebar navigation changes
- ❌ Backend integration
- ❌ App routing or styling system changes
- ❌ Any modifications to existing frontend code

---

## Design Vision

**Goal**: Create a professional, visually distinctive view of financial transfer flows using a Fallout retro-futuristic aesthetic.

**Approach**: UML sequence diagram layout with animated timeline, showing:
- **Left**: Sources (income, green glow)
- **Center**: Animated timeline (striped, yellow)
- **Middle**: Accounts (storage, yellow)
- **Right**: Sinks (expenses, red glow)

**Aesthetic**: Fallout video game UI style - neon glows, dark CRT background, monospace fonts, scanlines.

---

## Visual Layout

### Conceptual Diagram

```
┌──────────────────────────────────────────────────────────────┐
│ MIDAS | OBSERVE > TRANSFERS [SEQUENCE DIAGRAM]              │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Sources    Timeline      Accounts        Sinks              │
│  (Green)   (Animated)    (Yellow)        (Red)              │
│                                                                │
│  ┌─────┐       ║       ┌─────┐ ┌─────┐  ┌─────┐           │
│  │Src 1│───────╋──────→│Acc1 │ │Acc2 │─→│Sink1│           │
│  └─────┘       ║       └─────┘ └─────┘  └─────┘           │
│       ↓        ║                                              │
│  ┌─────┐       ║       ┌─────┐             ┌─────┐         │
│  │Src 2│───────╋──────→│Acc3 │────────────→│Sink2│         │
│  └─────┘       ║       └─────┘             └─────┘         │
│       ↓        ║                                              │
│  ┌─────┐       ║       ┌─────┐                             │
│  │Src 3│───────╋──────→│Acc4 │                             │
│  └─────┘       ║       └─────┘                             │
│                ║ (Time →)                                    │
├──────────────────────────────────────────────────────────────┤
│ Legend: 🟢 Sources | 🟡 Accounts | 🔴 Sinks                │
└──────────────────────────────────────────────────────────────┘
```

### Canvas Dimensions

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Canvas Width | 1920px | 1024px | 375px |
| Canvas Height | 1080px | 768px | Auto (scrollable) |
| Box Width | 140px | 100px | 80px |
| Box Height | 60px | 45px | 40px |
| Column Spacing | 200px | 120px | 90px |
| Row Spacing | 140px | 100px | 80px |

---

## Color Palette (Fallout Aesthetic)

### Primary Colors

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| **Sources** | Neon Green | #0DF500 | Income/Inflow |
| **Accounts** | Fallout Gold | #FFD700 | Storage/Neutral |
| **Sinks** | Neon Red | #FF0000 | Expense/Outflow |

### Secondary Colors

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| Background | Dark CRT | #0A0E27 | Canvas background |
| Text | Light Gray | #E0E0E0 | Labels and text |
| Grid Lines | Dim Green | #0D4F00 | Optional grid |
| Glow/Shadow | Dynamic | Varies | Neon effects |

### Effects

- **Glow**: 0 0 20px rgba(color, 0.8) (box shadow)
- **Hover Glow**: 0 0 30px rgba(color, 1.0) (enhanced)
- **Scanlines**: Semi-transparent horizontal lines, repeating every 2px
- **Timeline Stripes**: Diagonal stripes, 10px spacing, animated downward

---

## Component Specifications

### Source Box
- **Size**: 140×60px (desktop)
- **Color**: #0DF500 (neon green)
- **Border**: 2px solid green with rounded corners (4px)
- **Glow**: `box-shadow: 0 0 20px rgba(13, 245, 0, 0.8)`
- **Text**: Monospace, 12px, bold, uppercase
- **Hover**: 
  - Scale: 1.05x
  - Glow: `0 0 30px rgba(13, 245, 0, 1.0)`
  - Transition: 0.2s ease

### Account Box
- **Size**: 140×60px (desktop)
- **Color**: #FFD700 (fallout gold)
- **Border**: 2px solid gold with rounded corners (4px)
- **Text**: Monospace, 12px, regular, uppercase
- **No glow** (neutral storage)
- **Hover**: 
  - Scale: 1.05x
  - Border highlight
  - Transition: 0.2s ease

### Sink Box
- **Size**: 140×60px (desktop)
- **Color**: #FF0000 (neon red)
- **Border**: 2px solid red with rounded corners (4px)
- **Glow**: `box-shadow: 0 0 20px rgba(255, 0, 0, 0.8)` (always glowing)
- **Text**: Monospace, 12px, bold, uppercase
- **Hover**: 
  - Scale: 1.05x
  - Glow: `0 0 30px rgba(255, 0, 0, 1.0)`
  - Transition: 0.2s ease

### Timeline (Vertical Bar)
- **Position**: Center column between Sources and Accounts
- **Width**: 30px
- **Height**: Full canvas height
- **Pattern**: Diagonal yellow stripes (#FFD700)
- **Stripe Width**: 10px
- **Stripe Angle**: 45°
- **Animation**: Stripes move downward at 2px/second
- **Loop Duration**: Infinite
- **Effect**: Represents "time passing" in sequence

### Connection Lines (SVG)
- **Type**: Straight lines with arrowheads
- **Color for Income**: #0DF500 (green) - from Source
- **Color for Expense**: #FF0000 (red) - to Sink
- **Stroke Width**: 2px
- **Hover**: 
  - Opacity: 1.0 (highlight)
  - Glow effect (optional)
  - Stroke width: 3px

### Scanlines (Background Effect)
- **Type**: Horizontal lines overlay
- **Spacing**: 2px
- **Opacity**: 0.05 (subtle)
- **Color**: #FFFFFF (white)
- **Animation**: None (static, subtle effect)

---

## Typography

### Fonts
- **Primary**: Courier New (monospace)
- **Fallback**: "Courier New", monospace
- **Weight**: 400 (regular) or 700 (bold)
- **Style**: Uppercase

### Font Sizes
| Element | Size | Weight |
|---------|------|--------|
| Box Labels | 12px | Bold |
| Legend | 11px | Regular |
| Header | 24px | Bold |
| Timestamps (optional) | 10px | Regular |

---

## Animations

### Timeline Animation
```
Animation: stripe-move
Duration: 8s
Direction: Down
Pattern: Repeating diagonal stripes
Effect: Continuous scrolling down
Loop: Infinite
Easing: Linear
```

### Scanline Animation (Optional)
```
Animation: scanlines
Duration: 0.1s
Effect: Very subtle flicker (authentic CRT look)
Loop: Infinite
Opacity: 0.03 - 0.08 (flickers between)
```

### Hover Effects
```
Duration: 0.2s
Easing: ease-in-out
Properties: 
  - transform: scale(1.05)
  - box-shadow: enhanced glow
  - opacity: 1.0 (if dimmed)
```

---

## Responsive Design

### Breakpoints

| Viewport | Width | Height | Behavior |
|----------|-------|--------|----------|
| **Desktop** | 1200px+ | 800px+ | Full layout, all entities visible |
| **Tablet** | 768-1199px | 600-800px | Reduced box sizes, scrollable horizontally |
| **Mobile** | <768px | Any | Stacked or carousel view, scrollable |

### Responsive Adjustments

**Desktop (1920×1080)**
- Box size: 140×60px
- Column spacing: 200px
- Row spacing: 140px
- All entities visible in viewport

**Tablet (1024×768)**
- Box size: 100×45px
- Column spacing: 120px
- Row spacing: 100px
- Horizontal scrolling may be required

**Mobile (375×667)**
- Box size: 80×40px
- Column spacing: 90px
- Row spacing: 80px
- Vertical scrolling enabled
- Legend at bottom

---

## Data Structure (API Response Expected)

### Sources Array
```json
{
  "id": "src-001",
  "type": "source",
  "name": "Employer ABC",
  "description": "Monthly salary"
}
```

### Accounts Array
```json
{
  "id": "acc-001",
  "name": "Checking Account",
  "balance": 5234.50,
  "currency": "EUR"
}
```

### Sinks Array
```json
{
  "id": "sink-001",
  "type": "sink",
  "name": "Rent",
  "description": "Monthly rent"
}
```

### Transfers Array
```json
{
  "id": "xfer-001",
  "ingress_id": "src-001",
  "ingress_type": "source",
  "egress_id": "acc-001",
  "egress_type": "account",
  "amount": 3000.00,
  "date": "2024-01-15T10:00:00Z"
}
```

---

## User Interactions

### Hover
- **Sources**: Enhanced green glow, scale 1.05x
- **Accounts**: Scale 1.05x, border highlight
- **Sinks**: Enhanced red glow, scale 1.05x
- **Lines**: Increase opacity, stroke width, highlight color

### Click
- **Sources/Accounts/Sinks**: Display detailed information panel (future enhancement)
- **Lines**: Show transfer details (future enhancement)

### Scroll
- Canvas is scrollable on small viewports
- SVG lines recalculate on window resize
- Timeline animation continues unaffected

---

## Known Limitations (Mockup)

1. **SVG Line Recalculation**: Lines computed on load/resize only, not after hover transform
   - **Fix in Real Implementation**: Use fixed anchor points or recalculate on transform

2. **Hover Scale Detach**: When box scales on hover (1.05x), connection lines visually detach
   - **Fix in Real Implementation**: Anchor lines to fixed endpoints, not box edges

3. **Scroll Desync**: Canvas has `overflow: auto`, but line positions use `getBoundingClientRect()` relative to canvas
   - **Fix in Real Implementation**: Use absolute positioning or adjust coordinate system

4. **No Filter/Search**: Mockup shows all entities; filtering/search to be added in Phase 2

5. **Static Data**: Mockup uses hardcoded example data; real implementation will fetch from API

---

## Implementation Notes for Phase 2

### Technology Stack
- **Framework**: React 18+
- **Rendering**: SVG with React
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Performance**: Memoization for large transfer counts

### Performance Targets
- **Small Dataset**: 0-50 entities - no optimization needed
- **Medium Dataset**: 50-500 entities - memoize components, lazy render lines
- **Large Dataset**: 500+ entities - implement virtual scrolling, on-demand rendering

### File Structure (Phase 2)
```
frontend/src/
├── pages/
│   └── ObserveTransfersCanvas.jsx (new)
├── components/
│   └── Canvas/
│       ├── Canvas.jsx (container)
│       ├── CanvasBox.jsx (entity box)
│       ├── CanvasLine.jsx (transfer line)
│       ├── CanvasTimeline.jsx (timeline bar)
│       └── Canvas.css (fallout styling)
├── api/
│   └── observe.js (API functions)
└── hooks/
    └── useCanvasData.js (data fetching)
```

### Sidebar Integration (Phase 2)
- Add "OBSERVE" category to Sidebar
- Add "Transfers" (🔄) menu point
- Route to `/observe/transfers`
- Consider Fallout theme for entire app or just this section

---

## Mockup Files

### Interactive Mockup
- **File**: `mockups/transfers-canvas-mockup.html` (14.7 KB)
- **How to Open**: Direct in browser (no dependencies)
- **Features**: Fully interactive, animated, responsive
- **Testing**: Hover, click, resize browser to test

### Visual Validation Guide
- **File**: `mockups/VISUAL_VALIDATION.md` (8.3 KB)
- **Content**: Detailed visual element descriptions, testing checklist

### Screenshot Automation
- **File**: `mockups/playwright-mockup-screenshot.js` (3.5 KB)
- **How to Run**: 
  ```bash
  npm install -D @playwright/test
  node mockups/playwright-mockup-screenshot.js
  ```
- **Output**: 5 PNG screenshots (desktop, tablet, mobile, full, hover)

---

## Feedback Validation Checklist

Before proceeding to Phase 2, please verify:

- [ ] Visual design matches your Fallout vision
- [ ] UML sequence diagram layout is clear and intuitive
- [ ] Colors (green/yellow/red) are appropriate
- [ ] Animated timeline effect works well
- [ ] Scanline effect enhances retro aesthetic
- [ ] Responsive layout works on target devices
- [ ] Hover/click interactions are intuitive
- [ ] Information density is appropriate
- [ ] Performance expectations are realistic
- [ ] Fallout theme should apply to entire app or just Observe section?

---

## Next Steps

1. **View Mockup**: Open `mockups/transfers-canvas-mockup.html` in browser
2. **Test Interactions**: Hover, click, resize window
3. **Review Visual Validation**: Read `mockups/VISUAL_VALIDATION.md`
4. **Generate Screenshots**: Run Playwright script to capture responsive views
5. **Provide Feedback**: Share any design adjustments needed
6. **Approve Design**: Once satisfied, proceed to Phase 2 implementation

---

## Questions for Feedback

1. Does the sequence diagram layout clearly show financial flow?
2. Are the Fallout colors and effects distinctive and appropriate?
3. Should accounts be arranged horizontally (current) or in other layouts?
4. How many transfers should the real implementation support (100? 1000? 10000+)?
5. Should the Fallout theme apply to the entire app or only the Observe section?
6. What additional information should appear on hover (amount, date, description)?
7. Should there be filtering/search capabilities for large datasets?
8. Are there any other financial flow visualizations you'd like to see?

---

**Ready to Review**: Open `mockups/transfers-canvas-mockup.html` now!
