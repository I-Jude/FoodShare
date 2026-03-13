# FoodShare - Complete Testing Checklist ✅

## Setup & First Run

### 1. Start Backend
```bash
cd c:\projects\FoodShare\foodshare-backend
mvn spring-boot:run
```
✅ Backend running on: http://localhost:8080/api

### 2. Start Frontend
```bash
cd c:\projects\FoodShare\foodshare-frontend
npm install  # First time only
npm run dev
```
✅ Frontend running on: http://localhost:3000

---

## Testing as DONOR

### Register as Donor
- [ ] Go to http://localhost:3000
- [ ] Click "Register Now" button
- [ ] Fill form:
  - Username: `donor1`
  - Email: `donor1@example.com`
  - Password: `password123`
  - Full Name: `John Donor`
  - Phone: `9876543210`
  - Address: `123 Main St`
  - **Role: Donor** ← Select this
- [ ] Click "Register"
- [ ] Verify: Redirected to Home, see "Welcome, John Donor! [DONOR]"

### Verify Donor Navigation
- [ ] **Navbar should show:**
  - 🍲 FoodShare
  - 📋 My Donations ← Donor link
  - 📬 Requests ← Donor link
  - ➕ Post Food ← Donor link
  - Logout
- [ ] **Navbar should NOT show:**
  - ❌ "Browse Food" (that's for receivers)
  - ❌ "My Requests" (that's for receivers)

### Home Page as Donor
- [ ] View available food donations
- [ ] Search/filter works
- [ ] **Each donation card shows:**
  - Food image (or placeholder)
  - Food items, quantity, location, price/FREE
  - Button says: "You are a Donor" (disabled) ← NOT "Request Food"
- [ ] Verify: Donors CANNOT click "Request Food" button

### Post Food Donation
- [ ] Click "➕ Post Food" in navbar
- [ ] Fill form:
  - Event Name: `Wedding Reception`
  - Description: `Leftover Biryani`
  - Food Items: `Biryani, Desserts`
  - Quantity: `10`
  - Unit: `kg`
  - Location: `Downtown Hotel`
  - Available From: `Today 6:00 PM`
  - Available Until: `Today 10:00 PM`
  - Price: `0` (for free)
- [ ] Click "Post Donation"
- [ ] Verify: Redirected to "My Donations"

### View My Donations
- [ ] Click "📋 My Donations"
- [ ] See the donation you just posted
- [ ] Card shows:
  - Event Name
  - Food Items
  - Quantity, Location
  - Status: AVAILABLE
  - Edit & Delete buttons

### Verify No Incoming Requests Yet
- [ ] Click "📬 Requests"
- [ ] See: "No requests yet..."
- [ ] (We'll get requests after receiver creates one)

---

## Testing as RECEIVER

### Another Browser Tab / Incognito Window

### Register as Receiver
- [ ] Go to http://localhost:3000 (new tab)
- [ ] Click "Register Now"
- [ ] Fill form:
  - Username: `receiver1`
  - Email: `receiver1@example.com`
  - Password: `password123`
  - Full Name: `Jane Receiver`
  - Phone: `9876543211`
  - Address: `456 Sub St`
  - **Role: Receiver** ← Select this
- [ ] Click "Register"
- [ ] Verify: See "Welcome, Jane Receiver! [RECEIVER]"

### Verify Receiver Navigation
- [ ] **Navbar should show:**
  - 🍲 FoodShare
  - 🔍 Browse Food ← Receiver link
  - 📦 My Requests ← Receiver link
  - Logout
- [ ] **Navbar should NOT show:**
  - ❌ "My Donations" (that's for donors)
  - ❌ "Post Food" (that's for donors)
  - ❌ "Requests" (that's for donors)

### Home Page as Receiver
- [ ] View available food donations
- [ ] See the donation posted by donor
- [ ] **Each donation card shows:**
  - "📝 Request This Food" button ← Green, enabled
  - (NOT "You are a Donor" disabled button)

### Browse Food as Receiver
- [ ] Click "🔍 Browse Food"
- [ ] Same as home but dedicated page
- [ ] See donor's "Wedding Reception" donation
- [ ] Search/filter works

### Request Food
- [ ] Click "📝 Request This Food" on any donation
- [ ] Fill form:
  - Quantity Requested: `5` kg
  - Message: `We need food for 50 people at our shelter`
- [ ] Click "Submit Request"
- [ ] Verify: Redirected to "My Requests"

### View My Requests as Receiver
- [ ] Click "📦 My Requests"
- [ ] See the request:
  - Status: **PENDING** (yellow badge)
  - Donation: "Wedding Reception"
  - Qty Requested: 5
  - Button: "Cancel Request"
- [ ] Verify: Button visible for PENDING status

---

## Testing as DONOR (Switch Back)

### Check Incoming Requests
- [ ] Switch back to donor tab
- [ ] Click "📬 Requests"
- [ ] See incoming request from receiver:
  - Receiver Name & Phone
  - Quantity Requested: 5
  - Message: "We need food for 50 people at our shelter"
  - Status: **PENDING**
  - Two buttons: ✓ Approve, ✗ Reject

### Approve Request
- [ ] Click "✓ Approve" button
- [ ] Verify:
  - Status changes to: **APPROVED** (green badge)
  - Buttons disappear

---

## Testing as RECEIVER (Switch Back)

### Check Request Status Update
- [ ] Refresh "📦 My Requests"
- [ ] See request status now: **APPROVED** (green)
- [ ] Button changed to: "Mark as Completed"

### Mark as Completed
- [ ] Click "Mark as Completed"
- [ ] Verify:
  - Status: **COMPLETED** (blue badge)
  - Shows: "✓ Completed" (not a button)

---

## Testing ADMIN

### Create Admin Account (Optional)
- [ ] Register new account or ask admin to create one
- [ ] Role: ADMIN
- [ ] Email: `admin@example.com`

### View Admin Dashboard
- [ ] Login as admin
- [ ] See "⚙️ Dashboard" in navbar (only admin link)
- [ ] Dashboard shows:
  - Total Users: 2 (donor + receiver)
  - Active Donations: 1
  - User Management Table showing:
    - All users (donor, receiver, admin)
    - Username, Email, Name, Role, Status
    - Activate/Deactivate buttons

### Deactivate User
- [ ] Click "Deactivate" button for any user
- [ ] Verify: Status changes to "Inactive"
- [ ] Click "Activate": Status back to "Active"

---

## Full Workflow Test (Complete Flow)

### Complete End-to-End Journey
1. [ ] **Donor registers** → Posts food: "Wedding Reception"
2. [ ] **Receiver registers** → Sees donation on home
3. [ ] **Receiver requests** → Status: PENDING
4. [ ] **Donor approves** → Status: APPROVED for receiver
5. [ ] **Receiver completes** → Status: COMPLETED
6. [ ] **Admin views** → All users, stats, can manage accounts

---

## Error Handling Tests

### Test Invalid Login
- [ ] Try login with wrong email/password
- [ ] Verify: Error message appears

### Test Duplicate Registration
- [ ] Try register with existing email
- [ ] Verify: Error message appears

### Test Missing Fields
- [ ] Try post donation with missing fields
- [ ] Verify: Form validation prevents submit

### Test Quantity Exceeded
- [ ] Try request more quantity than available
- [ ] Verify: Backend should prevent or show warning

---

## UI/UX Verification

### Responsive Design
- [ ] Test on desktop (full width)
- [ ] Test on tablet (resize browser)
- [ ] Test on mobile (DevTools mobile view)
- [ ] Verify: All buttons, forms, text readable

### Navigation
- [ ] All navbar links work
- [ ] Logout works and clears token
- [ ] Page refresh maintains auth state
- [ ] Protected pages redirect to login if not auth

### Visual Clarity
- [ ] Emojis display correctly (🍲🔍📋📝)
- [ ] Colors distinguish status (PENDING=yellow, APPROVED=green, etc.)
- [ ] Cards have hover effects (shadow/transform)
- [ ] Buttons are clearly clickable

---

## API Verification (Optional - Using Postman)

### Login API
```
POST http://localhost:8080/api/auth/login
Body: {"email": "donor1@example.com", "password": "password123"}
Response: Token returned ✅
```

### Get All Donations
```
GET http://localhost:8080/api/donations
Response: Array of donations ✅
```

### Create Request
```
POST http://localhost:8080/api/requests
Headers: Authorization: Bearer <token>
Body: {"donationId": 1, "quantityRequested": 5, "message": "..."}
Response: Request created ✅
```

---

## Success Criteria ✅

- [ ] Donors CAN'T click "Request Food"
- [ ] Receivers CAN click "Request Food"
- [ ] Navigation shows correct links per role
- [ ] Workflows are logical and separated by role
- [ ] Status changes show correctly
- [ ] Admin can manage users
- [ ] No role confusion or illogical flows
- [ ] App is responsive
- [ ] Error handling works
- [ ] Auth/token management works

---

## If Something Breaks

### Clear Frontend Cache
```bash
npm install
npm run dev
# Or force refresh: Ctrl+Shift+R
```

### Check Backend Logs
- Look for error messages in terminal where `mvn spring-boot:run` is running
- Check MySQL is running and database exists

### Browser DevTools
- F12 → Console tab: Check for JavaScript errors
- Network tab: Check API responses (200 = success, 401 = auth error, 404 = not found)
- Storage tab: Verify token is stored in localStorage

### Database Check
```bash
mysql -u root -proot
USE foodshare_db;
SELECT * FROM users;
SELECT * FROM food_donations;
```

---

## Final Verification ✅

When everything works:
- ✅ Donors only post food
- ✅ Receivers only request food
- ✅ No role confusion
- ✅ UI is clean and logical
- ✅ All workflows work end-to-end
- ✅ Admin can manage platform

You're ready to deploy! 🚀
