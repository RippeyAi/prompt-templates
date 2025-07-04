# Prompt Engine

A simple functional prompt engine that composes final prompts from prompt templates and fields with handlebars template inheritance.

## Usage

See index.js for usage.

## Data Structure

**Prompt Template:**
```javascript
{
    _id: "507f1f77bcf86cd799439011",
    base_template_id: "507f1f77bcf86cd799439000", // Optional inheritance
    operation_id: "507f1f77bcf86cd799439001",
    task_id: "507f1f77bcf86cd799439003",
    name: "template_name",
    preamble: "Role and task description",
    prefix: "{{additional_instructions}}", // Handlebars variables
    suffix: "Examples and user input section",
    postfix: "Final output instructions"
}
```

 <small> Need to add sections for supporting this type of key definitions </small>
```
{{
  line_items: [
    {
        field1: string, // hint text
    
     }
  ]
}}
```

**Sections:** 
```javascript
{
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "Field Name",
    key: "field_key",
    type: "string|number",
    order: 1,
    hint: "Description of the field"
}

**Fields:**
```javascript
{
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "Field Name",
    key: "field_key",
    type: "string|number",
    order: 1,
    hint: "Description of the field"
}
```

## Files

- `prompt-engine.js` - Core engine with prompt composer
- `master_prompt_template.hbs` - Handlebars template for composition
- `index.js` - Usage example
- `data.js` - Sample data structures

## Installation

```bash
npm install
node index.js
``` 