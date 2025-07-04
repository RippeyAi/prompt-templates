// Not used but form the concept of prompt-template -> sections -> fields,



const data = {
    sections: new Map(),
    overrides: new Map(),
    tasks: new Map()
};

// Register a section definition
const registerSection = (section) => {
    data.sections.set(section.section, section);
    return section.section;
};

// Register issuer-specific field overrides
const registerOverride = (override) => {
    const key = `${override.section}_${override.issuer}`;
    data.overrides.set(key, override);
    return key;
};

// Register a task (series of sections)
const registerTask = (task) => {
    data.tasks.set(task.name, task);
    return task.name;
};

// Generate prompt text for a section
const generateSectionPrompt = (sectionName, issuer = null) => {
    const section = data.sections.get(sectionName);
    if (!section) throw new Error(`Section ${sectionName} not found`);
    
    // Get base fields
    let fields = [...section.fields];
    
    // Apply issuer overrides
    if (issuer) {
        const overrideKey = `${sectionName}_${issuer}`;
        const override = data.overrides.get(overrideKey);
        if (override) {
            // Override specific fields
            override.fields.forEach(overrideField => {
                const index = fields.findIndex(f => f.key === overrideField.key);
                if (index !== -1) {
                    fields[index] = { ...fields[index], ...overrideField };
                } else {
                    fields.push(overrideField);
                }
            });
        }
    }
    
    // Generate JSON schema
    const schemaObject = {};
    fields.forEach(field => {
        schemaObject[field.key] = field.hint ? `// hint: ${field.hint}` : '';
    });
    
    // Format based on section type
    const schema = section.type === 'array' 
        ? `[${JSON.stringify(schemaObject, null, 2)}]`
        : JSON.stringify(schemaObject, null, 2);
    
    // Generate prompt text
    const typeText = section.type === 'array' ? 'JSON array' : 'JSON';
    const prompt = `Create a ${typeText} for ${section.name} with these fields\n${schema}`;
    
    return {
        prompt,
        schema,
        fields
    };
};

// Generate complete task prompt (multiple sections)
const generateTaskPrompt = (taskName, issuer = null, variables = {}) => {
    const task = data.tasks.get(taskName);
    if (!task) throw new Error(`Task ${taskName} not found`);
    
    let fullPrompt = task.instructions || '';
    let allSchemas = [];
    
    task.sections.forEach(sectionName => {
        const sectionResult = generateSectionPrompt(sectionName, issuer);
        fullPrompt += `\n\n${sectionResult.prompt}`;
        allSchemas.push({
            section: sectionName,
            schema: sectionResult.schema,
            fields: sectionResult.fields
        });
    });
    
    // Add input section
    fullPrompt += `\n\nUSER: {{input}}`;
    
    // Process variables
    fullPrompt = fullPrompt.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const trimmedKey = key.trim();
        return variables[trimmedKey] !== undefined ? variables[trimmedKey] : match;
    });
    
    return {
        prompt: fullPrompt,
        schemas: allSchemas,
        task: task
    };
};

module.exports = {
    registerSection,
    registerOverride,
    registerTask,
    generateSectionPrompt,
    generateTaskPrompt
}; 