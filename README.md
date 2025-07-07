# Prompt Engine

A simple functional prompt engine that composes final prompts from prompt templates and fields with handlebars template inheritance.


## Data Structure

**Prompt Template:**
```javascript
{
    base_template_name: "base_template", // Optional inheritance
    operation_id: "507f1f77bcf86cd799439001",
    task_id: "507f1f77bcf86cd799439003",
    name: "template_name",
    preamble: "Role and task description",
    prefix: "{{additional_instructions}}", // Handlebars variables
    suffix: "Examples and user input section",
    postfix: "Final output instructions"
}
```

**Fields:**
```javascript
{
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "Field Name",
    key: "field_key",
    type: "string|number|object|array", // added object and array to support nested structure
    order: 1,
    hint: "Description of the field"
}
```

## Files

- `src/lib/engine` - Core engine with prompt composer
- `src/lib/engine/master_prompt_template.hbs` - Handlebars template for composition
- `config` - Sample file structured prompt config data
-  `data` - Sample db structure prompt config data
## Installation

```bash
npm install
node index.js
``` 