const PromptEngine = require("./lib/engine");
const { getFieldsAndTemplates } = require("./lib/helpers/file-reader");

const getPromptFromConfig = (customer, vendor, templateName) =>{
    const {templateFields, template, baseTemplate, baseTemplateFields} = getFieldsAndTemplates(customer,vendor, templateName);
    const prompt = PromptEngine.runComposer({template, baseTemplate, baseTemplateFields, templateFields});
    console.log(prompt);
    return prompt;
}

getPromptFromConfig("koerber", "ap");

module.exports = { 
    getPromptFromConfig
}