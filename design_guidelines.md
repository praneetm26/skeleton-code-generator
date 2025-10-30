# Skeleton Code Generator - Design Guidelines

## Design Approach
**Selected Approach**: Brand-Specific Custom Design (PwC Theme)
This application requires strict adherence to PwC's corporate identity with warm orange/red tones, professional presentation, and clean minimalism reflecting enterprise software quality.

## Color Palette
**Primary Colors**:
- PwC Orange: `#d04a02` (primary actions, active states, highlights)
- Red Accent: `#e0301e` (secondary highlights)
- Dark Red: `#a32020` (hover states, emphasis)
- Deep Red: `#660000` (text emphasis, borders)

**Neutral Colors**:
- Background: `#ffffff` (main background)
- Light Gray: `#f5f5f5` (section backgrounds, inactive states)
- Text: Standard dark grays for body text and headings

## Typography
**Font Families**: 
- Primary: Helvetica Neue, Arial, sans-serif (clean, professional sans-serif)
- Use system font stack for optimal performance

**Type Scale**:
- Hero/Page Title: text-4xl (36px) - font-bold
- Section Headers: text-2xl (24px) - font-semibold
- Form Labels: text-sm (14px) - font-medium, uppercase tracking
- Body Text: text-base (16px) - font-normal
- Helper Text: text-sm (14px) - text-gray-600

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: `p-2`, `m-2` (8px)
- Standard spacing: `p-4`, `gap-4` (16px)
- Section spacing: `p-6`, `p-8` (24px-32px)
- Large spacing: `p-12`, `p-16` (48px-64px)

**Grid Structure**:
- Sidebar: Fixed width 280px on desktop (w-70)
- Main Content: flex-1 with max-width container
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Component Library

### Sidebar Navigation
- Fixed left sidebar (280px width on desktop)
- Three vertical steps with numbers and labels
- Active step highlighted with PwC orange background
- Completed steps with checkmark icons
- Inactive steps in light gray
- Smooth step transitions
- Mobile: Collapses to horizontal stepper at top

### Form Components
**Input Fields**:
- White background with subtle gray border (border-gray-300)
- Rounded corners: `rounded-md` (6px)
- Padding: `px-4 py-3`
- Focus state: Orange border (border-[#d04a02]) with ring
- Labels above inputs with spacing of 2 units

**File Upload**:
- Dashed border dropzone area
- Upload icon and "Drop YAML file or click to browse" text
- File type validation visual feedback
- Shows uploaded filename with remove option
- Accept only .yaml and .yml files

**Select Dropdowns**:
- Custom styled selects matching input design
- Chevron down icon on right
- Dynamic options that change based on previous selections (framework depends on language)
- Hover state with light gray background

**Checkboxes**:
- Custom checkbox with PwC orange when checked
- Label text adjacent with clickable area
- Used for "Generate Unit Test Cases?" option

**Primary Button** ("Generate Project"):
- Background: PwC Orange (#d04a02)
- Large size: `px-8 py-4`, `text-lg`
- Rounded: `rounded-lg`
- White text with font-semibold
- Hover: Darker shade (#a32020) with subtle lift (transform)
- Active/Loading: Disabled state with spinner
- Full width on mobile, auto width on desktop

### Main Form Layout
**Container Structure**:
- Two-column layout on desktop (sidebar + main)
- Single column stack on mobile
- Main content area: `max-w-3xl` centered with padding
- White background cards with subtle shadows (shadow-sm)
- Each configuration section in separate card with spacing

**Form Sections**:
1. **Project Configuration Card**:
   - Project Name input
   - Swagger File upload area

2. **Language & Framework Card**:
   - Language selector (radio buttons or styled select)
   - Framework selector (dynamically filtered)
   - Database selector

3. **Testing Setup Card**:
   - Checkbox for unit test generation
   - Test framework selector (conditional visibility)

### Visual Hierarchy
- Page header with logo area and title
- Clear section dividers using whitespace (not lines)
- Form fields grouped logically in cards
- Progressive disclosure: testing framework only shows when checkbox enabled
- Visual feedback on all interactions (hover, focus, active states)

## Responsive Behavior
**Desktop (lg and above)**:
- Sidebar fixed on left
- Form in main content area with comfortable width
- Two-column inputs where appropriate

**Tablet (md)**:
- Sidebar remains but narrower
- Single-column form inputs
- Maintain card-based structure

**Mobile (sm and below)**:
- Sidebar becomes horizontal stepper at top
- Full-width form fields
- Stack all elements vertically
- Larger touch targets (min 44px height)
- Bottom-fixed "Generate" button

## Interactions & States
**Form Validation**:
- Real-time validation on blur
- Error states: Red border and error text below field
- Success states: Subtle green indicator
- Required field indicators (asterisks)

**Loading States**:
- Button shows spinner during ZIP generation
- Disable form during processing
- Progress indicator for file upload

**Download Trigger**:
- Automatic ZIP download on successful generation
- Success message with download confirmation
- Error handling with user-friendly messages

## Accessibility
- Semantic HTML structure
- ARIA labels for all interactive elements
- Keyboard navigation support (tab order follows visual flow)
- Focus indicators visible and PwC-orange colored
- Error messages announced to screen readers
- Minimum contrast ratios maintained

## Professional Polish
- Subtle shadows on cards: `shadow-sm` (not aggressive)
- Rounded corners throughout: `rounded-md` to `rounded-lg`
- Smooth transitions: `transition-all duration-200`
- Hover states on all clickable elements
- Clean, spacious design with breathing room
- No animations except subtle transitions and button hovers
- Professional, trustworthy appearance befitting enterprise software