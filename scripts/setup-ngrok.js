#!/usr/bin/env node
// scripts/setup-ngrok.js
// Helper script to set up ngrok tunnel for M-Pesa callback testing

/**
 * USAGE:
 * 1. Install ngrok: npm install -g ngrok  OR  https://ngrok.com/download
 * 2. Run: node scripts/setup-ngrok.js
 * 3. Copy the MPESA_CALLBACK_URL and add to .env.local
 *
 * This script starts a tunnel and prints the callback URL to use.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('\n🚇 EduFund Portal — ngrok Setup for M-Pesa Callbacks\n')
console.log('This helper generates the M-Pesa callback URL for local development.\n')

console.log('📋 Steps to set up M-Pesa callback locally:\n')
console.log('1️⃣  Install ngrok:')
console.log('   → Visit https://ngrok.com/download OR: npm install -g ngrok\n')

console.log('2️⃣  Start your Next.js dev server:')
console.log('   → npm run dev\n')

console.log('3️⃣  In a new terminal, start ngrok:')
console.log('   → ngrok http 3000\n')

console.log('4️⃣  Copy the forwarding URL (e.g., https://abc123.ngrok.io)')
console.log('   → Set in .env.local:')
console.log('      MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payments/callback\n')

console.log('5️⃣  In Safaricom Developer Portal → Your App → M-Pesa Express:')
console.log('   → Set Callback URL to the same URL above\n')

console.log('6️⃣  Restart your dev server after updating .env.local\n')

console.log('📝 For sandbox testing, use M-Pesa test credentials:')
console.log('   → Shortcode: 174379')
console.log('   → Test Phone: 254708374149')
console.log('   → Test PIN: any 6 digits\n')

console.log('🔧 In MOCK mode (no real credentials set):')
console.log('   → ngrok is NOT required')
console.log('   → Use the "Confirm Mock Payment" button in the UI\n')

console.log('💡 Quick test with curl:')
console.log('   curl -X POST http://localhost:3000/api/health')
console.log('   → Should return: {"status":"ok",...}\n')
