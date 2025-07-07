const fs = require('fs');
const path = require('path');

const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        throw new Error(`Failed to read JSON file: ${filePath}. ${error.message}`);
    }
};

const getFieldsAndTemplates = (vendor, templateName) => {
    const vendorConfigPath = path.join(__dirname, `../../../config/vendor/${vendor}/${templateName}`);
    const fieldPath = path.join(vendorConfigPath, 'fields.json');
    const templatePath = path.join(vendorConfigPath, 'template.json');
    
    const templateFields = readJsonFile(fieldPath);
    const template = readJsonFile(templatePath);

    let baseTemplateFields = [];
    let baseTemplate = {};

    if (template.base_template_name) {
        const baseTemplatePath = path.join(__dirname, "../../../config/base_templates", template.base_template_name);
        baseTemplateFields = readJsonFile(path.join(baseTemplatePath, 'fields.json'));
        baseTemplate = readJsonFile(path.join(baseTemplatePath, 'template.json'));
    }

    return { templateFields, template, baseTemplateFields, baseTemplate };
};

module.exports = {
    getFieldsAndTemplates
};