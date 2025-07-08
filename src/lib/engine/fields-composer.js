const MergeStrategy = {
  REPLACE: "replace",
  APPEND: "append",
};

class FieldsComposer {
  constructor() {
    this.mergeStrategy = MergeStrategy.APPEND;
  }

  mergeField(baseField = {}, templateField = {}, strategy) {
    const mergedField = { ...baseField, ...templateField };

    // Handle different merge strategies
    if (strategy === MergeStrategy.REPLACE) {
      // Handle nested fields based on type
      if (["object", "array"].includes(mergedField.type)) {
        mergedField.fields = this.mergeFieldArrays(
          [],
          templateField.fields || [],
          strategy
        );
      }
    } else {
      // Merge hints for append strategy
      mergedField.hint = `${baseField.hint || ""} ${templateField.hint || ""}`;

      // Handle nested fields based on type
      if (["object", "array"].includes(mergedField.type)) {
        mergedField.fields = this.mergeFieldArrays(
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
  mergeFieldArrays(
    baseTemplateFields,
    templateFields,
    strategy = this.mergeStrategy
  ) {
    const result = {};
    const processedFields = new Map();

    // process base fields
    baseTemplateFields.forEach((field) => {
      result[field.key] = field;
    });

    // Process template fields
    templateFields.forEach((field) => {
      result[field.key] = this.mergeField(
        result[field.key] || {},
        field,
        strategy
      );
      processedFields.set(field.key, field);
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
    const mergedFields = this.mergeFieldArrays(
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

    for (const [key, data] of Object.entries(fieldsObject)) {
      if (!data || typeof data !== "object") {
        continue; // skip malformed entries
      }

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
