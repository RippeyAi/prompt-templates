const MergeStrategy = {
  REPLACE: "replace",
  APPEND: "append",
};

function mergeField(baseField = [], templateField = [], strategy) {
  const mergedField = { ...baseField, ...templateField };

  // Handle different merge strategies
  if (strategy === MergeStrategy.REPLACE) {
    // Handle nested fields based on type
    if (["object", "array"].includes(mergedField.type)) {
      mergedField.fields = mergeFieldArrays(
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
      mergedField.fields = mergeFieldArrays(
        baseField.fields || [],
        templateField.fields || [],
        strategy
      );
    }
  }
  return mergedField;
}

function mergeFieldArrays(baseFields, templateFields, strategy) {
  const result = {};
  // TODO: can optionally setup ignoring nested fields
  // with ignoreFields parameters eg: ignoreFields = ["fields.key1", "fields.key2"]

  const allFields = [...baseFields, ...templateFields];
  const processedFields = new Map();
  allFields.forEach((templateField) => {
    if (processedFields.has(templateField.key)) {
      const baseField = processedFields.get(templateField.key); // since requires the unmodified structure
      result[templateField.key] = mergeField(
        baseField,
        templateField,
        strategy
      );
    } else {
      result[templateField.key] = mergeField([], templateField, strategy);
    }
    // keep track of processed fields for merging
    processedFields.set(templateField.key, templateField);
  });
  return result;
}

function composeFields(
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
  const mergedFields = mergeFieldArrays(
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
function generateDefinitionRecursive(fieldsObject, level) {
  const indent = "  ".repeat(level);
  const lines = [];

  for (const [key, data] of Object.entries(fieldsObject)) {
    if (typeof data !== "object" || data === null) {
      continue; // Skip malformed entries
    }

    // Safely get field properties, defaulting where necessary
    const fieldKey = data.key || key;
    const fieldType = data.type || "string";
    const hintRaw = data.hint || "";

    // Clean the hint: trim whitespace and condense multiple spaces/newlines into one
    const hint = hintRaw.trim().split(/\s+/).join(" ");
    const comment = hint ? ` // ${hint}` : "";

    let line;

    // Case 1: Field is an object with nested fields
    if (
      fieldType === "object" &&
      data.fields &&
      Object.keys(data.fields).length > 0
    ) {
      const nestedContent = generateDefinitionRecursive(data.fields, level + 1);
      line = `${indent}"${fieldKey}": {${comment}\n${nestedContent}\n${indent}}`;

      // Case 2: Field is an array of objects with nested fields
    } else if (
      fieldType === "array" &&
      data.fields &&
      Object.keys(data.fields).length > 0
    ) {
      const arrayIndent = "  ".repeat(level + 1);
      const nestedContent = generateDefinitionRecursive(data.fields, level + 2);
      line =
        `${indent}"${fieldKey}": [${comment}\n` +
        `${arrayIndent}{\n` +
        `${nestedContent}\n` +
        `${arrayIndent}}\n` +
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
function composeKeyDefinition(mergedFields) {
  if (!Object.keys(mergedFields).length) {
    return " ";
  }
  const content = generateDefinitionRecursive(mergedFields, 1); // recursion level start at 1

  return content;
}

module.exports = {
  composeFields,
  composeKeyDefinition,
};
