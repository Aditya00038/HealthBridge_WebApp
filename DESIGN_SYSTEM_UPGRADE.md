# Design System Upgrade - Book Appointment & Locate Pages

## Design Philosophy
- **Clean & Minimal**: Remove clutter, focus on essential elements
- **Professional**: Medical-grade trust and credibility
- **Modern**: Contemporary UI patterns and interactions
- **Accessible**: WCAG compliant with clear hierarchy
- **Responsive**: Mobile-first, works beautifully on all devices

## Color Palette

### Primary Colors
```css
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8
```

### Accent Colors
```css
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #06b6d4
```

### Neutral Colors
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-700: #374151
--gray-900: #111827
```

## Typography Scale
- Heading 1: 3rem (48px) - font-bold
- Heading 2: 2.25rem (36px) - font-bold
- Heading 3: 1.875rem (30px) - font-semibold
- Heading 4: 1.5rem (24px) - font-semibold
- Body Large: 1.125rem (18px) - font-normal
- Body: 1rem (16px) - font-normal
- Small: 0.875rem (14px) - font-normal

## Spacing System
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## Components

### Cards
```css
- Border radius: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover shadow: 0 10px 25px rgba(0,0,0,0.15)
- Padding: 24px
- Background: white
- Transition: all 0.3s ease
```

### Buttons
```css
Primary:
- Background: gradient from blue-600 to blue-700
- Padding: 12px 24px
- Border radius: 12px
- Font weight: 600
- Shadow: soft
- Hover: lift effect + darker gradient

Secondary:
- Background: white
- Border: 2px solid gray-300
- Hover: gray-50 background
```

### Input Fields
```css
- Height: 48px
- Border radius: 12px
- Border: 2px solid gray-200
- Focus: blue ring
- Padding: 12px 16px
- Font size: 16px
```

## Implementation Plan

### Book Appointment Page
1. Hero section with gradient background
2. Clean search bar with autocomplete
3. Modern filter chips (instead of dropdowns)
4. Grid layout for doctor cards
5. Floating action buttons
6. Skeleton loading states

### Locate Page
1. Split layout (Map + List)
2. Interactive map markers
3. Location cards with distance
4. Quick filters
5. Real-time search
6. Geolocation button
