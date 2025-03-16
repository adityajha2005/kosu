# KOSU - AI-Powered Talent & Hackathon Platform


KOSU is an innovative platform that combines AI-powered talent matching, skill verification, and blockchain technology to create a comprehensive ecosystem for job seekers, recruiters, and hackathon enthusiasts.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [AI Models](#ai-models)
- [Feature Details](#feature-details)
  - [Job Application System](#job-application-system)
  - [Proctored Interviews](#proctored-interviews)
  - [Hackathon Platform](#hackathon-platform)
  - [NFT Minting](#nft-minting)
  - [PDF Processing](#pdf-processing)
  - [Hackathon Teammate Finder](#hackathon-teammate-finder)
  - [Resources Sharing](#resources-sharing)
- [Contributing](#contributing)
- [License](#license)
- [Learn More](#learn-more)

## Overview

KOSU leverages cutting-edge AI models from Hugging Face to provide intelligent talent matching, skill verification, and interview preparation. The platform also integrates blockchain technology for secure hackathon registration, NFT minting, and credential verification.

## Features

- **Talent Scout**: Matches job requirements with candidate profiles using zero-shot classification
- **Skill Verifier**: Verifies skills and credentials using question answering models
- **Interview Prep**: Generates interview questions and feedback using text generation models
- **Resume Analyzer**: Extracts skills, experience, and education from resumes using sentiment analysis
- **PDF Processing**: Browser-compatible PDF text extraction for resume analysis
- **Hackathon Events**: Browse, register, and participate in blockchain hackathons with wallet integration
- **NFT Minting**: Mint exclusive KOSU NFTs with unique attributes and rarity levels using Petra Wallet
- **Hackathon Teammate Finder**: Helps hackathon participants find teammates based on skill compatibility and experience using AI-powered matching
- **Job Application System**: Complete job application flow with social profile integration and role-specific questions
- **Proctored Interviews**: AI-monitored interview system for initial screening rounds
- **Resource Sharing**: Community-driven resource sharing for skill development
- **Hackathon Creation**: Platform for organizers to create and manage hackathons

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI**: Hugging Face Models, @xenova/transformers
- **Blockchain**: Petra Wallet Integration
- **PDF Processing**: PDF.js
- **Authentication**: NextAuth.js, Wallet Authentication
- **Deployment**: Vercel (recommended)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm, yarn, pnpm, or bun
- Git
- MongoDB (local or Atlas connection)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adityajha2005/kosu.git
   cd kosu
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```plaintext
# Required
NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_api_key_here
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional - Custom AI Model Selection
NEXT_PUBLIC_HF_TALENT_SCOUT_MODEL=facebook/bart-large-mnli
NEXT_PUBLIC_HF_SKILL_VERIFIER_MODEL=deepset/roberta-base-squad2
NEXT_PUBLIC_HF_INTERVIEW_PREP_MODEL=gpt2
NEXT_PUBLIC_HF_RESUME_ANALYZER_MODEL=distilbert-base-uncased-finetuned-sst-2-english

# Optional - External API Integration
UNSTOP_API_KEY=your_unstop_api_key_here

# Optional - Production Settings
NODE_ENV=development
```

## Deployment

### Deploying to Vercel (Recommended)

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one.

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

5. Set up the environment variables in the Vercel dashboard.

### Alternative Deployment Options

#### Self-hosting

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   # or
   bun build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   # or
   bun start
   ```

## AI Models

The project uses the following Hugging Face models by default:

- **Talent Scout**: facebook/bart-large-mnli (Zero-shot classification model for job matching)
- **Skill Verifier**: deepset/roberta-base-squad2 (Question answering model for skill verification)
- **Interview Prep**: gpt2 (Text generation model for interview preparation)
- **Resume Analyzer**: distilbert-base-uncased-finetuned-sst-2-english (Sentiment analysis model for resume analysis)
- **Skill Based Matching**: sentence-transformers/all-MiniLM-L6-v2 (Embedding model for teammate matching)

You can customize these models by changing the environment variables in `.env.local`.

## Feature Details

### Job Application System

The platform includes a comprehensive job application system:

- Apply for jobs with detailed application forms
- Input social profiles and professional information
- Answer role-specific questions during application
- View and manage application status from dashboard
- Withdraw applications if needed
- Track recent applications in user dashboard

### Proctored Interviews

The platform features an AI-powered proctored interview system:

- First-round interviews conducted in a secure, proctored environment
- AI monitoring to ensure interview integrity
- Automated evaluation of responses
- Results shared with recruiters for further rounds
- Seamless integration with the job application flow

### Hackathon Platform

The platform includes a comprehensive hackathon events system:

- Browse upcoming blockchain hackathons with detailed information
- View event details including dates, locations, prizes, and requirements
- Register for events using wallet authentication (Petra Wallet)
- Track registered hackathons in the user dashboard
- Receive NFT badges and credentials for participation and achievements
- Integration with Unstop for featured hackathons on the homepage
- Organizers can create hackathons with custom registration options:
  - Inhouse: Using KOSU's registration system
  - Outhouse: Registration on external platforms via provided links

Key features:
- Responsive design for all event pages
- Wallet integration for secure registration
- Detailed event information with judging criteria
- Registration form with skill and experience tracking
- Dashboard integration for registered events

### NFT Minting

The platform includes an NFT minting system that allows users to mint exclusive KOSU NFTs:

- Mint unique KOSU Genesis NFTs with random attributes and rarity levels
- Connect with Petra Wallet for blockchain interaction
- View detailed NFT information including attributes and rarity
- Track minted NFTs in the user dashboard
- Test wallet connection and contract functions

Key features:
- Simulated minting process for testing and demonstration
- Realistic wallet interaction with approval/rejection flows
- Random NFT generation with unique attributes (Power, Intelligence, Charisma, Luck)
- Five rarity levels (Common, Uncommon, Rare, Epic, Legendary)
- Visual attribute display with progress bars
- Wallet connection status monitoring
- Local storage for persisting NFT ownership information

#### Using the NFT Minter

1. Connect your Petra Wallet by clicking "Log in" in the header
2. Navigate to the Dashboard page
3. Click "Mint KOSU NFT" to start the minting process
4. Approve the transaction in the wallet popup
5. View your minted NFT with its unique attributes and rarity level

For testing purposes, the minting process is simulated and doesn't require an actual blockchain transaction. The NFT data is stored locally in your browser's localStorage.

### PDF Processing

The application uses PDF.js for browser-compatible PDF text extraction. This allows users to upload their resumes in PDF format without requiring server-side processing.

Key features:
- Client-side PDF text extraction
- Support for both PDF and TXT file formats
- Detailed error messages for common PDF issues
- Debug mode for troubleshooting extraction problems
- Sample resume template for users who have trouble with their PDFs

### Hackathon Teammate Finder

This feature helps hackathon participants find potential teammates based on skill compatibility and experience using AI-powered matching.

#### How It Works

The teammate finder uses the `sentence-transformers/all-MiniLM-L6-v2` model to create embeddings of user skills and experience descriptions. It then calculates the similarity between users to find the most compatible potential teammates.

##### Technical Implementation

1. **Embedding Generation**: The system uses the `@xenova/transformers` library to generate embeddings for user profiles based on their skills and experience.

2. **Similarity Calculation**: Cosine similarity is used to measure how similar two user profiles are.

3. **Matching Algorithm**: Users are ranked by similarity score, with the most similar profiles shown first.

#### How to Use

1. **Access the Feature**: Click on the team icon (👥) on any hackathon card to open the teammate finder modal.

2. **Select Skills**: Choose the skills you're looking for in potential teammates. These can be different from your own skills if you're looking for complementary team members.

3. **Describe Experience (Optional)**: Add a brief description of your experience level and what you're looking for in teammates.

4. **Find Matches**: Click "Find Teammates" to see a list of potential teammates ranked by compatibility.

5. **Connect with Matches**: View the profiles of potential teammates and reach out to them to form a team.

#### Requirements

- You must connect your wallet to use this feature.
- Your profile should have skills listed for the best matching results.

#### Privacy

- Your skills and experience data are only used for matching purposes and are not shared with third parties.
- The matching process happens on the server, and embeddings are not stored permanently.

#### Dependencies

This feature uses:
- `@xenova/transformers`: For generating embeddings
- MongoDB: For storing and retrieving user profiles
- Next.js API routes: For handling the matching logic

### Resources Sharing

The platform includes a community-driven resource sharing system:

- Users can suggest learning resources on the `/resources` page
- Resources are categorized by skill and difficulty level
- Upvoting system to highlight the most valuable resources
- Integration with user profiles to track completed resources
- Personalized resource recommendations based on user skills and goals

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Hugging Face:

- [Hugging Face Documentation](https://huggingface.co/docs) - learn about Hugging Face models and APIs.
- [Inference API](https://huggingface.co/docs/api-inference/index) - documentation for the Inference API used in this project.

To learn more about PDF.js:

- [PDF.js Documentation](https://mozilla.github.io/pdf.js/) - learn about the PDF.js library used for PDF text extraction.
- [PDF.js GitHub](https://github.com/mozilla/pdf.js) - the source code for PDF.js
