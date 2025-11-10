# Conversation Log

This log's purpose is to provide a summary of our development sessions, allowing me to quickly get up to speed on the project's status and our previous work.

## Project Context

This is a full-stack application built with:

- **Backend:** [Convex](https://convex.dev/) (database, server logic, authentication)
- **Frontend Framework:** [Next.js](https://nextjs.org/) with React
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a [shad-cn](https://ui.shadcn.com/) component library.
- **Project Structure:** The project follows a pattern where custom components are stored in the `@components` directory, and the Next.js `app` directory is kept clean.

---

## Log: One-on-One Chat Feature

This log summarizes the development process for implementing the one-on-one chat feature.

### 1. Backend Development

- **Data Modeling:** We designed the database schema for direct messaging. After an initial proposal, we decided to use `snake_case` for all table and field names.

- **Schema Implementation:**
    - Added the `direct_messages` table to `convex/schema.ts` to store individual messages.
    - Added a `conversations` table to efficiently track conversations and their last messages.

- **Backend Logic:**
    - Created `convex/direct_messages.ts` to house the chat-related backend functions.
    - Implemented the `send_message` mutation to handle creating new messages and updating the corresponding conversation.
    - Implemented the `get_messages` query, which was later refactored to take a `user_id` instead of a `conversation_id` to simplify frontend logic.
    - Implemented and optimized the `get_conversations` query. We iterated on this function to ensure it was performant, avoiding the N+1 problem.

### 2. Frontend Development

- **URL Strategy:** We decided on a user-friendly URL structure for chat pages: `/chat/[username]`.

- **Component Implementation:** Following the project's conventions, I created the necessary UI components:
    - **Chat Page:** `app/(root)/(protected)/chat/[username]/page.tsx`
    - **Chat Components:** Created `user-header.tsx`, `message-list.tsx`, and `message-input.tsx` in the `components/chat/` directory.
    - **Conversation List:** Created a page at `app/(root)/(protected)/chat/page.tsx` to list all of a user's conversations.

- **Routing and Navigation:**
    - Updated the user profile page (`/users/[username]`) to include a button that navigates to the chat page for that user.
    - Created a new layout file for the chat section.

### 3. UI Adjustments and Bug Fixes

- **Message Order:** We identified and fixed a bug where new messages were appearing at the top of the chat instead of the bottom. This was resolved by:
    1.  Changing the `get_messages` query in the backend to sort messages in `asc` (ascending) order.
    2.  Reversing the message array on the frontend in the `message-list.tsx` component to ensure correct visual order.
