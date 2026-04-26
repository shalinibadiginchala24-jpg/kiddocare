# Complete KiddoCare Implementation Plan

This plan outlines how we will adapt our existing `KiddoCare` prototype to precisely follow the complete system schema (UI, Theme, Flow, Architecture) you provided. We will leverage our existing Expo Router layout but rigorously adopt your requested data structures, design tokens, and components seamlessly.

## User Review Required
> [!IMPORTANT]
> - You've requested generating standard `.js` files in `/app/screens`, but we currently use **TypeScript (`.tsx`, `.ts`)** alongside **Expo Router** (`/app/(child)`, `/app/(parent)`, etc.). 
> - **Recommendation:** I strongly advise we keep using TypeScript + Expo Router. It matches modern Expo best practices, prevents critical bugs, and naturally fits your requested Splash → Onboarding → Role → Dashboard flow without complex manual navigation wrappers. Do you approve staying with TypeScript + Expo Router while implementing your exact features?

## Proposed Changes

### 1. Dependencies and Setup
- Install `react-native-onboarding-swiper` for the smooth onboarding flow.
- Install `expo-location` for tracking GPS locations.
- We already have Firebase 12 installed!

---

### 2. Design System (`theme/colors.ts`)
We will create a centralized global theme file.

#### [NEW] `theme/colors.ts`
Exporting the required color palette:
- `primaryGradientStart: '#7B61FF'`
- `primaryGradientEnd: '#9F7AEA'`
- `background: '#F5F7FB'`
- `textDark: '#1F2937'`
- `textLight: '#6B7280'`
- `accentPink: '#F8BBD0'`
- `accentGreen: '#B9F6CA'`
- `accentYellow: '#FFF3B0'`

---

### 3. Services and Architecture

#### [MODIFY] `services/firebase.ts`
Ensure it aligns strictly with your required collections (`users`, `children`, `tasks`, `rewards`, `moods`, `locations`).

#### [NEW] `services/authService.ts`
- `parentSignUp(name, email, password)`
- `parentLogin(email, password)`
- `createChildAccount(parentId, name, username, password)`
- `childLogin(username, password)`

#### [MODIFY] `services/taskService.ts`
- `addTask(childId, title, rewardPoints)`
- `getTasks(childId)`
- `completeTask(taskId)`

#### [NEW] `services/locationService.ts`
- `trackChildLocation(childId)`

---

### 4. Navigation Flow

#### [MODIFY] `app/index.tsx` (Splash Screen)
- Will display the App Logo and automatically redirect.

#### [NEW] `app/onboarding.tsx`
- Will use `react-native-onboarding-swiper`.
- **4 Pages**: Smart Child Safety, Live Location Tracking, Tasks & Rewards, AI Buddy.
- Redirects to Login when done.

#### [NEW] `app/login.tsx`
- Parent Login / Signup (Email based)
- Child Login (Username & Password created by parent)

#### [MODIFY] Role-Based Dashboards
We will heavily refine the UI into your requested professional pastel theme.
- **Parent (`app/(parent)/_layout.tsx` wrapper + sidebar Drawer)**:
  - Dashboard: View child details, track location, add/view tasks, notifications.
- **Child (`app/(child)/_layout.tsx` wrapper + sidebar Drawer)**:
  - Dashboard: View tasks with checkboxes, check rewards, mood tracking UI, AI buddy UI, SOS UI.

## Open Questions
> [!WARNING]
> 1. For the **Parent adds Child** logic: since you mentioned an email login for the parent but a username login for the kid, do you want us to link the child to the parent's UID securely behind the scenes? (Yes, assumed logic from `authService.js`).
> 2. Currently, our structure uses `/app/(child)` and `/app/(parent)` instead of a flat `/app/screens` folder to enforce route grouping. Can we keep route grouping for cleaner separation as recommended by Expo Router?

## Verification Plan

### Automated Tests
- Validate TypeScript compilation (`npm run dev`)
- Ensure Firebase initializes without warnings

### Manual Verification
1. Open up the newly themed Onboarding flow, trigger the 4 swipes.
2. Sign up a new Parent -> Test Firebase user creation.
3. As Parent, create a Child user -> Test Firebase child creation.
4. Log out, log in as Child using the parent-assigned username/pwd.
5. In Child Dashboard, toggle Tasks -> Ensure Parent Dashboard sees the updates.
6. Verify colors strictly adhere to the Pastel Palette.
