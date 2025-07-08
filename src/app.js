const { getFieldsAndTemplates } = require('./lib/helpers/file-reader');
const PromptEngine = require('./lib/engine');
const logger = require('./lib/logger');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/prompt/generate/:client/:vendor/:template', (req, res) => {
    // vendor, customer, file_type
    const { client, vendor, template: templateName } = req.params;
    try {
        const {templateFields, template, baseTemplate, baseTemplateFields} = getFieldsAndTemplates(client, vendor, templateName);
        const prompt = PromptEngine.runComposer({template, baseTemplate, baseTemplateFields, templateFields});
        console.log(prompt);
        res.send(prompt);
    } catch (error) {
        logger.error(`Error generating prompt: ${error.message}`);
        res.status(500).send('Error generating prompt');
    }
});

app.listen(3000, () => {
    logger.info('Prompt engine started.');
    console.log('Server is running on port 3000');
});