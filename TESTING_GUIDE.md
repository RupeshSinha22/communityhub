# 🧪 CommunityHub - Testing & Demo Guide

## Quick Testing Guide

### Test Accounts (Pre-created)

Since we're using in-memory storage, create test accounts on first run:

```
Account 1:
- Email: john@example.com
- Password: password123
- First Name: John
- Last Name: Doe
- Username: johndoe

Account 2:
- Email: jane@example.com
- Password: password123
- First Name: Jane
- Last Name: Smith
- Username: janesmith
```

---

## 🧑‍💻 Manual Testing Workflow

### 1. Register First User

**Using UI:**
1. Go to `http://localhost:5173/register`
2. Fill in the form with Account 1 details
3. Click "Register"
4. You'll be logged in automatically

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  }'
```

### 2. Create a Community

**Using UI:**
1. Click "Create Community" in navbar
2. Fill form:
   - Name: Downtown Neighbors
   - Description: A place for downtown residents to connect
   - Category: general
3. Click "Create Community"

**Using curl:**
```bash
# First login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Create community
curl -X POST http://localhost:5000/api/communities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Downtown Neighbors",
    "description": "A place for downtown residents to connect",
    "category": "general"
  }'
```

### 3. Register Second User

Repeat step 1 with Account 2 details in a new browser tab or incognito window.

### 4. Second User Joins Community

**Using UI:**
1. Login with Account 2
2. Go to "Communities"
3. Click "Join Community" on the Downtown Neighbors community

### 5. Create a Post

**Using UI:**
1. Go to Home page
2. Posts from joined communities appear in feed

**Using curl:**
```bash
# Get community ID first
COMMUNITY_ID=$(curl -s http://localhost:5000/api/communities | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Hello neighbors! Great to meet everyone here.",
    "communityId": "'$COMMUNITY_ID'",
    "attachments": []
  }'
```

### 6. Like a Post

**Using UI:**
1. Click ❤️ icon on any post

**Using curl:**
```bash
# Get post ID
POST_ID=$(curl -s http://localhost:5000/api/posts/feed \
  -H "Authorization: Bearer $TOKEN" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

curl -X POST http://localhost:5000/api/posts/$POST_ID/like \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Test Scenarios

### Scenario 1: Single User Flow
1. Register user
2. Create community
3. Create posts in community
4. View feed
5. Update profile

### Scenario 2: Multi-user Collaboration
1. User A: Register & create community "Tech Group"
2. User B: Register
3. User B: Join "Tech Group"
4. User A: Create post "Welcome to the group!"
5. User B: Like the post
6. User B: Leave community

### Scenario 3: Error Handling
1. Try login with wrong password
2. Try registering with duplicate email
3. Try accessing community without being member
4. Try creating post without joining community

---

## 🔍 Debugging

### Check Backend Logs
Look at the terminal running the backend server to see:
- HTTP requests
- Validation errors
- Processing times

### Check Frontend Console
1. Open browser DevTools (F12 or right-click → Inspect)
2. Go to Console tab
3. Look for API errors and warnings

### Check API Responses
Use browser DevTools Network tab:
1. F12 → Network tab
2. Perform action
3. Click on request to see request/response

### Test Specific Endpoint
Use Postman or curl to test individual endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get all communities
curl http://localhost:5000/api/communities

# Get all users
curl http://localhost:5000/api/users
```

---

## 🎯 Test Checklist

### Authentication
- [ ] Register with valid data
- [ ] Login with valid credentials
- [ ] Get current user info
- [ ] Token expires after 24h
- [ ] Can't access protected routes without token

### Users
- [ ] View all users
- [ ] View user profile
- [ ] Update profile
- [ ] Update bio and avatar

### Communities
- [ ] View all communities
- [ ] Create community
- [ ] Join community
- [ ] Leave community
- [ ] View community members
- [ ] Only creator can edit/delete

### Posts
- [ ] Create post in community
- [ ] View community posts
- [ ] View feed from multiple communities
- [ ] Like/unlike posts
- [ ] Delete own post
- [ ] Can't delete others' posts

### Validation
- [ ] Email validation on register
- [ ] Password minimum length
- [ ] Required field validation
- [ ] Unique email check
- [ ] JWT validation

---

## 📊 Performance Testing

### Stress Test with Multiple Users
```bash
#!/bin/bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"user$i@example.com\",
      \"password\": \"password123\",
      \"firstName\": \"User\",
      \"lastName\": \"$i\",
      \"username\": \"user$i\"
    }" &
done
wait
echo "Created 10 test users"
```

### Load Test with Posts
```bash
#!/bin/bash
TOKEN="your_token_here"
COMMUNITY_ID="your_community_id_here"

for i in {1..100}; do
  curl -X POST http://localhost:5000/api/posts \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"content\": \"Test post #$i\",
      \"communityId\": \"$COMMUNITY_ID\"
    }" &
done
wait
echo "Created 100 test posts"
```

---

## 🐛 Common Issues & Fixes

### "Cannot POST /api/auth/register"
**Problem:** Backend not running
**Fix:** Start backend with `npm run dev`

### "Invalid token"
**Problem:** Token missing or invalid
**Fix:** Login again to get new token, include in Authorization header

### "Network Error"
**Problem:** Frontend can't reach backend
**Fix:** Check CORS in `backend/src/index.js`, verify backend running on 5000

### "Email already registered"
**Problem:** Trying to register with existing email
**Fix:** Use different email or login instead

### Empty feed
**Problem:** No posts from joined communities
**Fix:** Create a post in a community you've joined

---

## 📈 Analytics & Monitoring

### Check Request Performance
Backend logs show request duration:
```
[2025-11-22T14:30:15.123Z] POST /api/posts - 201 - 45ms
```

### Monitor Memory Usage
```bash
# On Windows
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory

# On Mac/Linux
free -h
```

### Check Running Processes
```bash
# See all Node processes
node -e "console.log(process.memoryUsage())"
```

---

## 🚀 Ready to Test?

1. **Start both servers:** `start.bat` (Windows) or `./start.sh` (Mac/Linux)
2. **Open frontend:** `http://localhost:5173`
3. **Follow scenarios above**
4. **Check console logs for errors**
5. **Have fun testing! 🎉**

---

## 💾 Data Persistence Note

Currently using in-memory storage (resets on server restart):
- **Pro:** No database setup needed
- **Con:** Data lost when restarting
- **Solution:** Use PostgreSQL + Prisma (Phase 2)

---

**Questions?** Check DEVELOPER_GUIDE.md or README.md
