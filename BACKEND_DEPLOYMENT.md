# Backend Deployment Guide - HRMS Lite

Deploy your FastAPI backend to production using one of these platforms.

---

## Option 1: Render (Recommended - Easiest)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up (use GitHub for easier setup)
3. Verify your email

### Step 2: Create Database (MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project
4. Build a database cluster:
   - Choose **Free tier**
   - Select your region
   - Click **Create**
5. Set up authentication:
   - Go to **Database Access**
   - Click **Add New Database User**
   - Username: `hrms_admin`
   - Password: Generate secure password (copy it)
   - Click **Add User**
6. Configure network access:
   - Go to **Network Access**
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Confirm
7. Get connection string:
   - Click **Connect**
   - Choose **Drivers**
   - Copy connection string
   - Replace `<password>` with your password
   - Should look like: `mongodb+srv://hrms_admin:PASSWORD@cluster.mongodb.net/hrms_lite?retryWrites=true&w=majority`

### Step 3: Deploy on Render
1. Push your code to GitHub:
   ```bash
   cd /Users/aadeshparija/Documents/Daily_code/hrms-lite
   git init
   git add .
   git commit -m "Initial commit: HRMS Lite backend"
   git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
   git push -u origin main
   ```

2. Go to https://render.com/dashboard
3. Click **New +**
4. Select **Web Service**
5. Connect GitHub repository
6. Configure:
   - **Name**: `hrms-lite-backend`
   - **Environment**: `Docker`
   - **Region**: (choose closest to you)
   - **Branch**: `main`
7. Click **Advanced** and add environment variable:
   - **Key**: `MONGO_URL`
   - **Value**: Your MongoDB connection string (from Atlas)
8. Click **Deploy Web Service**
9. Wait for deployment (5-10 minutes)
10. Copy your deployed URL (e.g., `https://hrms-lite-backend.onrender.com`)

### Step 4: Test the Backend
```bash
# Health check
curl https://hrms-lite-backend.onrender.com/health

# View API docs
Open: https://hrms-lite-backend.onrender.com/docs
```

---

## Option 2: Railway

### Step 1: Create Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Set Up MongoDB (Railway)
1. In Railway dashboard, click **Create**
2. Click **Database**
3. Select **MongoDB**
4. Click **Deploy**
5. Copy connection string from **Connect** tab

### Step 3: Deploy Backend
1. Click **Create** → **GitHub Repo**
2. Select your `hrms-lite` repository
3. Configure:
   - **Service Name**: `backend`
   - **Root Directory**: `backend`
4. Add environment variables:
   - `MONGO_URL`: Your MongoDB connection string
5. Click **Deploy**
6. Your URL will appear in the **Deployments** tab

---

## Option 3: Heroku (Legacy - Free tier removed)

Heroku removed free tier. Use Render or Railway instead.

---

## Option 4: Self-Hosted (AWS/DigitalOcean)

### Using DigitalOcean App Platform (Easiest)

1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repository
4. Select `backend` folder
5. Add environment variables
6. Deploy

### Manual VPS Deployment

```bash
# 1. SSH into your server
ssh root@your_server_ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Clone repository
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite/backend

# 4. Create .env file
echo "MONGO_URL=your_mongodb_url" > .env

# 5. Build Docker image
docker build -t hrms-backend .

# 6. Run container
docker run -d \
  --name hrms-backend \
  -p 8000:8000 \
  --env-file .env \
  hrms-backend

# 7. Setup reverse proxy (Nginx)
# Install Nginx and configure to forward to localhost:8000
```

---

## Step-by-Step: Complete Deployment with Render

### Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account

### 1. MongoDB Atlas Setup (5 mins)

```
mongodb.com/cloud/atlas
  ↓
Create Free Account
  ↓
Create Project
  ↓
Create Cluster (Free Tier)
  ↓
Database Access: Add User (hrms_admin)
  ↓
Network Access: Allow 0.0.0.0/0
  ↓
Connect: Copy Connection String
```

Example: `mongodb+srv://hrms_admin:PASSWORD@cluster0.xxx.mongodb.net/hrms_lite?retryWrites=true&w=majority`

### 2. Push Code to GitHub (5 mins)

