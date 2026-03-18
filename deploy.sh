git pull

pm2 stop scspace-app || true
pm2 delete scspace-app || true
pm2 save --force

pnpm self-update
pnpm i
pnpm build
pnpm migrate

pm2 start "pnpm run start" --name "scspace-app"
pm2 save
