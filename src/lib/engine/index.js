const PromptComposer = require('./prompt-composer');

function runComposer({template, baseTemplate=[], baseTemplateFields=[], templateFields}){
    const composer = new PromptComposer();
    composer.registerBaseTemplate(baseTemplate, baseTemplateFields);
    composer.registerTemplate(template, templateFields);
    return composer.render(template.name); 
}


module.exports = {
    runComposer
}