```bash
cd /Users/aadeshparija/Documents/Daily_code/hrms-lite

# Initialize git
git init

# Create .gitignore for secrets
cat > .gitignore << 'EOF'
.env
__pycache__/
*.pyc
node_modules/
dist/
.venv/
venv/
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: HRMS Lite full-stack application"

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy Backend on Render (5 mins)

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Click **Connect GitHub repo**
4. Authorize GitHub and select `hrms-lite`
5. Fill in details:
   - **Name**: `hrms-lite-backend`
   - **Region**: Select your region
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
6. Click **Advanced**:
   - **Environment**: Select your variables
   - Add **Secret file** or **Environment variable**:
     - **Key**: `MONGO_URL`
     - **Value**: Your MongoDB connection string
7. Click **Deploy Web Service**
8. Wait for build and deployment
9. Once deployed, copy your URL

### 4. Verify Backend

```bash
# Replace with your Render URL
BACKEND_URL="https://hrms-lite-backend.onrender.com"

# Test health
curl $BACKEND_URL/health

# View API docs
echo "Open: $BACKEND_URL/docs"
```

### 5. Configure Frontend to Use Hosted Backend

Update frontend API URL in `frontend/src/app/services/employee.service.ts`:

```typescript
// Change from:
private apiUrl = 'http://localhost:8000/api/employees';

// To:
private apiUrl = 'https://hrms-lite-backend.onrender.com/api/employees';
```

Do the same for `frontend/src/app/services/attendance.service.ts`.

### 6. Deploy Frontend

1. Go to https://vercel.com or https://netlify.com
2. Connect GitHub repo
3. Select `frontend` folder
4. Set environment variables:
   - `ANGULAR_APP_API_URL=https://hrms-lite-backend.onrender.com`
5. Deploy

---

## Environment Variables

### Backend (.env)

```
MONGO_URL=mongodb+srv://hrms_admin:PASSWORD@cluster0.xxx.mongodb.net/hrms_lite?retryWrites=true&w=majority
```

### For Production

Add these for security:
```
ENVIRONMENT=production
LOG_LEVEL=info
CORS_ORIGINS=https://your-frontend-url.com
```

---

## Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError`
```bash
# Solution: Rebuild Docker image
docker build --no-cache -t hrms-backend .
```

**Error**: `Connection refused` (MongoDB)
```bash
# Solution: Check MONGO_URL environment variable
# Make sure it's correct and accessible
# Verify firewall allows 0.0.0.0/0 in MongoDB Atlas
```

### Slow startup

- Render free tier goes to sleep
- Upgrade to paid tier or use Railway/DigitalOcean

### CORS errors

Add to `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Database Backup

### MongoDB Atlas Backup

1. In MongoDB Atlas, go to **Backup**
2. Click **Enable Automatic Backup**
3. Configure retention period
4. Backups run daily

### Manual Backup

```bash
# Export database
mongodump --uri "your_connection_string" --out backup/

# Import database
mongorestore --uri "your_connection_string" backup/
```

---

## Monitoring & Logs

### View Logs on Render

1. Go to Render dashboard
2. Select your service
3. Click **Logs** tab
4. View real-time logs

### Setup Alerts

1. Render → Service → Settings
2. Add email notifications
3. Configure alert conditions

---

## Cost Estimation

| Service | Free Tier | Paid |
|---------|-----------|------|
| Render Backend | No (compute) | $7-20/mo |
| MongoDB Atlas | 512 MB | $0.50-100/mo |
| Vercel Frontend | Yes | $20+/mo |
| **Total** | **Free** | **$28-140/mo** |

---

## Quick Reference

| Platform | Cost | Setup Time | Best For |
|----------|------|-----------|----------|
| **Render** | $7-20 | 10 mins | Easiest, good value |
| **Railway** | $5-50 | 10 mins | Flexible, fast |
| **DigitalOcean** | $5-50 | 20 mins | More control |
| **AWS** | $5-100+ | 30+ mins | Scale, enterprise |
| **Heroku** | N/A | N/A | Deprecated (no free) |

---

## Summary

**Recommended Path:**
1. ✅ Set up MongoDB Atlas (free)
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel/Netlify
4. ✅ Update frontend API URL
5. ✅ Test live application

**Deployed Backend URL**: `https://hrms-lite-backend.onrender.com` (example)

**Your API will be accessible at**: `https://your-backend-url.com/api/employees`

---

**Next Steps:**
1. Create MongoDB Atlas account
2. Push code to GitHub
3. Deploy on Render
4. Update frontend URL
5. Deploy frontend
6. Test live application

Ready to deploy? Start with MongoDB Atlas! 🚀
