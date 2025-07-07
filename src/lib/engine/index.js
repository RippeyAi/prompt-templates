const PromptComposer = require('./prompt-composer');

function runComposer({template, baseTemplate, baseTemplateFields, templateFields}){
    const composer = new PromptComposer();

    composer.registerBaseTemplate(baseTemplate, baseTemplateFields);
    composer.registerTemplate(template, templateFields);

    const prompt = composer.render(template.name);

    return prompt;
}


module.exports = {
    runComposer
}


