const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { composeFields, composeKeyDefinition } = require('./field-composer');

class PromptComposer {
    constructor(masterTemplatePath = './master_prompt_template.hbs') { // easily specify final prompt layout with master template
        // Data stores
        this.baseTemplate = null;
        this.childTemplate = null;
        this.mergedFields = null;

        this.loadMasterHandlebarsTemplate(masterTemplatePath); 
    }

    // Using handlebars we can extend the feature to support complex templating
    loadMasterHandlebarsTemplate(templatePath = null) {
        try {
            const templateSource = fs.readFileSync(path.join(__dirname, templatePath), 'utf8');
            this.masterTemplate = Handlebars.compile(templateSource);
        } catch (error) {
            throw new Error(`Failed to load master template: ${error.message}`);
        }
    }

    // Register base template
    registerBaseTemplate(template, baseTemplateFields) {
        this.baseTemplate = {
            template: template,
            fields: baseTemplateFields
        };
    }

    // Register prompt template
    registerTemplate(template, templateFields) {
        this.childTemplate = {
            template: template,
            fields: templateFields
        };
    }
 
    // Template inheritance - compose template with base template (replace approach)
    composeWithBaseReplace(template, baseTemplate) {
        return {
            preamble: template.preamble || baseTemplate.preamble || '',
            prefix: template.prefix || baseTemplate.prefix || '',
            key_definition: template.key_definition || baseTemplate.key_definition || '',
            suffix: template.suffix || baseTemplate.suffix || '',
            postfix: template.postfix || baseTemplate.postfix || ''
        };
    }

    // Template inheritance - compose template with base template (append approach)
    composeWithBaseAppend(template, baseTemplate) {
        return {
            preamble: (baseTemplate.preamble || '') + (template.preamble ? '\n\n' + template.preamble : ''),
            prefix: (template.prefix || "") + (baseTemplate.prefix? "\n\n" + baseTemplate.prefix : ""),
            key_definition: (template.key_definition || "") + (baseTemplate.key_definition? "\n\n" + baseTemplate.key_definition : ""),
            suffix: (template.suffix || "") + (baseTemplate.suffix? "\n\n" + baseTemplate.suffix : ""),
            postfix: (template.postfix || "") + (baseTemplate.postfix? "\n\n" + baseTemplate.postfix : "")
        };
    }

    // Process handlebars variables in text
    processHandlebars(text, variables) {
        if (!text) return '';
        // Use Handlebars to compile and render the text with variables
        try {
            const template = Handlebars.compile(text);
            return template(variables);
        } catch (error) {
            // Fallback to simple string replacement if Handlebars compilation fails
            console.error('Template compilation error:', error);
        }
    }

    composeKeyDefinitionFromFields(){
        const templateFields = this.childTemplate.fields;
        const baseTemplateFields = this.baseTemplate.fields;
        const ignoreFields = this.baseTemplate.template?.ignore_fields || [];
        const mergedFields = composeFields(baseTemplateFields, templateFields, ignoreFields);
        this.mergedFields = mergedFields;
        return composeKeyDefinition(mergedFields);
    }

    // Main render function
    render(variables = {}) {
        const template = this.childTemplate.template;
        if (!template) throw new Error(`Template ${template.name} not found`);

        let templateData = { ...template };

        // Apply template inheritance if base_template_id exists
        if (this.baseTemplate) {
            // Use append approach to merge content
            templateData = this.composeWithBaseAppend(template, this.baseTemplate);
        }

        // Generate key_definition from fields
        const composed_key_definition = this.composeKeyDefinitionFromFields();

        // Process handlebars variables in each section using proper Handlebars compilation 
        // might be unnecessary
        const processedTemplate = {
            preamble: this.processHandlebars(templateData.preamble, variables),
            prefix: new Handlebars.SafeString(templateData.prefix),
            // key_definition: this.processHandlebars(templateData.key_definition, {composed_key_definition: new Handlebars.SafeString(composed_key_definition)}),
            key_definition: new Handlebars.SafeString(composed_key_definition),
            suffix: this.processHandlebars(templateData.suffix, variables),
            postfix: this.processHandlebars(templateData.postfix, variables)
        };

        return this.masterTemplate(processedTemplate).trim();
    }

    clear() {
        this.baseTemplate = null;
        this.childTemplate = null;
    }

    // make it possible to do
    // const {template, fields} = getMergedTemplate();
    // const prompt = runComposer({template, fields, newTemplate,});
    // this could be used for multi level inheritance
    getMergedTemplate(){
        // returns the fields composed from the base and child template
    }

    getMergedTemplate(){
        // returns the template composed from the base and child template
        // this could be used as template for the new template
    }

    getStats() {
        return {
            baseTemplate: this.baseTemplate,
            childTemplate: this.childTemplate
        };
    }
}

module.exports = PromptComposer; 