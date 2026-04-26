const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');

// Configuración de la IA con tu llave de entorno
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Argumentos de optimización para servidores gratuitos como Render
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--single-process'
        ],
        // Esto hace que el bot encuentre el Chrome de Render automáticamente
        executablePath: puppeteer.executablePath()
    }
});

// Mostrar el código QR en los Logs de Render
client.on('qr', (qr) => {
    console.log('-------------------------------------------');
    console.log('¡ESCANEAME ANDRU! (QR GENERADO):');
    qrcode.generate(qr, { small: true });
    console.log('-------------------------------------------');
});

client.on('ready', () => {
    console.log('¡BOT ACTIVO Y CONECTADO EXITOSAMENTE!');
});

// Responder a mensajes que empiecen con /ia
client.on('message', async (msg) => {
    if (msg.body.startsWith('/ia ')) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: msg.body.slice(4) }],
            });
            msg.reply(completion.choices[0].message.content);
        } catch (e) {
            console.error('Error en OpenAI:', e);
            msg.reply('Melón, hubo un error con la IA. Revisá los logs.');
        }
    }
});

client.initialize();
