# Midas Observe > Transfers Canvas - Design Document

## 🎮 Design Philosophy: Fallout Retro-Futuristic UI

This design follows the iconic Fallout UI aesthetic:
- **Color Palette**: Monochrome greens/yellows on dark backgrounds (CRT monitor effect)
- **Typography**: Monospace fonts (Courier New, OCR-A style)
- **Borders**: Scanline effects, beveled edges, terminal aesthetics
- **Interaction**: Minimalist, clean, retro-futuristic

---

## 📊 Canvas Layout - UML Sequence Diagram Style

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MIDAS | Observe > Transfers [Canvas - Read Only]                       ✕   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Sources            Timeline             Accounts              Sinks         │
│                                                                               │
│  ┌──────────┐       ╎              ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Employer │       ║              │ Checking │  │ Savings  │  │ Rent     │ │
│  │   ABC    │       ║              │          │  │          │  │  Expense │ │
│  │ (Green)  │       ║              │ (Yellow) │  │ (Yellow) │  │  (Red)   │ │
│  └──────────┘       ║              └──────────┘  └──────────┘  └──────────┘ │
│       ↓             ║                    ↑             ↑              ↑      │
│       └─────────────╋────────────────────┘             │              │      │
│                     ║                                  │              │      │
│  ┌──────────┐       ║                     ┌────────────┘              │      │
│  │ Freelance│       ║                     ↓                          │      │
│  │ Income   │       ║              ┌──────────┐                      │      │
│  │ (Green)  │       ║              │ Emergency│                      │      │
│  └──────────┘       ║              │ Fund     │                      │      │
│       ↓             ║              │ (Yellow) │                      │      │
│       └─────────────╋──────────────┤          │                      │      │
│                     ║              └──────────┘                      │      │
│                     ║                    ↓                           │      │
│                     ║                    └───────────────────────────┘      │
│                     ║                                                       │
│  (Striped Timeline Bar indicating sequence passage)                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Design Elements

