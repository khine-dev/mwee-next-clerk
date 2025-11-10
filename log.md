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

### 4. Chat Page Design and Layout Improvements

- **Initial Assessment:** The chat page design was initially basic, with minimal styling for message bubbles, and issues with overall layout and scrolling behavior.
- **Message Bubble Component:** Created `components/chat/message-bubble.tsx` to encapsulate message styling, differentiate sender/receiver, and display timestamps.
- **Message Input Redesign:** Redesigned `components/chat/message-input.tsx` to be more compact, replacing the `Textarea` with an `Input` and a text button with an icon button using `lucide-react`.
- **Message List Refactoring (Order & Scrolling):**
    - Initially attempted to use `flex-col-reverse` in `components/chat/message-list.tsx` to handle message order, but this led to incorrect scrolling behavior.
    - Reverted to using `flex-col` and `[...results].reverse().map()` for message rendering, combined with a `useEffect` hook to ensure the message list scrolls to the bottom on new messages. This approach, previously established, correctly handles message order and scrolling for paginated results.
- **Layout Scrolling Fix:** Addressed a critical scrolling issue where the entire page scrolled instead of just the message list. This was resolved by modifying `app/(root)/(protected)/chat/layout.tsx` to be a full-height flex container (`h-full flex flex-col`), ensuring the chat components are correctly constrained within the viewport and the message input remains visible.
- **Conditional Global Header/Footer:** Implemented conditional rendering for the global header and footer in `app/(root)/layout.tsx`. This allows chat pages (and any other designated full-screen pages) to be rendered without the global navigation, providing a less crowded, full-screen experience, while other pages retain the standard header and footer.
- **Dynamic Chat Header & Navigation:**
    - Modified `app/(root)/(protected)/chat/layout.tsx` to include a dynamic header. This header now features a back button for navigation and displays the other user's avatar and name (fetched via Convex query) when on an individual chat page (`/chat/[username]`). For the main chat list page (`/chat`), it displays a generic "Chat" title.
    - Removed the redundant `User_Header` component from `app/(root)/(protected)/chat/[username]/page.tsx`, as its functionality was absorbed by the dynamic chat layout header.
    - Deleted the now unused `components/chat/user-header.tsx` file to maintain a clean codebase.

### 5. Greeter Message Feature

- **Objective:** To display a "greeter" message from the other user as the first message in a new conversation (no existing messages), both visually on the frontend and persistently in the database upon the user's first message.
- **Frontend Implementation:**
    - Modified `app/(root)/(protected)/chat/[username]/page.tsx` to pass the full `other_user` object to the `Message_List` component.
    - Updated `components/chat/message-list.tsx` to accept the `other_user` object. If the conversation has no existing messages and `other_user.greeter` is defined, a `Message_Bubble` is rendered with the greeter content, attributed to the other user.
- **Backend Implementation:**
    - Modified the `send_message` mutation in `convex/direct_messages.ts`.
    - Before inserting the user's message, the mutation now checks if it's the first message in the conversation.
    - If it is the first message and the receiver has a `greeter` field, the greeter message is inserted into the `direct_messages` table, attributed to the receiver.
    - The user's actual message is then inserted, and its ID is used to update the `last_message_id` in the `conversations` table.

### 6. Search Page Improvements & Bug Fixes

- **Search Functionality Fix:** Corrected an issue in `app/(root)/search/page.tsx` where the `handle_search` function, due to incorrect `useMemo` usage, was not capturing the latest `keyword` and `gender` values. This was resolved by replacing `useMemo` with `useCallback` and providing the correct dependencies (`keyword`, `gender`).
- **Debounced Search Input:** Implemented debouncing for the search input to improve performance and user experience.
    - Created a new `useDebounce` hook in `hooks/use-debounce.ts`.
    - Refactored `app/(root)/search/page.tsx` to use `useDebounce` for the `keyword` state.
    - Removed the manual `handle_search` function and the explicit search button.
    - Implemented a `useEffect` to automatically trigger searches when the debounced `keyword` or `gender` changes, providing a "search-as-you-type" experience.
- **Unused Variable Fix:** Resolved an ESLint warning in `app/(root)/(protected)/profile/edit/page.tsx` where the `e` variable in a `catch` block was unused. The fix involved adding `console.error("Error updating profile:", e);` to the `catch` block for debugging purposes.