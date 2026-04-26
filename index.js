const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: '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' });

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('¡ESCANEAME ANDRU!:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡BOT ACTIVO!');
});

client.on('message', async (msg) => {
    if (msg.body.startsWith('/ia ')) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: msg.body.slice(4) }],
            });
            msg.reply(completion.choices[0].message.content);
        } catch (e) {
            msg.reply('Error de conexión con la IA.');
        }
    }
});

client.initialize();
