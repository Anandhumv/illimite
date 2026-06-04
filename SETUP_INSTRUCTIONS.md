# Environment Setup Instructions for Illimité Project

## Step 1: Terminal Setup (Run these commands first)

Before talking to the AI agent, run these commands in your terminal:

```bash
# 1. Clone or pull the latest changes from your repository
git pull origin main

# 2. Go into the client directory and install dependencies
cd illimite-main/client
npm install

# 3. Go into the server directory and install dependencies  
cd ../illimite-main/server
npm install
```

## Step 2: AI Agent Prompt

Once you've run the commands above, open your IDE agent ("Ask anything..." panel) and paste this exact prompt:

```
I have just pulled my teammate's latest changes from GitHub. They have already built the Node.js/Express server skeleton, defined the NgRx data models, and successfully seeded our live Cloud Firestore database.

I need my local environment to perfectly mirror theirs so I can run the project. Please help me with the following operations:

1. Create a file named `.env` directly inside the 'illimite-server' directory. Populate it with:
   PORT=5000
   SERVICE_ACCOUNT_PATH=./firebase-key.json

2. Check if our backend dependencies (like express, dotenv, firebase-admin, cors) are structurally aligned, and tell me if I need to run any specific startup commands.

3. Note: I understand that 'firebase-key.json' is hidden via .gitignore for security. Remind me to manually grab a copy of this service account file from my teammate (or download it from our shared Firebase console) and drop it directly into my local 'illimite-server' folder.
```

## Step 3: Final Steps

After the agent creates your `.env` file:

1. Receive the `firebase-key.json` file from your teammate (via WhatsApp, Slack, Drive, etc.) and drop it into your local `illimite-main/server` folder.

2. Run `node server.js` to boot up your backend.

Because your teammate already successfully ran the seeding script, the live Firebase database is completely ready. You don't need to run `seed.js` at all—your local server will read the seeded products right out of the cloud instantly!

## Troubleshooting

If you encounter issues:
- Make sure you're in the `illimite-main/server` directory when running commands
- Verify that `firebase-key.json` is in the server directory (not client or root)
- Check that your `.env` file contains exactly:
  ```
  PORT=5000
  SERVICE_ACCOUNT_PATH=./firebase-key.json
  ```