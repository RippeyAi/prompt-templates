// Example data structures for prompt engine

// Sample prompt_template (key_definition will be generated from fields)
const prompt_template_1 = {
    _id: "507f1f77bcf86cd799439011",
    base_template_id: "507f1f77bcf86cd799439000", // ObjectId reference to base template
    operation_id: "507f1f77bcf86cd799439001",
 //   model_id: "507f1f77bcf86cd799439002", 
    task_id: "507f1f77bcf86cd799439003",
    name: "bol_details_generic", // prompt template name
    preamble: `You are an expert supply chain AI. You are a master of supply chain logistics and natural language processing for Bill of Lading documents. Your task is to read the document given in <input> tags and extract the shipment details. You return output in JSON structured format and restrict providing any extra commentary. The keys of your output should be the fields and the values should be the correct text extracted. Remember to extract values if only explicitly mentioned.
\\n, \\t, \\f are new lines, do not include them in output.`,
    
    prefix: `Further specific instructions:
1. For bl_number the regex is ^[A-Za-z]{0,4}\\d+$ // Get from MBL number/BL number/Waybill number/Sea waybill number (always present)

Derived Format`, // prefix containing instructions
    
    // key_definition will be auto-generated from fields
    
    suffix: `Leave the values empty if you're unsure of certain keys values. But it should follow exact derived format.

USER:  
<input>  
{{input}}
</input>`, 
// suffix string instructions , this input will be replaced with the user input during processing by handlebars
// in prompt-composer render function
    
    postfix: `Remove any additional descriptive text before presenting the JSON.
Directly output the JSON structure without any introductory or explanatory sentences

AI:`
};

// Base template with base fields that will be merged
const prompt_template_2 = {
    _id: "507f1f77bcf86cd799439000",
    name: "supply_chain_base",
    preamble: "You are an expert supply chain AI. You are a master of supply chain logistics and natural language processing for supply chain documents.",
    prefix: "{{additional_instructions}}",
    // key_definition will be auto-generated from base fields
    suffix: "{{example_section}}\n\nUSER: {{input}}",
    postfix: "Remove any additional descriptive text before presenting the JSON.\nDirectly output the JSON structure without any introductory or explanatory sentences"
};

// Base template fields (common across all document types)
const baseField1 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439000", // Base template ID
    name: "Document Type",
    key: "file_type",
    type: "string",
    order: 1,
    hint: "Type of document being processed (bill_of_lading, invoice, etc.)"
};

const baseField2 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439000",
    name: "Issuer Name",
    key: "issuer_name", 
    type: "string",
    order: 2,
    hint: "Name of the entity that issued the document"
};

const baseField3 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439000",
    name: "Vendor",
    key: "vendor",
    type: "string", 
    order: 3,
    hint: "Vendor information"
};

// BOL-specific fields that will be appended to base fields
const bolField1 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    // base_field_id: "507f1f77bcf86cd799439000",  Query: Can a field have a base field i.e field level inheritance
    name: "Bill of Lading Number",
    key: "bill_of_lading_number",
    type: "string",
    order: 10,
    hint: "Insert the Bill of Lading Number or bl_number"
};

const bolField2 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "BL Type",
    key: "bl_type",
    type: "string",
    order: 11,
    hint: "Extract the BL type from the document. Look for keywords like DRAFT, ORIGINAL, COPY, SEAWAY BILL, EXPRESS, WAYBILL, or DOMESTIC"
};

const bolField3 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "SCAC Code",
    key: "scac_code",
    type: "string",
    order: 12,
    hint: "Only extract if SCAC Code explicitly mentioned"
};

const bolField4 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "MBL Number",
    key: "mbl_number",
    type: "string",
    order: 13,
    hint: "Master Bill of Lading number"
};

const bolField5 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "Booking Number",
    key: "booking_number",
    type: "string",
    order: 14,
    hint: "Extract the booking number or similar terms related to booking no."
};

const bolField6 = {
    operation_id: "507f1f77bcf86cd799439001",
    prompt_template_id: "507f1f77bcf86cd799439011",
    name: "Marks and Numbers",
    key: "marks_and_numbers",
    type: "string",
    order: 15,
    hint: "Extract the full Marks and Numbers details from the Bill of Lading"
};

// Sample input documents
const sampleBOL = `BILL OF LADING
BL Number: ABCD1234567
Date: 2024-01-20
Shipper: Export Company Ltd.
Consignee: Import Corp.

Container Details:
Container No: MSKU1234567
Seal No: SL789012
Package Type: 20x Pallets
Total Weight: 15,000 kg
Commodity: Industrial Equipment

Port of Loading: Shanghai, China
Port of Discharge: Los Angeles, USA
Vessel: MV GLOBAL TRADER
Voyage: 2024-001`;

// Test variables for rendering
const testVariables = {
    additional_instructions: 'Focus on extracting all available details accurately.',
    example_section: 'Example: For BL "ABCD1234567", extract bill_of_lading_number: "ABCD1234567"',
    input: sampleBOL
};  

//Query: The prompt should contain the placeholder for extracted content i.e input itself, Isn't it?

module.exports = {
    prompt_template_1,
    prompt_template_2,
    baseFields: [baseField1, baseField2, baseField3],
    templateFields: [bolField1, bolField2, bolField3, bolField4, bolField5, bolField6],
    input,
    testVariables
}; 