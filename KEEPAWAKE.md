# Keeping the Backend Awake (Preventing Cold Starts)

Your website's backend is hosted on a free cloud hosting tier (like Render, Railway, or Fly.io). Free tier services automatically spin down (go to sleep) after 15 to 30 minutes of inactivity to conserve resources. When a visitor first opens your site after some time:
1. The server has to boot up from scratch (a "cold start"), which takes 30 to 60 seconds.
2. During this boot time, images hosted on the server and data fetched from the database will take a long time to load or fail.

We have implemented two solutions to prevent your server from falling asleep:

---

## Solution 1: Automatic Self-Ping (Recommended & Built-in)

The backend code now includes a self-ping system. If configured, it will make a lightweight request to itself every 14 minutes, resetting the server's inactivity timer and keeping it awake.

### How to Enable:
1. Open your backend deployment dashboard (e.g., Render Dashboard).
2. Go to **Environment Variables**.
3. Add a new variable:
   - **Key**: `BACKEND_URL`
   - **Value**: `https://your-backend-service-url.onrender.com` (replace with your actual backend URL)
4. Save and redeploy. The server will now ping itself automatically to stay awake.

---

## Solution 2: External Keep-Awake Pinger (100% Reliable & Free)

Sometimes cloud providers restart servers or wipe internal timers. For 100% guaranteed uptime, you can use a free external ping service to query your backend's new `/ping` endpoint every 5-10 minutes.

### Using UptimeRobot (Free)
1. Go to [UptimeRobot](https://uptimerobot.com/) and create a free account.
2. Click **Add New Monitor**.
3. Configure the monitor details:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Joel Portfolio Backend`
   - **URL (or IP)**: `https://your-backend-service-url.onrender.com/ping` (make sure to append `/ping`)
   - **Monitoring Interval**: Every `5 minutes` or `10 minutes`
4. Click **Create Monitor**.

### Using Cron-job.org (Free Alternative)
1. Go to [Cron-job.org](https://cron-job.org/) and sign up.
2. Go to **Cronjobs** -> **Create Cronjob**.
3. Configure:
   - **Title**: `Keep Joel Website Awake`
   - **Address**: `https://your-backend-service-url.onrender.com/ping`
   - **Schedule**: `Every 10 minutes` (under User-defined / Minutes)
4. Click **Create**.

---

### Verification
You can test the endpoint yourself by visiting `https://your-backend-service-url.onrender.com/ping` in your browser. It should load instantly and return the word `pong`.
