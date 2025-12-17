# AI-Generated Newsletters

A Next.js application for generating newsletters using Google's Generative AI. This application allows users to create, manage, and generate AI-powered newsletter content with brand management and user authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** (package manager)

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI**: Google Generative AI (Gemini)
- **Email**: Nodemailer
- **Styling**: Tailwind CSS

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-generated-newsletters
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DATABASE=ai_generated_newsletters

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google Generative AI Configuration
GOOGLE_API_KEY=your_google_api_key
GOOGLE_MODEL=gemini-pro
AI_RETRY_COUNT=5
AI_RETRY_DELAY_MS=3000

# SMTP Email Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_SERV=gmail
```

**Environment Variables Explained:**

- **Database Variables**: Connection details for your PostgreSQL database
- **NEXTAUTH_SECRET**: A random secret string for NextAuth.js (generate with `openssl rand -base64 32`)
- **GOOGLE_API_KEY**: Your Google Generative AI API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- **GOOGLE_MODEL**: The Gemini model to use (default: `gemini-pro`)
- **AI_RETRY_COUNT**: Number of retries for AI API calls (default: 5)
- **AI_RETRY_DELAY_MS**: Delay between retries in milliseconds (default: 3000)
- **SMTP Variables**: Email service credentials for sending emails (Gmail, Outlook, etc.)

### 4. Set Up the Database

Make sure PostgreSQL is running and accessible with the credentials specified in your `.env` file.

Create the database and schema:

```bash
npm run create-local-db
```

This script will:
- Connect to your PostgreSQL instance
- Create the `ai_generated_newsletters` database if it doesn't exist
- Set up all necessary tables and triggers
- Configure password encryption and timestamp triggers

### 5. Create a Test User

Create a test user for initial login:

```bash
npm run create-test-user
```

This creates a test user with the following credentials:
- **Email**: `test@test.com`
- **Password**: `test`

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

You will be redirected to the login page. Use the test user credentials created in step 5 to log in.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run create-local-db` - Create the local database and schema
- `npm run create-test-user` - Create a test user account

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/lib` - Core libraries (database, AI, email, auth)
- `/src/components` - React components
- `/src/types` - TypeScript type definitions
- `/src/util` - Utility functions and constants
- `/script` - Database setup and user creation scripts

## Features

- User authentication with NextAuth.js
- AI-powered newsletter generation using Google Gemini
- Brand management
- User management (admin)
- Email notifications
- Database-driven content management

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication documentation
- [Google Generative AI](https://ai.google.dev/) - Google AI API documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Database documentation

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready` or check your PostgreSQL service
- Verify your database credentials in the `.env` file
- Make sure the database user has permission to create databases

### Authentication Issues

- Ensure `NEXTAUTH_SECRET` is set in your `.env` file
- Check that the test user was created successfully

### AI Generation Issues

- Verify your `GOOGLE_API_KEY` is valid and has proper permissions
- Check API quota limits in Google AI Studio
- Review the retry configuration if experiencing rate limits

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to add all environment variables in your Vercel project settings.
