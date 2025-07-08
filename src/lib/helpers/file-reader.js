const fs = require('fs');
const path = require('path');

const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        throw new Error(`Failed to read JSON file: ${filePath}. ${error.message}`);
    }
};

const getFieldsAndTemplates = (client, vendor, templateName) => {
    const vendorConfigPath = path.join(__dirname, `../../../templates`, `${client}/${vendor}/${templateName}`);
    const fieldPath = path.join(vendorConfigPath, 'fields.json');
    const templatePath = path.join(vendorConfigPath, 'template.json');
    
    const templateFields = readJsonFile(fieldPath);
    const template = readJsonFile(templatePath);

    let baseTemplateFields = [];
    let baseTemplate = {};

    if (template.base_template_path) {
        const baseTemplatePath = path.join(__dirname, "../../../templates/base", template.base_template_path);
        baseTemplateFields = readJsonFile(path.join(baseTemplatePath, 'fields.json'));
        baseTemplate = readJsonFile(path.join(baseTemplatePath, 'template.json'));
    }

    return { templateFields, template, baseTemplateFields, baseTemplate };
};

module.exports = {
    getFieldsAndTemplates
};