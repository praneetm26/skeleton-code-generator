# Skeleton Code Generator

## Overview

The Skeleton Code Generator is a PwC-branded web application that enables users to generate project skeleton templates based on their technology stack preferences. Users can configure project details, select programming languages and frameworks, upload Swagger/OpenAPI specifications, and download a complete ZIP archive containing a ready-to-use project structure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Framework:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom PwC brand theming
- Design system follows PwC's corporate identity with warm orange/red accent colors (#d04a02, #e0301e)

**Component Structure:**
- Custom form components (FormField, FormSection, FileUploadZone) for consistent user input
- StepSidebar component provides visual progress tracking through a 3-step configuration process
- Responsive layout with fixed sidebar navigation on desktop, collapsible on mobile

**Design Principles:**
- Brand-specific custom design adhering to PwC's visual identity
- Clean minimalism with professional presentation
- Accessible, responsive interface using Tailwind breakpoints (sm, md, lg, xl)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js framework
- TypeScript for type safety across the codebase
- ESM module system

**API Structure:**
- RESTful endpoint `/api/generate-project` accepts multipart form data
- File upload handling via Multer middleware (in-memory storage)
- Request validation using Zod schemas from shared type definitions

**Code Generation:**
- `ProjectGenerator` class handles creation of language-specific project skeletons
- Supports Java (Spring Boot/Micronaut/Quarkus), Node.js (Express/NestJS/Fastify), and Python (Flask/Django/FastAPI)
- Generates appropriate directory structures, configuration files, and optional test scaffolding
- Archiver library creates ZIP files streamed directly to the client response

**Development Environment:**
- Hot module replacement (HMR) in development via Vite middleware integration
- Separate development and production build processes
- Custom logging middleware for API request monitoring

### Data Storage Solutions

**Current Implementation:**
- In-memory storage (`MemStorage` class) for user data
- No persistent database in current implementation

**Schema Design:**
- Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`)
- User schema defined with UUID primary keys, username, and password fields
- Project generation schema validates: project name, language, framework, database choice, test preferences

**Future Database Integration:**
- Drizzle configuration ready for PostgreSQL integration
- Migration system configured in `drizzle.config.ts`
- Database provisioning expected via `DATABASE_URL` environment variable

### Authentication and Authorization

**Current State:**
- User schema exists but authentication is not actively implemented
- No authentication middleware or session management in current routes
- Session infrastructure prepared via `connect-pg-simple` package

**Prepared Infrastructure:**
- User model supports username/password authentication
- Session store package included for future PostgreSQL-backed sessions

### Form Validation and Type Safety

**Shared Type System:**
- Zod schemas defined in `shared/schema.ts` provide runtime validation
- Type inference creates TypeScript types from Zod schemas
- Shared between client and server for consistent validation

**Validation Flow:**
- Client-side: React Hook Form with Zod resolvers (@hookform/resolvers)
- Server-side: Request body validation before processing
- Error handling returns structured error messages to client

### Build and Deployment

**Development:**
- `npm run dev` starts Express server with Vite middleware
- TSX for TypeScript execution without compilation
- Vite serves client with HMR enabled

**Production:**
- `npm run build` compiles both client (Vite) and server (esbuild)
- Client assets built to `dist/public`
- Server bundled to `dist/index.js` as ESM module
- Static file serving in production mode

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless component primitives for accessible UI components (accordion, dialog, dropdown, select, toast, etc.)
- **Shadcn/ui**: Pre-styled component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### Backend Services
- **Archiver**: ZIP file creation for project downloads
- **Multer**: Multipart form data handling for file uploads
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL driver (@neondatabase/serverless)

### Development Tools
- **Vite**: Frontend build tool with plugin ecosystem
- **Replit Plugins**: Development banner, cartographer, and runtime error modal for Replit environment
- **TSX**: TypeScript execution engine for development server
- **esbuild**: JavaScript bundler for production server compilation

### State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with validation integration
- **Wouter**: Lightweight routing library (alternative to React Router)

### Styling and Design Tokens
- Custom CSS variables for theming (primary, secondary, destructive, muted color schemes)
- PwC brand colors defined in design guidelines: `#d04a02` (primary), `#e0301e` (accent), `#a32020` (hover), `#660000` (emphasis)
- Responsive spacing system based on Tailwind's spacing scale