import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public/api/user-count');

export function hasWalletAccess(wallet: string): boolean {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.wallets.includes(wallet.toLowerCase());
}

export function addWalletAccess(wallet: string): void {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!data.wallets.includes(wallet.toLowerCase())) {
    data.wallets.push(wallet.toLowerCase());
    data.count = data.wallets.length;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

export function getAccessCount(): number {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.count;
}
