const MergeStrategy = {
  REPLACE: "replace",
  APPEND: "append",
};

class FieldsComposer {
  constructor() {
    this.mergeStrategy = MergeStrategy.APPEND;
  }

  _mergeField(baseField = {}, templateField = {}, strategy) {
    const mergedField = { ...baseField, ...templateField };

    // Handle different merge strategies
    if (strategy === MergeStrategy.REPLACE) {
      // Handle nested fields based on type
      if (["object", "array"].includes(mergedField.type)) {
        mergedField.fields = this._mergeFieldArrays(
          [],
          templateField.fields || [],
          strategy
        );
      }
    } else {
      // Merge hints for append strategy
      mergedField.hint = `${baseField.hint || ""} ${templateField.hint || ""}`;

      if (["object", "array"].includes(mergedField.type)) {
        mergedField.fields = this._mergeFieldArrays(
          baseField.fields || [],
          templateField.fields || [],
          strategy
        );
      }
    }
    return mergedField;
  }

  /**
   * Merges two arrays of fields into a flat object.
   *
   * @param {object[]} baseTemplateFields - The base template fields to merge.
   * @param {object[]} templateFields - The template fields to merge.
   * @param {string} strategy - The merge strategy to use.
   * @returns {object} A flat object containing the merged fields.
   */
  _mergeFieldArrays(
    baseTemplateFields,
    templateFields,
    strategy = this.mergeStrategy
  ) {
    const result = {};
    const processedFields = new Map();

    // Create a combined array of all fields for processing with order
    const allFields = [];
    
    // Process base fields
    baseTemplateFields.forEach((field) => {
      allFields.push({ ...field, source: 'base' });
    });

    // Process template fields
    templateFields.forEach((field) => {
      allFields.push({ ...field, source: 'template' });
    });

    // Sort all fields by order, then by source (template fields override base fields with same order)
    allFields.sort((a, b) => {
      const orderA = a.order || 999999;
      const orderB = b.order || 999999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If orders are the same, template fields come after base fields (for override behavior)
      return a.source === 'template' ? 1 : -1;
    });

    // Process fields in sorted order
    allFields.forEach((field) => {
      if (field.source === 'base') {
        // Only add base field if not already processed by a template field
        if (!processedFields.has(field.key)) {
          result[field.key] = field;
        }
      } else {
        // Template field - merge with existing or add new
        result[field.key] = this._mergeField(
          result[field.key] || {},
          field,
          strategy
        );
        processedFields.set(field.key, field);
      }
    });

    return result;
  }

  composeFields(
    baseFields,
    templateFields,
    ignoreFields = [],
    mergeStrategy = MergeStrategy.APPEND
  ) {
    //INFO: Filters out ignored fields in template from base template fields
    // does not support nested fields currently
    const filteredBaseFields = baseFields.filter(
      (field) => !ignoreFields.includes(field.key)
    );

    // Merge base and template fields
    const mergedFields = this._mergeFieldArrays(
      filteredBaseFields,
      templateFields,
      mergeStrategy
    );

    return mergedFields;
  }

  /**
   * Recursively processes a dictionary of fields to generate the definition string.
   *
   * @param {object} fieldsObject - The object of fields to process at the current level.
   * @param {number} level - The current indentation level.
   * @returns {string} A formatted string for the current level of fields.
   */
  generateDefinitionRecursive(fieldsObject, level) {
    const indent = "  ".repeat(level);
    const lines = [];
    const bracesOpen = "{{";
    const bracesClose = "}}";

    // Convert object to array of [key, data] pairs and sort by order property
    const sortedEntries = Object.entries(fieldsObject)
      .filter(([key, data]) => data && typeof data === "object") // filter out malformed entries
      .sort(([keyA, dataA], [keyB, dataB]) => {
        const orderA = dataA.order || 999999; // Fields without order go to the end
        const orderB = dataB.order || 999999;
        return orderA - orderB;
      });

    for (const [key, data] of sortedEntries) {
      // Safely get field properties, defaulting where necessary
      const fieldKey = data.key || key;
      const fieldType = data.type || "string";
      const hint = data.hint || "";

      // Clean the hint: trim whitespace and condense multiple spaces/newlines into one
      const comment = hint ? ` // ${hint}` : "";

      let line;

      // Case 1: Field is an object with nested fields
      if (fieldType === "object" && Object.keys(data.fields || {}).length) {
        const nestedContent = this.generateDefinitionRecursive(
          data.fields,
          level + 1
        );
        line = `${indent}"${fieldKey}": ${bracesOpen}\n${nestedContent}\n${indent}${bracesClose}`;
        // Case 2: Field is an array of objects with nested fields
      } else if (
        fieldType === "array" &&
        Object.keys(data.fields || {}).length
      ) {
        const arrayIndent = "  ".repeat(level + 1);
        const nestedContent = this.generateDefinitionRecursive(
          data.fields,
          level + 2
        );
        line =
          `${indent}"${fieldKey}": [${comment}\n` +
          `${arrayIndent}${bracesOpen}\n` +
          `${nestedContent}\n` +
          `${arrayIndent}${bracesClose}\n` +
          `${indent}]`;
        // Case 3: Field is a simple type (e.g., string) or an empty object/array
      } else {
        line = `${indent}"${fieldKey}": "${fieldType}",${comment}`;
      }

      lines.push(line);
    }

    // Join all generated lines with a comma and a newline. This incorrectly places comma at the end
    return lines.join(",\n");
  }

  /**
   * Composes a key definition string from a nested object of field metadata.
   *
   * @param {object} mergedFields - An object representing the hierarchical field structure.
   * @returns {string} A formatted string representing the key definitions.
   */
  composeKeyDefinition(mergedFields) {
    if (!Object.keys(mergedFields).length) {
      return " ";
    }
    const content = this.generateDefinitionRecursive(mergedFields, 1); // recursion level start at 1

    return content;
  }
}

module.exports = FieldsComposer;
