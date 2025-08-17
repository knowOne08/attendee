const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const SESSION_DIR = './auth_info_baileys';

// Bot class
class LaunchLogBot {
  constructor() {
    this.sock = null;
    this.isConnected = false;
  }

  async start() {
    try {
      console.log('🚀 Starting LaunchLog WhatsApp Bot...');
      
      // Load auth state
      const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
      
      // Create socket connection
      this.sock = makeWASocket({
        auth: state,
        // Removed deprecated printQRInTerminal option
        // QR code is now handled manually in connection.update event
      });

      // Handle credentials update
      this.sock.ev.on('creds.update', saveCreds);

      // Handle connection updates
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          console.log('\n📱 QR Code for WhatsApp pairing:');
          qrcode.generate(qr, { small: true });
          console.log('\nScan this QR code with your WhatsApp to connect the bot\n');
        }
        
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('❌ Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
          
          if (shouldReconnect) {
            this.start();
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp Bot connected successfully!');
          console.log('🤖 Bot is ready to receive messages');
          console.log('📋 Send "/today" to get today\'s attendance');
          this.isConnected = true;
        }
      });

      // Handle incoming messages
      this.sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
          await this.handleMessage(msg);
        }
      });

    } catch (error) {
      console.error('❌ Error starting bot:', error);
      setTimeout(() => this.start(), 5000); // Retry after 5 seconds
    }
  }

  async handleMessage(msg) {
    try {
      const messageText = this.extractMessageText(msg);
      const chatId = msg.key.remoteJid;
      
      console.log(`📨 Received message: "${messageText}" from ${chatId}`);

      // Handle /today command
      if (messageText?.toLowerCase().trim() === '/today') {
        await this.handleTodayCommand(chatId);
      }
      // Handle help or unknown commands
      else if (messageText?.startsWith('/')) {
        await this.sendHelpMessage(chatId);
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
    }
  }

  extractMessageText(msg) {
    return msg.message?.conversation || 
           msg.message?.extendedTextMessage?.text || 
           '';
  }

  async handleTodayCommand(chatId) {
    try {
      console.log('📋 Fetching today\'s attendance...');
      
      // Show typing indicator
      await this.sock.sendPresenceUpdate('composing', chatId);
      
      // Fetch attendance data from backend
      const response = await axios.get(`${BACKEND_URL}/attendance/today`);
      const attendanceData = response.data;
      
      let replyMessage;
      
      if (attendanceData.length === 0) {
        replyMessage = '📋 *Attendance Today*\n\nNo attendance records found for today.';
      } else {
        replyMessage = '📋 *Attendance Today*\n\n';
        
        attendanceData.forEach((record, index) => {
          const time = new Date(record.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          replyMessage += `${index + 1}. ${record.userId.name} – ${time}\n`;
        });
        
        replyMessage += `\n✅ Total entries: ${attendanceData.length}`;
      }
      
      await this.sock.sendMessage(chatId, { text: replyMessage });
      console.log('✅ Sent today\'s attendance to', chatId);
      
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      
      let errorMessage = '❌ *Error*\n\nSorry, I couldn\'t fetch today\'s attendance data.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage += '\n\n🔌 Backend server might be offline. Please make sure the backend is running on ' + BACKEND_URL;
      } else if (error.response?.status === 500) {
        errorMessage += '\n\n🗄️ Database connection issue. Please try again later.';
      }
      
      await this.sock.sendMessage(chatId, { text: errorMessage });
    }
  }

  async sendHelpMessage(chatId) {
    const helpMessage = `🤖 *LaunchLog Attendance Bot*

Available commands:

📋 */today* - Get today's attendance records

ℹ️ *Help & Support*
This bot helps you check attendance records for the LaunchLog system.

For technical support, contact the system administrator.`;

    await this.sock.sendMessage(chatId, { text: helpMessage });
    console.log('ℹ️ Sent help message to', chatId);
  }

  async stop() {
    if (this.sock) {
      await this.sock.logout();
      console.log('👋 Bot disconnected');
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down bot...');
  if (bot) {
    await bot.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down bot...');
  if (bot) {
    await bot.stop();
  }
  process.exit(0);
});

// Start the bot
const bot = new LaunchLogBot();
bot.start().catch(console.error);

console.log('🔄 LaunchLog WhatsApp Bot starting...');
console.log('📱 Make sure you have WhatsApp installed on your phone to scan the QR code');
