1. The avatar will be replaced with the CircleUserRound icon from Lucide React, which has the same size as the previous avatar.
2.

- Please **calculate it on the fly**.
  - Since this is a school project and not a high-traffic production app (Realtime is not required), strict data consistency is more important than read performance.
  - Logic: Count the distinct products where the current user is the winner and the auction status is 'ended'.

* This term is inaccurate based on my requirements. Please refer to it as **"Positive Ratings"** (or Reputation).

  - In this system, users (both Buyers and Sellers) receive ratings of **(+1)** or **(-1)** after a transaction.
  - "User Stats" should display:

    - **Total Positive Ratings (+1)** (This is what you guessed as "Likes").
    - **Total Negative Ratings (-1)**.
    - **Rating Point %** (Calculated as: `Positives / Total Ratings`). The logic is: If a Bidder has 8 (+) and 2 (-), their score is 80%. System blocks bidding if score < 80%.

  - _Note:_ Do not confuse this with "Watchlist" (which is a list of products the user has bookmarked).

3.

- Yes, create user module.
- Return the information which is example by the mock data. As for the action for each bid, show both view and increase bid action for. If the user is leading that product, disable the increase bid action.

4. The "premium member" will be replaced with "Bidder" or "Seller" based on the user's role.

5. **For Email Changes:**
   _ **No OTP required** for this specific flow (to keep scope manageable within the project requirements).
   _ **Requirement:** Instead of OTP, strictly enforce the **"Current Password Verification"** rule. The user must enter their current password correctly to authorize any changes to sensitive fields like Email or Password, as stated in the project description.

**For Password Changes:**
_ **Yes, create a dedicated endpoint** (e.g., `PATCH /user/change-password`).
_ **Reasoning:** The project requirements list "Update Personal Info" and "Change Password" as distinct features. Separating them is cleaner because password changes involve specific logic (hashing, strictly validating the old password) that shouldn't be mixed with simple profile updates (like changing the display name).

- The avatar change will be replaced with address change.

6. **Yes, absolutely.** Creating `src/api/controllers/user.controller.ts` (along with its service and routes) is consistent with the architecture and highly recommended.

=> If you are still confusing, please ask me more. If not, start the process, remember to create a implementation plan before start coding.
