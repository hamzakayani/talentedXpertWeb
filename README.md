## TalentedXpert Web (Next.js)

TalentedXpert is a Next.js application using the App Router that connects Talent Experts (TE) and Talent Requestors (TR) for tasks, collaboration, content, messaging, and payments.

### Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Global CSS/SCSS under `public/assets/styles`
- **State**: Redux Toolkit slices under `src/reducers`, store in `src/store`
- **Data Fetching**: React Query (TanStack Query) for optimized API calls, caching, and faster responses to end users
- **Forms/Validation**: Zod/Yup-like schemas under `src/schemas`
- **APIs/Networking**: `src/services`, `src/app/api/*`
- **Realtime/Video**: Socket utilities and VideoSDK integration

### Getting Started
1) Install dependencies
```bash
npm install
```

2) Run development server
```bash
npm run dev
```
Then open `http://localhost:3000`.

3) Build and start
```bash
npm run build && npm start
```

### Project Structure
```
src/
  app/                # App Router routes (pages, layouts, API)
  components/         # Reusable UI and feature components
  hooks/              # Custom hooks
  models/             # Client-side models/types
  reducers/           # Redux Toolkit slices
  schemas/            # Form validation schemas
  services/           # API clients, utilities, enums, helpers
  store/              # Redux store configuration
  types/              # Global/custom type declarations
public/               # Static assets (images, audio, styles)
```

### All Pages and Routes
- `/(home)` Landing page: `src/app/page.tsx` (implicit root)
- `about`: `src/app/about/page.tsx`
- `blog`: `src/app/blog/page.tsx`
- `FAQs`: `src/app/FAQs/page.tsx`
- `privacyPolicy`: `src/app/privacyPolicy/page.tsx`
- `termsConditions`: `src/app/termsConditions/page.tsx`
- `projects`: `src/app/projects/page.tsx`
- `readMore`: `src/app/readMore/page.tsx`
- `signin`: `src/app/signin/page.tsx`
- `register`: `src/app/register/page.tsx`
- `forgot-password`: `src/app/forgot-password/page.tsx`
- `reset-password`: `src/app/reset-password/page.tsx`
- `tasks`: `src/app/tasks/page.tsx`
- `tasks/[id]`: `src/app/tasks/[id]/page.tsx`
- `meeting/[id]`: `src/app/meeting/[id]/page.tsx`
- `dashboard`: `src/app/dashboard/page.tsx`
- `dashboard/[userType]`: `src/app/dashboard/[userType]/page.tsx`
- `dashboard/[userType]/[id]`: `src/app/dashboard/[userType]/[id]/page.tsx`
- `dashboard/messages`: `src/app/dashboard/messages/page.tsx`
- `dashboard/messages/[threadId]`: `src/app/dashboard/messages/[threadId]/page.tsx`
- `dashboard/payments`: `src/app/dashboard/payments/page.tsx`
- `dashboard/payments/information`: `src/app/dashboard/payments/information/page.tsx`
- `dashboard/payments/wallets`: `src/app/dashboard/payments/wallets/page.tsx`
- `dashboard/profile-setting`: `src/app/dashboard/profile-setting/page.tsx`
- `dashboard/reviews`: `src/app/dashboard/reviews/page.tsx`
- `dashboard/reviews/completeprojects`: `src/app/dashboard/reviews/completeprojects/page.tsx`
- `dashboard/tasks`: `src/app/dashboard/tasks/page.tsx`
- `dashboard/tasks/[id]`: `src/app/dashboard/tasks/[id]/page.tsx`
- `dashboard/teams`: `src/app/dashboard/teams/page.tsx`
- `dashboard/teams/add`: `src/app/dashboard/teams/add/page.tsx`
- `dashboard/teams/[id]`: `src/app/dashboard/teams/[id]/page.tsx`
- `dashboard/disputes`: `src/app/dashboard/disputes/page.tsx`
- `dashboard/disputes/[disputeId]`: `src/app/dashboard/disputes/[disputeId]/page.tsx`
- `dashboard/articles`: `src/app/dashboard/articles/page.tsx`
- `dashboard/articles/add`: `src/app/dashboard/articles/add/page.tsx`
- `dashboard/articles/[id]`: `src/app/dashboard/articles/[id]/page.tsx`
- `dashboard/articles/[id]/edit`: `src/app/dashboard/articles/[id]/edit/page.tsx`
- `/[userType]`: `src/app/[userType]/page.tsx`
- `/[userType]/[id]`: `src/app/[userType]/[id]/page.tsx`
- `/[userType]/[id]/allReviews`: `src/app/[userType]/[id]/allReviews/page.tsx`
- `/[userType]/[id]/completedTasks`: `src/app/[userType]/[id]/completedTasks/page.tsx`
- `[...not-found]`: `src/app/[...not-found]/page.tsx`

API Routes (selection):
- `api/thread/[threadId]/participants.ts`
- `api/token-videosdk/route.ts`
- `api/videosdk/route.ts`

### User Stories

