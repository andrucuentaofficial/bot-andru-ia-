const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Esto ayuda a consumir menos memoria
            '--disable-gpu'
        ],
        executablePath: '/usr/bin/google-chrome'
    }
});

client.on('qr', (qr) => {
    console.log('¡ESCANEAME ANDRU!:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡BOT ACTIVO EN RAILWAY!');
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
