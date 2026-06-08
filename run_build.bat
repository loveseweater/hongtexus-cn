@echo off
cd /d "D:\lds20\20260608-00-29-22-750\hongtexus"
"D:\Program Files\nodejs\npx.cmd" @cloudflare/next-on-pages > build_log.txt 2>&1
