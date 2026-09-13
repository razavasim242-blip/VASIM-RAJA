# Security Specification: Piyush Travels & Online Seva Kendra

## Phase 0: Data Invariants & Security Architecture

### 1. Data Invariants
1. **User Privacy & Identity**: A user can only access their own user document under `/users/{userId}`. Customers cannot modify their role to `admin`.
2. **Application Ownership & Access**:
   - Authenticated customers can read and query their own submitted applications (`userId == request.auth.uid`).
   - Anyone can create an application if it passes strict validation (`isValidApplication`), capturing customer service requests for online government certificates.
   - Applications with `userId` set must match `request.auth.uid` if the request is authenticated.
   - Only Admins or the applicant can update specific application fields. Customers cannot modify sensitive internal operator notes or terminal statuses once completed.
   - Operators/Admins (`/admins/{adminId}`) have full review and status update rights.
3. **Immutability Invariants**:
   - `id`, `serviceId`, and initial creation details cannot be modified maliciously to alter applicant identity.
4. **Denial of Wallet Protection**:
   - All text fields are strictly bounded (string lengths `<= 200` or `<= 500` for addresses/notes).
   - Array of documents bounded by `.size() <= 10`.

### 2. The "Dirty Dozen" Malicious Payloads (Tested to be Rejected)
1. **Self-Escalation Payload**: A customer writing `{ "role": "admin" }` to `/users/{userId}`. (Result: PERMISSION_DENIED)
2. **Ghost Field Payload**: An application payload containing an illegal unmapped ghost field `isFreePass: true`. (Result: PERMISSION_DENIED)
3. **Oversized String Payload**: An applicant address with > 2000 characters to waste bandwidth. (Result: PERMISSION_DENIED)
4. **ID Spoofing**: Submitting an application claiming `userId: 'victim-uid-123'` while authenticated as `'attacker-uid-456'`. (Result: PERMISSION_DENIED)
5. **Cross-User Snooping**: Attempting to read another user's private application without admin authorization. (Result: PERMISSION_DENIED)
6. **Negative Payment Exploitation**: An application created with negative `amountPaid: -500`. (Result: PERMISSION_DENIED)
7. **Terminal State Tampering**: An applicant trying to revert a 'completed' or 'ready_for_pickup' status back to 'submitted'. (Result: PERMISSION_DENIED)
8. **Malicious Document Injection**: An array with > 15 fake document items. (Result: PERMISSION_DENIED)
9. **Blanket Query Scraping**: Attempting a collection list query across all applications without matching `userId`. (Result: PERMISSION_DENIED)
10. **Admin List Hijacking**: An authenticated non-admin trying to write to `/admins/{anyId}`. (Result: PERMISSION_DENIED)
11. **Malicious ID Poisoning**: Trying to create a document with an invalid 2KB ID with special characters like `/` or control chars. (Result: PERMISSION_DENIED)
12. **Unauthenticated Admin Update**: An unauthenticated or standard user attempting an operator status update. (Result: PERMISSION_DENIED)

### 3. Test Runner Design
A test runner (`firestore.rules.test.ts`) verifies that rules reject all 12 malicious attack vectors while permitting valid creation, customer queries, and admin operations.
