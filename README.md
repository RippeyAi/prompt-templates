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
- `src/lib/engine/master_prompt_template.hbs` - Handlebars template for composition, can be used in future for complex composition like inserting key definitions anywhere in the prefix, suffix preamble just by adding placeholder like {{composed_key_definition}} inside the string
(or can be removed)
- `templates` - Sample file structured prompt config data
-  `data` - Sample db structure prompt config data

## Usage

- Run the installation
```bash
yarn install
```

### Run through CLI
```bash
yarn engine generate customerName vendorName templateName
```

Example: 
```bash
yarn engine generate koerber cosco bol_details_generic
```

# Fields Composition
**Query**
- For fields composition, only key and the corresponding hint string is finally used, even field name is not in use should we keep it in field schema ?
- Should we always merge hints, replace hints or allow flexibility?