#### 1. **Sources Column** (Left)
- **Background**: Dark (scanline effect)
- **Elements**: Rectangular boxes (140px width)
- **Color**: Fallout Green (#0DF500 with glow)
- **Font**: Monospace, 12px, uppercase
- **Border**: Beveled, 2px, glowing effect
- **Glow**: Subtle green shadow/aura
- **Spacing**: 20px between sources vertically

#### 2. **Timeline (Center)**
- **Visual**: Vertical striped line (animated diagonal stripes)
- **Width**: 2-4px
- **Color**: Fallout Yellow (#FFD700)
- **Animation**: Diagonal stripes moving downward (gives "time passing" effect)
- **Pattern**: ▓▓░░▓▓░░ repeating pattern
- **Glow**: Subtle yellow glow

#### 3. **Accounts Column** (Center-Right)
- **Background**: Dark
- **Elements**: Rectangular boxes (140px width each)
- **Color**: Fallout Yellow (#FFD700)
- **Font**: Monospace, 12px, uppercase
- **Border**: Beveled, 2px
- **Spacing**: 15px between accounts horizontally
- **Arrangement**: Vertically stacked, side-by-side

#### 4. **Sinks Column** (Right)
- **Background**: Dark
- **Elements**: Rectangular boxes (140px width)
- **Color**: Fallout Red (#FF0000 with strong glow)
- **Font**: Monospace, 12px, uppercase
- **Border**: Beveled, 2px, strong glowing effect
- **Glow**: Strong red shadow/aura (more prominent than sources)
- **Spacing**: 20px between sinks vertically

#### 5. **Connection Lines** (Arrows/Paths)
- **Style**: Diagonal lines connecting sources → accounts → sinks
- **Color**: Fallout Green for source transfers
- **Color**: Fallout Red for sink transfers
- **Animation**: Subtle pulsing/glow along lines
- **Thickness**: 2px
- **Markers**: Arrowheads at end

---

## 🎨 Fallout Color Palette (Retro Green/Yellow/Red)

```javascript
const FalloutColors = {
  // Primary colors (from Fallout games)
  green: '#0DF500',        // Source green (bright, neon)
  yellow: '#FFD700',       // Account yellow (fallout vault-tec gold)
  red: '#FF0000',          // Sink red (terminal error red)
  
  // Dark backgrounds
  darkBg: '#0A0E27',       // Very dark navy-blue (CRT monitor)
  darkerBg: '#050A15',     // Even darker
  
  // Text colors
  textGreen: '#00FF00',    // Matrix-style green
  textYellow: '#FFD700',   // Gold text
  textWhite: '#FFFFFF',    // Pure white for contrast
  
  // Glow/Shadow colors
  glowGreen: 'rgba(13, 245, 0, 0.5)',
  glowYellow: 'rgba(255, 215, 0, 0.3)',
  glowRed: 'rgba(255, 0, 0, 0.6)',
}
```

---

## 🖥️ Canvas Specifications

### Canvas Dimensions
- **Width**: Full viewport width (responsive)
- **Height**: Min 600px, scrollable if needed
- **Padding**: 40px on all sides
- **Background**: Dark with subtle scanline pattern

### Element Sizing
- **Source/Sink/Account Boxes**: 140px wide × 80px height
- **Minimum Column Spacing**: 80px between source → timeline, timeline → accounts, accounts → sinks
- **Horizontal Account Spacing**: 15px between accounts
- **Vertical Spacing**: 20-30px between rows

### Grid/Alignment
- **Vertical Alignment**: Center sources, accounts, sinks vertically
- **Horizontal Alignment**: Even distribution across canvas width
- **Timeline**: Runs vertically down the middle of the canvas

---

## 🎯 Interaction Model

### Read-Only Visualization
- **No drag-drop**: Canvas is read-only
- **Hover Effects**: 
  - Boxes glow brighter on hover
  - Connection lines highlight on hover
  - Tooltip shows transfer details
- **Click Handling**:
  - Click on box → Show transfer details in sidebar/panel
  - Click on line → Show transfer record details
- **Zoom/Pan**: (Optional) Allow canvas pan/zoom for large datasets

### Information Display
- **Box Hover**: Shows account/source/sink name and balance
- **Line Hover**: Shows transfer amount, date, status
- **Sidebar Panel** (optional): Shows detailed transfer info

---

## 🔧 Technology Approach

### Canvas Rendering
1. **SVG-based** (Recommended for vector graphics)
   - Sharp lines, scalable
   - Good animation support
   - Easy to update with new data
   - Better for UML-style diagrams

2. **HTML Canvas API** (Alternative)
   - Better performance with many elements
   - More low-level control
   - Harder to make interactive

3. **React Component with SVG** (Best for integration)
   - React state management for data
   - SVG rendering for visuals
   - Responsive and maintainable

### Animation Strategy
- **Striped Timeline**: CSS animation or SVG animation
- **Glowing Effects**: CSS box-shadow with animation
- **Pulse Effects**: Subtle opacity/glow changes on hover

---

## 📐 Data Flow Logic

### Canvas Data Structure
```javascript
const canvasData = {
  sources: [
    { id: 'src1', name: 'Employer ABC', color: 'green' },
    { id: 'src2', name: 'Freelance Income', color: 'green' },
  ],
  accounts: [
    { id: 'acc1', name: 'Checking', color: 'yellow', balance: 5000 },
    { id: 'acc2', name: 'Savings', color: 'yellow', balance: 12000 },
    { id: 'acc3', name: 'Emergency Fund', color: 'yellow', balance: 8000 },
  ],
  sinks: [
    { id: 'sink1', name: 'Rent Expense', color: 'red' },
    { id: 'sink2', name: 'Utilities', color: 'red' },
  ],
  transfers: [
    { 
      from: 'src1', 
      to: 'acc1', 
      amount: 3000, 
      date: '2024-01-15',
      type: 'income'
    },
    {
      from: 'acc1',
      to: 'sink1',
      amount: 1200,
      date: '2024-01-20',
      type: 'reclaimable',
      status: 'pending_recovery'
    },
  ]
}
```

---

## 🎨 Mockup Strategy (Playwright)

### Mockup Approach
1. **Static HTML mockup** - Create a static HTML/CSS version showing the design
2. **Playwright screenshots** - Generate mockup images
3. **User feedback** - Validate design before React implementation

### Mockup File Structure
```
mockups/
├── transfers-canvas-mockup.html      # Static mockup
├── fallout-theme.css                 # Fallout styling
└── transfers-canvas-mockup.png       # Screenshot (generated by Playwright)
```

---

## 🚀 Implementation Plan

### Phase 1: Design & Mockup (This Phase)
- ✅ Create design document (THIS FILE)
- ✅ Create static HTML mockup
- ✅ Generate Playwright screenshots
- ✅ Validate design visually

### Phase 2: React Component (Next Phase)
- Create `ObserveTransfersCanvas.jsx` component
- Implement SVG rendering with React
- Add hover/interaction effects
- Wire to backend API for real data

### Phase 3: Integration
- Add "Observe" category to sidebar
- Add "Transfers" menu point
- Integrate with main app routing
- Connect to real transfer data

---

## 📝 Design Assumptions

1. **Read-Only Visualization** - No editing or creation from canvas
2. **SVG Rendering** - Use SVG for clean vector graphics
3. **Fallout Retro Aesthetic** - Match the iconic green/yellow/red color scheme
4. **UML Sequence Diagram Layout** - Left-to-right flow (Sources → Accounts → Sinks)
5. **Responsive Design** - Adapts to viewport width
6. **Animation** - Subtle, not distracting (matches Fallout minimalism)
7. **Dark Theme** - Matches Fallout terminal aesthetic
8. **Monospace Font** - Terminal/retro feel (Courier New, OCR-A if available)

---

## Next Steps

1. Create static HTML mockup with Fallout styling
2. Generate Playwright screenshots
3. Present mockups for validation
4. Build React component based on approved design
5. Integrate into Midas frontend
