const PromptComposer = require('./prompt-composer');


function run(prompt_template_1, base_template, baseFields, templateFields, testVariables){

    // Create a new instance of PromptComposer
    const composer = new PromptComposer();

    // Register base template
    composer.registerBaseTemplate(base_template);

    // Register the prompt template
    composer.registerTemplate(prompt_template_1);

    // Register base fields (will be inherited by child templates)
    composer.registerFields(base_template._id, baseFields);

    // Register template-specific fields (will be appended to base fields)
    composer.registerFields(prompt_template_1._id, templateFields);
    const prompt = composer.render(prompt_template_1._id, testVariables);

    return prompt;

}

module.exports = {
    run
}


