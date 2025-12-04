# AI Prompting Standard for [Project Name]

## Phase 0: Context Setting (Start of Chat)

**Use this prompt when starting a new chat session to "train" the AI.**

> **Role:** Senior React Architect & Code Reviewer.
>
> **Context:**
> I am developing a React application. I require strict adherence to "Separation of Concerns" and clean architecture.
>
> **The Law:**
> Below is my "Frontend Development Guide". You must follow every rule in this document, especially:
>
> 1. **Section 4:** NEVER call APIs in Components. ALWAYS use Custom Hooks.
> 2. **Section 12:** When integrating, split large files and handle data mismatches gracefully.
>
> **[PASTE CONTENT OF YOUR 'FRONTEND DEVELOPMENT GUIDE.md' HERE]**
>
> **Acknowledgment:**
> Do not write code yet. Just confirm you understand the guidelines and are ready to receive the first task.

---

## Phase 1: Planning (For Large/Complex Features)

**Use this when the feature is complex or the file is too big (like UserProfile).**

> **Current Task: Planning**
> I need to implement/refactor the feature: **[FEATURE NAME]**.
> Current State: [Describe current state, e.g., "Giant file with Mock Data" or "New empty feature"].
>
> **Requirement:**
> Please DO NOT write code yet.
> Analyze the requirement and propose a **Step-by-Step Implementation Plan**.
> List exactly:
>
> 1. The Files to be created (Services, Hooks, Components).
> 2. The Types/Interfaces needed.
> 3. The exact folder path for each file (following my structure).
>
> Wait for my confirmation.

---

## Phase 2: Execution - Logic Layer First (Data & Hooks)

**Use this after agreeing on the plan.**

> **Step 1: The Logic Layer**
> Please implement the **Types**, **Service**, and **Custom Hook** for **[FEATURE NAME]**.
>
> **Constraints:**
>
> - **Service:** Use the singleton `apiClient`. Handle errors gracefully.
> - **Hook:** Must return `{ data, isLoading, error, ...handlers }`.
> - **Logic Mismatch:** If the API data doesn't match the UI requirements (e.g., missing fields), handle the transformation/calculation INSIDE the Hook.
>
> **Output:** Provide code for:
>
> 1. `src/.../types.ts`
> 2. `src/.../service.ts`
> 3. `src/.../use[FeatureName].ts`

---

## Phase 3: Execution - UI Layer (Components)

**Use this after the Hook is ready.**

> **Step 2: The UI Layer**
> Now implement the **UI Component** for **[FEATURE NAME]**.
>
> **Constraints:**
>
> - Import and use the hook `use[FeatureName]` we just created.
> - **NO** `useEffect` or API calls allowed in this file.
> - **Styling:** Use Tailwind CSS.
> - **Fallback:** If data is missing (based on the Hook's output), ensure the UI doesn't break (use skeletons or fallbacks).
>
> **Reference:** > [Optional: Paste existing UI code/Mock data code here so AI knows the styling]

---

## Phase 4: Assembly (For Refactoring)

**Use this to clean up the parent component.**

> **Final Step: Assembly**
> Now update the parent file **[PARENT COMPONENT NAME]**.
>
> **Tasks:**
>
> 1. Remove the old Mock Data/Old Logic.
> 2. Import the new sub-component **[COMPONENT NAME]** we just made.
> 3. Ensure the parent acts mainly as a Layout/Container.
