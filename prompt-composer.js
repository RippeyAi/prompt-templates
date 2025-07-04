const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

class PromptComposer {
    constructor(masterTemplatePath = './master_prompt_template.hbs') {
        // Data stores
        this.data = {
            baseTemplates: new Map(),
            templates: new Map(),
            fields: new Map()
        };
        
        // Load master template
        this.masterTemplate = null;
        this.loadMasterTemplate(masterTemplatePath);
    }

    // Load and compile master template
    loadMasterTemplate(templatePath = null) {
        try {
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            this.masterTemplate = Handlebars.compile(templateSource);
        } catch (error) {
            throw new Error(`Failed to load master template: ${error.message}`);
        }
    }

    // Register base template
    registerBaseTemplate(template) {
        this.data.baseTemplates.set(template._id, template);
        return template._id;
    }

    // Register prompt template
    registerTemplate(template) {
        this.data.templates.set(template._id, template);
        return template._id;
    }

    // Register fields for templates
    registerFields(templateId, fields) {        
        this.data.fields.set(templateId, fields.sort((a, b) => a.order - b.order));
    }

    // Compose key_definition from fields
    composeKeyDefinitionFromFields(templateId, baseTemplateId = null) {
        let allFields = [];
        
        // Get base template fields if inheritance exists
        if (baseTemplateId) {
            const baseFields = this.data.fields.get(baseTemplateId) || [];
            allFields = [...baseFields];
        }
        
        // Get template-specific fields
        if (this.data.fields.has(templateId)) {
            allFields = [...allFields, ...this.data.fields.get(templateId)];
        }
        
        if (allFields.length === 0) {
            return '{}'; // Empty object if no fields
        }
        
        // Sort by order
        allFields.sort((a, b) => a.order - b.order);
        
        // Build JSON schema object from fields
        const schemaObject = {};
        allFields.forEach(field => {
            // Use empty string as default value, can be customized based on field type
            let defaultValue = '';
            if (field.type === 'number') {
                defaultValue = '';  // Keep as empty string for consistency
            } else if (field.type === 'boolean') {
                defaultValue = '';
            }
            
            schemaObject[field.key] = defaultValue;
            
            // Add comment with hint if available
            if (field.hint) {
                // Note: JSON doesn't support comments, but we can include hints in field names or descriptions
            }
        });
        
        // Convert to formatted JSON string
        return JSON.stringify([schemaObject], null, 4);
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
            prefix: template.prefix || baseTemplate.prefix || '',
            key_definition: '', // Will be generated from fields
            suffix: template.suffix || baseTemplate.suffix || '',
            postfix: template.postfix || baseTemplate.postfix || ''
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

    // Main render function
    render(templateId, variables = {}) {
        const template = this.data.templates.get(templateId);
        if (!template) throw new Error(`Template ${templateId} not found`);

        let templateData = { ...template };
        let baseTemplateId = null;

        // Apply template inheritance if base_template_id exists
        if (template.base_template_id) {
            const baseTemplate = this.data.baseTemplates.get(template.base_template_id);
            if (baseTemplate) {
                baseTemplateId = template.base_template_id;
                // Use append approach to merge content
                templateData = this.composeWithBaseAppend(template, baseTemplate);
            }
        }

        // Generate key_definition from fields
        templateData.key_definition = this.composeKeyDefinitionFromFields(templateId, baseTemplateId);

        // Process handlebars variables in each section using proper Handlebars compilation
        const processedTemplate = {
            preamble: this.processHandlebars(templateData.preamble, variables),
            prefix: this.processHandlebars(templateData.prefix, variables),
            key_definition: templateData.key_definition, // Don't process key_definition through Handlebars as it's JSON
            suffix: this.processHandlebars(templateData.suffix, variables),
            postfix: this.processHandlebars(templateData.postfix, variables)
        };

        // Use master handlebars template to render final prompt
        // The master template will handle conditional rendering and proper escaping
        return this.masterTemplate(processedTemplate).trim();
    }

    // Get template with fields
    getTemplate(templateId) {
        const template = this.data.templates.get(templateId);
        if (!template) return null;

        // Get all merged fields like in composeKeyDefinitionFromFields
        let allFields = [];
        
        // Get base template fields if inheritance exists
        if (template.base_template_id) {
            const baseFields = this.data.fields.get(template.base_template_id) || [];
            allFields = [...baseFields];
        }
        
        // Get template-specific fields
        if (this.data.fields.has(templateId)) {
            allFields = [...allFields, ...this.data.fields.get(templateId)];
        }
        
        // Sort by order
        allFields.sort((a, b) => a.order - b.order);

        const baseTemplate = template.base_template_id ? this.data.baseTemplates.get(template.base_template_id) : null;

        return {
            ...template,
            baseTemplate: baseTemplate,
            fields: allFields // Return all merged fields
        };
    }

    // Get all templates
    getAllTemplates() {
        return Array.from(this.data.templates.values());
    }

    // Get all base templates
    getAllBaseTemplates() {
        return Array.from(this.data.baseTemplates.values());
    }

    // Get fields for a template
    getFields(templateId) {
        return this.data.fields.get(templateId) || [];
    }

    // Clear all data (useful for testing)
    clear() {
        this.data.baseTemplates.clear();
        this.data.templates.clear();
        this.data.fields.clear();
    }

    // Get statistics
    getStats() {
        return {
            baseTemplates: this.data.baseTemplates.size,
            templates: this.data.templates.size,
            fieldsRegistered: this.data.fields.size
        };
    }
}

module.exports = PromptComposer; 