#### Login
- As a TE or TR, when I attempt to log in, I want to enter my email and password with proper validation so that I can access my account securely.
- As a user, when I forget my password, I want to use the forgot password button so that I can reset my password easily.
- As a user, when I log in, I want to have the option to remember my login details so that I don't have to enter them every time.
- As a user, when I want to register, I want to see a register button at the bottom so that I can create a new account easily.
- As a user, when I log in, I want to have social login options for Google and LinkedIn so that I can log in quickly using my existing accounts.

#### Registration
- As a user, when I register, I want to upload my resume so that I can provide my qualifications.
- As a user, when I fill out my profile, I want to enter my personal information so that I can create an account.
- As an organization, when I register, I want to specify my organization type so that I can be categorized correctly.

#### Home Page
- As a user, when I visit the landing page, I want to see a top header with the logo, links, and login/signup buttons so that I can easily navigate the site.
- As a user, when I view the hero section, I want to find buttons for "Find Xperts," "Browse Tasks," and "Search" so that I can quickly access main features.
- As a user, when I read the "Why TalentedXpert" section, I want to see a title, description, and a "read more" button so that I can learn more about the service.
- As a user, when I explore the "How it works" section, I want to see cards explaining the process for both Xpert and Requestor so that I understand how to use the platform.

#### Forgot/Reset Password
- As a user, when I forget my password, I want to receive an email to reset my password so that I can regain access to my account.
- As a user, when I click the reset password link, I want to be taken to a page where I can enter and confirm my new password so that I can successfully change my password.

#### About Us
- As a user, when I visit the "About Us" page, I want to see the title and text provided by the client so that I can understand more about the organization.

#### Blog
- As a user, when I visit the blog page, I want to see the latest blogs posted so that I can stay updated with new content.
- As a user, when I view the blog page, I want to select whether I want to see blogs in a list or grid format so that I can choose my preferred viewing style.
- As a user, when I see a blog entry, I want to click a "read more" button so that I can read the full blog post.

#### FAQs
- As a user, when I visit the FAQs page, I want to see minimized FAQs that I can expand by clicking a + button so that I can view the full content easily.
- As an admin, when I manage the FAQs, I want to add new FAQs so that users have access to updated information.

#### Privacy Policy
- As a user, when I visit the privacy policy page, I want to see an image, a title, and the platform policy text so that I can understand the privacy practices.

#### Terms and Conditions
- As a user, when I access the Terms and Conditions page, I want to see an image with a title and description so that I can understand the content better.
- As a developer, when I implement the Terms and Conditions page, I want to integrate the API so that the information is dynamically retrieved.

#### Dispute Policy
- As a user, when I visit the dispute policy page, I want to view the Dispute Policy image above the title and description so that I can understand the policy visually.

#### Dashboards
- TE Dashboard: As an Expert User, when I view my active working tasks and related articles in a unified dashboard, I want to easily track my ongoing engagements and stay updated with relevant content.
- TR Dashboard: As a Talent Requestor, when I view my assigned or ongoing tasks and key account information, I want to easily track the progress of tasks I’ve requested and manage my resources.

#### Tasks (TE/TR)
- As a user (expert or requestor), when browsing tasks, I want to find relevant opportunities quickly so that I can monitor tasks based on their status.

#### Messages
- As a user, when I select a user from the list, I want to see the chat on the right so that I can communicate effectively.
- As a user, when I click the "Meet" button, I want to start a meeting with the selected conversation so that I can discuss in real-time.

#### Articles
- As a user, when I visit the “My Articles” page, I want to see a list of my authored articles so that I can easily access and manage them.
- As a user, when I click the “Add New Article” button, I want to be taken to the article creation flow so that I can write a new article.
- As a user, when my articles are loading, I want to see a loading state so that I know the content is being fetched.

#### Wallet, Payments, Transactions
- As a user, when I access the Wallet page, I want to see my financial status so that I can manage my funds effectively.
- As a user, when I view my transaction history, I want to see detailed information about my transactions so that I can track my spending.

#### Disputes
- As a user, when I want to view my disputes, I want to see them in a paginated list so that I can manage them easily.
- As a user, when I need to create a dispute for an eligible task, I want to fill out a modal form so that I can submit my dispute.
- As a user, when I want to withdraw an open dispute, I want to confirm my action so that I can ensure it is intentional.
- As a user, when I want to view the details of a dispute, I want to see all relevant information so that I can understand its status and context.

#### Profile Settings (TE/TR)
- As a user (Talent Requestor or Talent Expert), when I view my profile, I want to edit my profile details so that my account information is accurate and discoverable.

#### Reviews
- As a user, when browsing reviews, I want to apply rating filters so that I can quickly assess feedback on tasks and collaborators.

#### Tasks - TR
- As a Talent Requestor, when I browse my posted tasks, I want to filter by status, search, and paginate so that I can quickly manage and review them.

#### Notifications
- As a user, when I view my recent notifications, I want to see them in a scrollable list so that I can stay updated on activities like reviews and proposals.

### Scripts
- `dev`: Start development server
- `build`: Production build
- `start`: Start production server

### Contributing
1. Create a new branch.
2. Make changes with clear commits.
3. Open a PR describing the change and test coverage.

### License
Proprietary — All rights reserved.
