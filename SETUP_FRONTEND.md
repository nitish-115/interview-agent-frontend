# Interview Prep Agent — Frontend Setup

## 1. Unzip and open in VS Code
Unzip to `~/Desktop/interview-agent-frontend/`, open in VS Code.

## 2. Install dependencies
```bash
npm install
```

## 3. Run locally
Make sure your backend is running (locally or on Render), then:
```bash
npm run dev
```
Open **http://localhost:3000**.

By default it points at `http://127.0.0.1:8000` (your local backend). Once your
backend is deployed on Render, update `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-interview-backend.onrender.com
```

## 4. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Interview Prep Agent frontend"
```
Create a new repo on GitHub (e.g. `interview-prep-agent-frontend`), then:
```bash
git remote add origin https://github.com/nitish-115/interview-agent-frontend
git branch -M main
git push -u origin main
```

## 5. Deploy on Vercel
1. vercel.com → Add New → Project → import this repo
2. Environment Variables → add `NEXT_PUBLIC_API_URL` = your Render backend URL
3. Deploy

You'll get a live URL like `interview-prep-agent.vercel.app`.
