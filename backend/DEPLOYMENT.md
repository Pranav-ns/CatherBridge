# CaterBridge Backend Deployment Guide (AWS EC2)

This guide provides step-by-step instructions to deploy the CaterBridge Node.js/Express backend to an **AWS EC2 instance**, and configure it to work seamlessly with the **Vercel-hosted frontend** and **MongoDB Atlas**.

---

## 📋 Table of Contents
1. [Prerequisites & AWS Setup](#1-prerequisites--aws-setup)
2. [Security Group Configurations (Crucial)](#2-security-group-configurations-crucial)
3. [Method A: PM2 & Node.js Deployment (Recommended)](#3-method-a-pm2--nodejs-deployment-recommended)
4. [Method B: Docker Compose Deployment](#4-method-b-docker-compose-deployment)
5. [Configuring Nginx Reverse Proxy (Optional but Highly Recommended)](#5-configuring-nginx-reverse-proxy-optional-but-highly-recommended)
6. [Connecting Vercel Frontend to EC2 Backend](#6-connecting-vercel-frontend-to-ec2-backend)
7. [Troubleshooting & Logs](#7-troubleshooting--logs)

---

## 1. Prerequisites & AWS Setup

### Step 1: Launch an EC2 Instance
1. Log in to your [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2** and click **Launch Instance**.
3. **Name**: `caterbridge-backend`.
4. **OS Image (AMI)**: Select **Ubuntu 24.04 LTS** (or 22.04 LTS) — 64-bit (x86).
5. **Instance Type**: `t2.micro` (free-tier eligible) or `t3.micro`.
6. **Key Pair**: Select an existing key pair or create a new one (e.g., `caterbridge-key.pem`). Download it and keep it safe!
7. **Network Settings**:
   - Enable "Allow SSH traffic from Anywhwere" (or restrict it to your IP for maximum security).
   - Enable "Allow HTTP traffic from the internet".
   - Enable "Allow HTTPS traffic from the internet".
8. Click **Launch Instance**.

### Step 2: Set a Elastic IP (Optional but highly recommended)
*By default, EC2 public IPs change whenever the instance is stopped/started. To prevent your API URL from changing, allocate an Elastic IP.*
1. In the EC2 Sidebar, under **Network & Security**, click **Elastic IPs**.
2. Click **Allocate Elastic IP address** -> click **Allocate**.
3. Select your newly created Elastic IP, click **Actions**, select **Associate Elastic IP address**.
4. Select your `caterbridge-backend` instance and click **Associate**.

---

## 2. Security Group Configurations (Crucial)

To allow the frontend on Vercel and your users' browsers to communicate with your backend, you must open the correct ports in your EC2 Security Group.

1. Navigate to your EC2 instance in the AWS Console, click the **Security** tab, and click on your **Security Groups** ID.
2. Click **Edit inbound rules**.
3. Add the following rules:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | `My IP` or `0.0.0.0/0` | Access server via terminal |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Production HTTP / Nginx |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | Production HTTPS / Nginx |
| **Custom TCP** | TCP | `5001` | `0.0.0.0/0` | Direct Node.js API access (If not using Nginx) |

4. Click **Save rules**.

---

## 3. Method A: PM2 & Node.js Deployment (Recommended)

This is the standard and most direct way to host your Express backend.

### Step 1: SSH into your EC2 Instance
Open your local terminal and run:
```bash
# Change permissions on your key file so AWS allows using it
chmod 400 /path/to/caterbridge-key.pem

# SSH into the server (replace with your Elastic IP or Public DNS)
ssh -i /path/to/caterbridge-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 2: Update Server & Install Node.js
Once inside your EC2 terminal, update package lists and install Node.js using **NVM** (Node Version Manager) to get the correct version:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git curl build-essential -y

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Activate NVM in current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js (V18 LTS or V20 LTS)
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node -v
npm -v
```

### Step 3: Clone Code and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Pranav-ns/CatherBridge.git

# Move into the backend folder
cd CatherBridge/backend

# Install production dependencies
npm install --omit=dev
```

### Step 4: Configure Environment Variables
Create the `.env` file on your server:
```bash
nano .env
```
Copy and paste your production environment variables (adjust if necessary):
```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://pranavns01_db_user:sxzfO4QlAVwGBuJR@cater.rkbacef.mongodb.net/caterbridge?appName=Cater
JWT_SECRET=supersecret_caterbridge_key_2026
GEMINI_API_KEY=AIzaSyBpo7G3EZ8eWFxYcEs5ieF2RJUxWvNuc7Y
STRIPE_SECRET_KEY=sk_test_51TXFpL3azerSEcRpHeXPHsRIFvHZVlWX9itiycccbNNgFG0AWJpXAh7L5CPWLsyDXBypXj1BJ5i4A8VRurzPcJF900FswqmbgT
```
*To save and exit Nano, press `Ctrl + O`, then `Enter`, then `Ctrl + X`.*

### Step 5: Install & Configure PM2 (Process Manager)
PM2 ensures that your Node app runs in the background and restarts automatically if it crashes or the server reboots.
```bash
# Install PM2 globally
npm install -g pm2

# Start backend using PM2
pm2 start server.js --name "caterbridge-backend"

# Configure PM2 to start automatically on system boot
pm2 startup systemd
```
*Note: The `pm2 startup` command will print a command that you **must** copy and paste into the terminal to enable the boot script. Example:*
```bash
# Run the command generated by pm2 startup (looks similar to this):
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```
Then save the current PM2 process list:
```bash
pm2 save
```

### Check PM2 Status
```bash
pm2 status
pm2 logs caterbridge-backend
```

At this point, your API is live and listening on `http://YOUR_EC2_PUBLIC_IP:5001`!

---

## 4. Method B: Docker Compose Deployment

If you prefer using Docker to run your backend inside a container:

### Step 1: Install Docker & Docker Compose on EC2
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git curl -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-v2 -y

# Add ubuntu user to docker group to run commands without sudo
sudo usermod -aG docker $USER
```
*After running `usermod`, log out of SSH and log back in to apply the group membership!*

### Step 2: Align Port Configuration
> [!IMPORTANT]
> In your `.env` file, the `PORT` needs to match the exposed container port. In `docker-compose.yml`, the port mapping is `5000:5000` and the `Dockerfile` exposes `5000`.
>
> If your `.env` has `PORT=5001`, edit `docker-compose.yml` to change `5000:5000` to `5001:5001` so that requests map correctly. Or, change `.env` to `PORT=5000` to keep Docker default settings!

### Step 3: Run the Containers
```bash
# Navigate to the project root containing docker-compose.yml
cd CatherBridge

# Build and start container in detached (background) mode
docker compose up -d --build
```
Verify container status:
```bash
docker compose ps
docker compose logs -f
```

---

## 5. Configuring Nginx Reverse Proxy (Optional but Highly Recommended)

Instead of forcing your frontend to connect directly to port `5001` (which is unencrypted HTTP), you can set up Nginx as a reverse proxy. This allows Nginx to handle traffic on standard ports `80` (HTTP) and `443` (HTTPS) and forward it securely to your Node.js application running on `5001`.

### Step 1: Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### Step 2: Configure Nginx Site
Create an Nginx configuration file for CaterBridge:
```bash
sudo nano /etc/nginx/sites-available/caterbridge
```
Paste the following configuration (replace `api.caterbridge.com` with your custom domain, or use your EC2 Public IP / Public DNS if you don't have a domain yet):
```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP_OR_DOMAIN;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
*Save and exit.*

### Step 3: Enable Configuration & Restart Nginx
```bash
# Link the site to sites-enabled
sudo ln -s /etc/nginx/sites-available/caterbridge /etc/nginx/sites-enabled/

# Remove Nginx default config (if active)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```
Now Nginx is listening on port `80`, so your backend API is accessible simply at `http://YOUR_EC2_PUBLIC_IP/api/...` instead of port `5001`!

### Step 4: Secure with SSL (Let's Encrypt HTTPS)
*Note: You must have a custom domain name (e.g., `api.caterbridge.com`) pointing to your EC2 Elastic IP in your domain registrar's DNS settings (A record).*

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```
2. Get and install SSL certificate:
   ```bash
   sudo certbot --nginx -d YOUR_DOMAIN.com
   ```
3. Follow the interactive prompt. Certbot will automatically rewrite your Nginx configuration to support secure HTTPS (`443`) and redirect all HTTP traffic to HTTPS!

---

## 6. Connecting Vercel Frontend to EC2 Backend

Once your backend is running successfully on EC2, you need to configure your Vercel frontend to direct requests to the new EC2 API URL.

1. Go to your [Vercel Dashboard](https://vercel.com).
2. Click on your `CatherBridge` frontend project.
3. Go to **Settings** -> **Environment Variables**.
4. Create or edit the variable:
   - **Key**: `VITE_API_URL`
   - **Value**:
     - *If Nginx (No SSL Domain)*: `http://YOUR_EC2_PUBLIC_IP/api`
     - *If Nginx + SSL Domain*: `https://YOUR_DOMAIN.com/api`
     - *If No Nginx (Direct Port)*: `http://YOUR_EC2_PUBLIC_IP:5001/api`
5. Click **Save**.
6. Go to **Deployments**, select your latest deployment, click **Actions (three dots)**, and select **Redeploy** to build the frontend with the new API environment variable!

---

## 7. Troubleshooting & Logs

### PM2 Process Logs
If the app is failing to start or throwing runtime errors:
```bash
pm2 logs caterbridge-backend --lines 100
```

### Restarting the Server
After making changes to backend files via git pulls:
```bash
# Pull latest code
cd /home/ubuntu/CatherBridge
git pull

# Go to backend, install any new dependencies
cd backend
npm install

# Restart PM2 process
pm2 restart caterbridge-backend
```

### Nginx Logs
If you get 502 Bad Gateway or routing errors:
```bash
sudo tail -f /var/log/nginx/error.log
```

---
*Created with 💙 by Antigravity AI assistant.*
