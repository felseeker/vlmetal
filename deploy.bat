@echo off
cd /d "%~dp0"
echo === VL METAL — Deploy to Vercel ===
echo.
echo Setting up environment variables...
set TG_BOT_TOKEN=8905633150:AAG4qWzLnHsv4R2YBZMzEQtWqJDXHhio3EM
set TG_CHAT_ID=587819101
echo.
echo Deploying to Vercel...
echo NOTE: First time? Vercel will open browser for login.
echo.
npx.cmd -y vercel --prod --yes -e TG_BOT_TOKEN=%TG_BOT_TOKEN% -e TG_CHAT_ID=%TG_CHAT_ID%
echo.
echo Done! Copy the URL above and update index.html line 224.
pause
