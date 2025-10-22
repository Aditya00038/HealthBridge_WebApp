# 🏥 Healthcare Design System - Professional Green Theme

## Color Palette - Healthcare Professional

### Primary Colors (Green - Trust & Health)
```
Primary Green: #10B981 (green-500) - Main actions, CTAs
Dark Green: #059669 (green-600) - Hover states
Deep Green: #047857 (green-700) - Active states
Light Green: #D1FAE5 (green-100) - Backgrounds, highlights
Emerald: #34D399 (green-400) - Accents, success states
```

### Secondary Colors (Clean Professional)
```
Pure White: #FFFFFF - Main backgrounds, cards
Off White: #F9FAFB (gray-50) - Subtle backgrounds
Light Gray: #F3F4F6 (gray-100) - Borders, dividers
Medium Gray: #E5E7EB (gray-200) - Input borders
Text Gray: #6B7280 (gray-500) - Secondary text
Dark Gray: #374151 (gray-700) - Primary text
Charcoal: #1F2937 (gray-800) - Headers, important text
Near Black: #111827 (gray-900) - Deep contrast
```

### Accent Colors
```
Success: #10B981 (green-500) - Available, confirmed
Warning: #F59E0B (amber-500) - Pending, caution
Error: #EF4444 (red-500) - Unavailable, errors
Info: #3B82F6 (blue-500) - Information badges
```

### Gradient Combinations
```
Hero Gradient: from-green-600 via-green-700 to-emerald-800
Card Hover: from-green-50 to-emerald-50
Button Primary: from-green-500 to-green-600
Success Gradient: from-green-400 to-emerald-500
```

## Typography Scale

### Headers
```
H1: 3.5rem (56px) - font-bold - text-gray-900
H2: 2.5rem (40px) - font-bold - text-gray-800
H3: 1.875rem (30px) - font-semibold - text-gray-800
H4: 1.5rem (24px) - font-semibold - text-gray-700
H5: 1.25rem (20px) - font-medium - text-gray-700
```

### Body Text
```
Large: 1.125rem (18px) - font-normal - text-gray-700
Base: 1rem (16px) - font-normal - text-gray-600
Small: 0.875rem (14px) - font-normal - text-gray-500
Tiny: 0.75rem (12px) - font-medium - text-gray-500
```

## Component Specifications

### Cards
```
Background: bg-white
Border: border-2 border-gray-100
Radius: rounded-2xl (16px)
Shadow: shadow-lg (soft, professional)
Hover: shadow-2xl + border-green-200
Padding: p-6 (24px)
```

### Buttons

#### Primary (CTA)
```
Background: bg-gradient-to-r from-green-500 to-green-600
Text: text-white font-bold
Radius: rounded-xl (12px)
Padding: px-8 py-4
Shadow: shadow-lg
Hover: from-green-600 to-green-700 + shadow-2xl + scale-[1.02]
```

#### Secondary
```
Background: bg-white
Text: text-green-600 font-semibold
Border: border-2 border-green-500
Radius: rounded-xl
Padding: px-6 py-3
Hover: bg-green-50
```

#### Outline
```
Background: transparent
Text: text-gray-700 font-medium
Border: border-2 border-gray-300
Hover: bg-gray-50 + border-gray-400
```

### Inputs & Forms
```
Background: bg-white
Border: border-2 border-gray-200
Radius: rounded-xl (12px)
Height: py-4 (48px)
Focus: ring-2 ring-green-500 border-green-500
Placeholder: text-gray-400
Text: text-gray-900 font-medium
```

### Badges & Pills
```
Available: bg-gradient-to-r from-green-500 to-green-600 text-white
Verified: bg-green-100 text-green-700 border-2 border-green-300
Rating: bg-amber-50 text-gray-900 border-2 border-amber-200
Info: bg-gray-100 text-gray-700 border border-gray-300
```

## Spacing System

### Section Spacing
```
Between major sections: mb-12 (48px)
Between subsections: mb-8 (32px)
Between elements: mb-6 (24px)
Between small items: mb-4 (16px)
Tight spacing: mb-3 (12px)
```

### Container Padding
```
Large screens: px-8 py-12
Medium screens: px-6 py-8
Mobile: px-4 py-6
```

## Healthcare-Specific Design Principles

### 1. Trust & Credibility
- Clean white backgrounds (reduces visual noise)
- Professional green accents (health, growth, safety)
- Ample white space (clarity, focus)
- Clear typography (readability, accessibility)

### 2. Calm & Comfort
- Soft shadows (gentle, non-aggressive)
- Rounded corners (friendly, approachable)
- Green color psychology (healing, tranquility)
- Minimal animations (stable, trustworthy)

### 3. Clarity & Simplicity
- Clear visual hierarchy (important info stands out)
- Simple iconography (universal understanding)
- Consistent spacing (predictable patterns)
- High contrast text (readability for all ages)

### 4. Professional Authority
- Bold headers (confidence)
- Structured layouts (organized, reliable)
- Quality imagery (professionalism)
- Verified badges (credentials, trust)

## Icon Usage

### Medical/Health Icons
```
Color: text-green-600
Size: h-6 w-6 (24px) for standard
Background: bg-green-100 p-3 rounded-xl (for prominence)
```

### UI Icons
```
Color: text-gray-600
Size: h-5 w-5 (20px) for standard
Hover: text-green-600 (for interactive)
```

## Accessibility Standards

### Contrast Ratios
- Text on white: Use gray-700+ (4.5:1 minimum)
- White text: Use on green-600+ (4.5:1 minimum)
- Important CTAs: Bold + high contrast

### Interactive Elements
- Min touch target: 44x44px
- Focus indicators: 2px ring-green-500
- Hover states: Clear visual feedback
- Disabled state: opacity-50 + cursor-not-allowed

## Animation Guidelines

### Transitions
```
Default: transition-all duration-300
Quick: duration-200
Smooth: duration-500
Ease: ease-in-out
```

### Hover Effects
```
Cards: scale-[1.01] + shadow increase
Buttons: scale-[1.02] + brightness increase
Icons: scale-110 or rotate-12
Links: color change + underline
```

### Loading States
```
Skeleton: bg-gray-200 animate-pulse
Spinner: border-green-500 animate-spin
Progress: bg-green-500 transition-all
```

## Mobile Responsiveness

### Breakpoints
```
Mobile: < 640px (sm)
Tablet: 640px - 1024px (sm-lg)
Desktop: > 1024px (lg+)
```

### Mobile Adjustments
```
Font sizes: -2 to -4px smaller
Padding: Reduce by 25-50%
Grid columns: 1 column on mobile
Touch targets: Minimum 44x44px
Spacing: Tighter (reduce by 25%)
```

## Healthcare UI Patterns

### Doctor Cards
- Large professional photo (trust)
- Prominent credentials (authority)
- Clear availability status (immediate info)
- Green CTA button (action)
- White background (clean, medical)

### Appointment Booking
- Step-by-step process (clarity)
- Visual calendar (easy selection)
- Time slots in grid (organization)
- Green confirmation (success)

### Search & Filters
- White input with green focus (clean)
- Icon-based filters (intuitive)
- Dropdown with hover states (interactive)
- Clear filter pills (transparency)

### Location/Map
- Green markers (health locations)
- White info cards (cleanliness)
- Distance badges (utility)
- Interactive hover states (engagement)
