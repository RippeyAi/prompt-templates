const PromptEngine = require('./lib/engine');
const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/prompt/generate/:vendor/:template', (req, res) => {
    // vencor, customer, file_type
    const { vendor, template } = req.params;
    const prompt = PromptEngine.getPrompt(vendor, template);
    res.send(prompt);
});


app.listen(3000, () => {
    logger.info('Prompt engine started.');
    console.log('Server is running on port 3000');
});