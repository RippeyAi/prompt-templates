const { runComposer } = require("./engine");
const { getFieldsAndTemplates } = require("./helpers/file-reader");

const getPromptFromConfig = (vendor, templateName) =>{
    const {templateFields, template, baseTemplate, baseTemplateFields} = getFieldsAndTemplates(vendor, templateName);
    const prompt = runComposer({template, baseTemplate, baseTemplateFields, templateFields});
    console.log(prompt);
    return prompt;
}
getPromptFromConfig("koerber", "ap");
module.exports = {
    getPromptFromConfig
}