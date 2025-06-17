# replit.md

## Overview

Baaijus is an AI-powered content filtering application that allows users to create personalized bias profiles called "Baajuses" to filter and curate content. The application provides customizable sensitivity levels and semantic understanding using OpenAI's GPT models for content analysis.

## System Architecture

The application follows a full-stack architecture with the following components:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for CRUD operations

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Required Tables**: `users` and `sessions` tables are mandatory for Replit Auth

### Content Filtering Engine
- **AI Provider**: OpenAI GPT-4o for content analysis
- **Analysis Features**: 
  - Bias detection with configurable sensitivity levels (permissive, balanced, strict)
  - Keyword matching
  - Sentiment analysis
  - Content categorization
  - Confidence scoring

### User Interface
- **Design System**: shadcn/ui components with Tailwind CSS
- **Theme**: New York style with neutral color scheme
- **Responsive**: Mobile-first design approach
- **Key Pages**: Dashboard, Baajuses management, Live demo, Browser Extension, Analytics, Settings

### Core Entities
- **Baajuses**: Custom bias profiles with name, description, sensitivity, keywords, and usage tracking
- **Filter Results**: Analysis results from content filtering operations
- **Users**: Authentication and profile management

## Data Flow

1. **User Authentication**: Users authenticate through Replit Auth, creating sessions stored in PostgreSQL
2. **Baajus Creation**: Users create custom bias profiles with specific keywords and sensitivity settings
3. **Content Analysis**: When content is submitted for filtering:
   - Content is sent to OpenAI API with the selected Baajus parameters
   - AI analyzes content based on sensitivity level and keywords
   - Results include blocking decision, confidence score, matched keywords, and sentiment
4. **Result Storage**: Filter results are stored for analytics and tracking
5. **Dashboard Updates**: Real-time statistics and recent activity are displayed to users

## External Dependencies

### Required Services
- **OpenAI API**: For content analysis and filtering (requires API key)
- **PostgreSQL Database**: For data persistence (Neon serverless configured)
- **Replit Auth**: For user authentication (automatically configured in Replit environment)

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm**: Type-safe database operations
- **openai**: Official OpenAI client library
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Build Process**: Vite for frontend, esbuild for backend
- **Hot Reload**: Vite dev server with HMR

### Production Deployment
- **Target**: Replit Autoscale deployment
- **Build Command**: `npm run build` (builds both frontend and backend)
- **Start Command**: `npm run start` (runs production server)
- **Port Configuration**: Internal port 5000, external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned)
- `OPENAI_API_KEY`: Required for content analysis functionality
- `SESSION_SECRET`: For session encryption
- `REPLIT_DOMAINS`: Required for Replit Auth

## Browser Extension System

### Extension Download & Onboarding
- **Download Page**: `/extension` route provides comprehensive installation instructions
- **ZIP Distribution**: Extension packaged as downloadable ZIP file at `/baaijus-extension.zip`
- **Installation Guide**: Step-by-step browser installation with visual instructions
- **Compatibility**: Chrome, Edge, Brave browsers with Manifest V3 support
- **Navigation Integration**: Extension link added to sidebar and dashboard quick actions

### Extension Features
- **Real-time Filtering**: Content analysis on any website using user's Baajuses
- **One-click Toggle**: Enable/disable filtering with browser toolbar button
- **Settings Sync**: Baajuses automatically sync across devices via API
- **User Authentication**: Secure login integration with main platform

## Changelog

```
Changelog:
- June 16, 2025. Initial setup with Replit Auth
- June 16, 2025. Replaced Replit Auth with custom username/password authentication system
- June 16, 2025. Updated landing page with "Patent Pending" messaging and improved hero section
- June 16, 2025. Removed "AI" references from branding for universal, enterprise-ready messaging
- June 16, 2025. Configured OpenAI API integration for full AI content analysis
- June 16, 2025. Created complete browser extension with Manifest V3 for Chrome/Edge
- June 16, 2025. Comprehensive testing completed - all authentication, filtering, and API endpoints verified
- June 16, 2025. Platform ready for production deployment with test credentials and sample data
- June 16, 2025. Added browser extension download and onboarding system with comprehensive installation guide
- June 16, 2025. Fixed extension API URL configuration to point to correct production deployment
- June 16, 2025. Removed all hardcoded localhost URLs from extension and web app - fully production-ready with CORS support
- June 16, 2025. COMPLETED comprehensive production polish and deployment:
  * Fixed 404 flash on dashboard navigation through improved authentication routing
  * Enhanced extension popup with branded design and connected status indicator
  * Updated all API endpoints to match deployment URL configuration
  * Created polished extension onboarding page at /onboarding with step-by-step installation guide
  * Fixed extension ZIP download corruption issue - extension now extracts and installs properly
  * Implemented real-time connection status in extension popup with visual indicators
  * Enhanced browser compatibility messaging and troubleshooting guidance
  * Successfully deployed all improvements - platform fully operational with working extension downloads
- June 17, 2025. FIXED: Extension authentication fully working with token-based system:
  * Replaced session-based auth with token-based auth for browser extension compatibility
  * Created dedicated extension endpoints: /api/ext/login and /api/ext/baaijuses
  * Fixed Vite routing conflicts that intercepted API requests
  * Extension now uses Bearer token authentication instead of cookies
  * Test credentials confirmed working: username=testuser2, password=testpass
  * Complete authentication flow working from extension to backend
  * Extension ready for production use with reliable API communication
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```