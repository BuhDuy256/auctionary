# Example Scenario: Refactoring "Active Bids" in UserProfilePage

## User Input (Phase 0: Context)

_(User pastes the Role + Guide content...)_
"Do not write code yet. Just confirm you understand..."

## AI Response

"Understood. I have internalized the Frontend Development Guide. Ready for instructions."

---

## User Input (Phase 1: Planning)

**Current Task: Planning**
I need to refactor the **"Active Bids" Tab** inside `UserProfilePage.tsx`.
Current State: It is currently a hardcoded Mock Data array inside a 400-line file.

**Requirement:**
Please DO NOT write code yet.
Propose a plan to extract this into a dedicated feature folder `src/features/profile/` (or strictly following my current structure).

## AI Response

"Here is the plan:

1. `src/features/profile/types/index.ts` (Bid interfaces)
2. `src/features/profile/hooks/useActiveBids.ts` (Logic)
3. `src/features/profile/components/ActiveBidsTab.tsx` (UI)
   Do you agree?"

---

## User Input (Phase 2: Execution - Logic)

**Step 1: The Logic Layer**
Yes, proceed. Please implement the **Types** and **Custom Hook** for **Active Bids**.

**Constraints:**

- **Service:** Assume `bidService.getMyBids()` exists.
- **Logic Mismatch:** The API does NOT return the 'status' (Leading/Outbid). Please calculate this inside the Hook by comparing `current_bid` vs `my_max_bid`.

**Output:** Provide code for `types.ts` and `useActiveBids.ts`.

## AI Response

_(AI generates the TypeScript interfaces and the Hook with the calculation logic)_

---

## User Input (Phase 3: Execution - UI)

**Step 2: The UI Layer**
Now implement the **UI Component**: `src/features/profile/components/ActiveBidsTab.tsx`.

**Constraints:**

- Use the `useActiveBids` hook.
- **Reference:** Here is the original Mock UI code for the table:

  ```tsx
  <Table>...</Table> // (User pastes the old table code here)
  ```

## AI Response

_(AI generates the Component using the Hook and the pasted styling)_

---

## User Input (Phase 4: Assembly)

**Final Step: Assembly**

> Now update the main UserProfilePage.tsx.

> **Tasks:**

> 1. Remove the activeBids mock array.
> 2. Remove the table code inside the "active-bids" TabsContent.
> 3. Import and render <ActiveBidsTab /> instead.

## AI Response

_(AI generates the cleaned-up UserProfilePage)_
