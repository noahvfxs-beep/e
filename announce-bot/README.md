# Announce / Embed Bot

Two slash commands:

- **`/announce`** — opens a form asking for **Title → Message → Image URL**, then posts the announcement embed in the channel.
- **`/embed`** — asks the same three questions, then replies (only to you) with the embed preview **and** the copy-pasteable `discord.js` code for it.

## Setup

1. **Create a bot**
   - Go to https://discord.com/developers/applications → New Application.
   - Bot tab → Reset Token → copy it (this is `DISCORD_TOKEN`).
   - General Information tab → copy the **Application ID** (this is `CLIENT_ID`).
   - OAuth2 → URL Generator → check `bot` and `applications.commands` scopes, then under Bot Permissions check `Send Messages` and `Embed Links`. Open the generated URL to invite the bot to your server.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Rename `.env.example` to `.env`.
   - Fill in `DISCORD_TOKEN` and `CLIENT_ID`.
   - (Optional but recommended while testing) set `GUILD_ID` to your server's ID — right-click your server icon in Discord with Developer Mode on → Copy Server ID. Guild commands register instantly; global commands take up to ~1 hour.

4. **Register the slash commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## Running it 24/7 (even when your PC is off) — Railway

This repo includes a `railway.json` so Railway knows how to run it. Steps:

1. **Push this folder to a GitHub repo.**
   ```bash
   cd announce-bot
   git init
   git add .
   git commit -m "announce bot"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
   (`.gitignore` already excludes `.env` and `node_modules`, so your token won't get committed.)

2. **Go to https://railway.app** → sign in with GitHub → **New Project** → **Deploy from GitHub repo** → pick your repo.

3. **Set environment variables** in Railway's dashboard (Project → Variables tab, NOT in your code or in this chat):
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID` (optional — omit once you're done testing so commands work in every server the bot joins)

4. Railway will install dependencies and run `node deploy-commands.js && node index.js` automatically (from `railway.json`) — this both registers the slash commands and starts the bot every time it deploys.

5. That's it. Railway keeps the process alive, restarts it if it crashes, and it stays online whether your computer is on or off. Watch logs in the **Deployments** tab.

**If your bot token was ever pasted anywhere it shouldn't have been** (a chat, a public repo, etc.), regenerate it first: Discord Developer Portal → your app → Bot tab → **Reset Token** — the old one stops working immediately.

## Running it locally in the background (Mac/PC stays on)

If you just run `npm start`, the bot dies the moment you close that terminal window. To keep it running in the background — and have it auto-restart if it crashes or your machine reboots — use `pm2`:

```bash
npm install -g pm2

# from inside the announce-bot folder:
pm2 start ecosystem.config.js
pm2 save               # remembers this process across reboots

# (Linux/VPS only) makes pm2 itself start on boot:
pm2 startup            # it will print a command — copy/paste and run that command
```

Useful commands afterward:
```bash
pm2 status              # see if it's running
pm2 logs announce-bot   # view live logs
pm2 restart announce-bot
pm2 stop announce-bot
```

Note: this only keeps it running while the **computer itself** is on. If you turn your PC off, the bot goes offline — for true 24/7 uptime you'd want it on a VPS (Railway, Fly.io, Hetzner, etc. — see below) that's always powered on.

## Notes

- `/announce` requires the "Manage Messages" permission by default (edit `commands/announce.js` to change that).
- The embed color defaults to a pink (`#FF2DAF`, matching the swats.lol branding in your screenshot) — change `DEFAULT_COLOR` in `utils.js` if you want something else.
- Want a color question added to the form too? In `commands/announce.js` / `commands/embed.js` add a 4th `TextInputBuilder` (id `color`) and read it in `index.js` the same way `image` is read.
- Discord modals cap out at 5 fields, so Title / Message / Image leaves room for 2 more if you want to add Color and a Footer later.
