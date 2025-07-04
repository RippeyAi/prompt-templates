const PromptComposer = require('./prompt-composer');

// Create multiple composer instances for different use cases
const supplyChainComposer = new PromptComposer();
const testComposer = new PromptComposer();

console.log('🚀 Advanced PromptComposer Demo');
console.log('=' .repeat(60));

// === Supply Chain Composer Setup ===
console.log('\n📦 Setting up Supply Chain Composer...');

// Create supply chain base template
const scBaseTemplate = {
    _id: "sc_base_001",
    name: "supply_chain_base",
    preamble: "You are an expert supply chain AI assistant.",
    prefix: "Your task is to extract structured data from supply chain documents.",
    suffix: "USER: {{input}}",
    postfix: "AI: Provide only the JSON output without additional text."
};

// Create BOL template
const bolTemplate = {
    _id: "bol_001",
    base_template_identifier: "sc_base_001",
    name: "bill_of_lading_extractor",
    preamble: "You specialize in Bill of Lading document processing.",
    prefix: "Extract the following BOL details with precision:"
};

// Create Invoice template  
const invoiceTemplate = {
    _id: "inv_001",
    base_template_identifier: "sc_base_001",
    name: "commercial_invoice_extractor",
    preamble: "You specialize in Commercial Invoice document processing.",
    prefix: "Extract the following invoice details:"
};

// Register templates
supplyChainComposer.registerBaseTemplate(scBaseTemplate);
supplyChainComposer.registerTemplate(bolTemplate);
supplyChainComposer.registerTemplate(invoiceTemplate);

// Create base fields
const baseFields = [
    {
        operation_id: "op_001",
        prompt_template_id: "sc_base_001",
        name: "Document Type",
        key: "document_type",
        type: "string",
        order: 1,
        hint: "Type of document (BOL, Invoice, etc.)"
    },
    {
        operation_id: "op_001", 
        prompt_template_id: "sc_base_001",
        name: "Processing Date",
        key: "processing_date",
        type: "string",
        order: 2,
        hint: "Date when document was processed"
    }
];

// Create BOL-specific fields
const bolFields = [
    {
        operation_id: "op_001",
        prompt_template_id: "bol_001",
        name: "BL Number",
        key: "bl_number",
        type: "string",
        order: 10,
        hint: "Bill of Lading number"
    },
    {
        operation_id: "op_001",
        prompt_template_id: "bol_001", 
        name: "Container Number",
        key: "container_number",
        type: "string",
        order: 11,
        hint: "Container identification number"
    },
    {
        operation_id: "op_001",
        prompt_template_id: "bol_001",
        name: "Vessel Name",
        key: "vessel_name",
        type: "string",
        order: 12,
        hint: "Name of the shipping vessel"
    }
];

// Create Invoice-specific fields
const invoiceFields = [
    {
        operation_id: "op_001",
        prompt_template_id: "inv_001",
        name: "Invoice Number",
        key: "invoice_number",
        type: "string",
        order: 20,
        hint: "Commercial invoice number"
    },
    {
        operation_id: "op_001",
        prompt_template_id: "inv_001",
        name: "Total Amount",
        key: "total_amount",
        type: "number",
        order: 21,
        hint: "Total invoice amount"
    },
    {
        operation_id: "op_001",
        prompt_template_id: "inv_001",
        name: "Currency",
        key: "currency",
        type: "string",
        order: 22,
        hint: "Currency code (USD, EUR, etc.)"
    }
];

// Register all fields
supplyChainComposer.registerFields(baseFields);
supplyChainComposer.registerFields(bolFields);
supplyChainComposer.registerFields(invoiceFields);

console.log('Supply Chain Composer Stats:', supplyChainComposer.getStats());

// === Generate Different Prompts ===
console.log('\n🏗️ Generating BOL Prompt...');
const bolPrompt = supplyChainComposer.render("bol_001", {
    input: "BILL OF LADING\nBL#: BOL123456\nContainer: MSKU1234567\nVessel: MV OCEAN STAR"
});

console.log('\n📄 BOL Prompt Generated:');
console.log('-'.repeat(40));
console.log(bolPrompt.substring(0, 300) + '...');

console.log('\n💰 Generating Invoice Prompt...');
const invoicePrompt = supplyChainComposer.render("inv_001", {
    input: "COMMERCIAL INVOICE\nInvoice #: INV-2024-001\nTotal: $15,000.00\nCurrency: USD"
});

console.log('\n📄 Invoice Prompt Generated:');
console.log('-'.repeat(40));
console.log(invoicePrompt.substring(0, 300) + '...');

// === Demonstrate Multiple Instances ===
console.log('\n🔄 Testing Multiple Composer Instances...');

// Test composer with different data
const testTemplate = {
    _id: "test_001",
    name: "test_template",
    preamble: "This is a test template.",
    prefix: "Test prefix",
    suffix: "Test suffix",
    postfix: "Test post suffix"
};

const testFields = [
    {
        operation_id: "test_op",
        prompt_template_id: "test_001",
        name: "Test Field",
        key: "test_field",
        type: "string",
        order: 1,
        hint: "This is a test field"
    }
];

testComposer.registerTemplate(testTemplate);
testComposer.registerFields(testFields);

console.log('Test Composer Stats:', testComposer.getStats());
console.log('Supply Chain Composer Stats:', supplyChainComposer.getStats());

// === Demonstrate Field Analysis ===
console.log('\n🔍 Field Analysis:');
const bolTemplateInfo = supplyChainComposer.getTemplate("bol_001");
console.log(`\nBOL Template Fields (${bolTemplateInfo.fields.length} total):`);
bolTemplateInfo.fields.forEach(field => {
    const source = field.prompt_template_id === "sc_base_001" ? "BASE" : "TEMPLATE";
    console.log(`  ${field.order}. ${field.name} [${source}]`);
});

const invoiceTemplateInfo = supplyChainComposer.getTemplate("inv_001");
console.log(`\nInvoice Template Fields (${invoiceTemplateInfo.fields.length} total):`);
invoiceTemplateInfo.fields.forEach(field => {
    const source = field.prompt_template_id === "sc_base_001" ? "BASE" : "TEMPLATE";
    console.log(`  ${field.order}. ${field.name} [${source}]`);
});

// === Demonstrate Clear Functionality ===
console.log('\n🧹 Testing Clear Functionality...');
console.log('Test Composer Before Clear:', testComposer.getStats());
testComposer.clear();
console.log('Test Composer After Clear:', testComposer.getStats());

console.log('\n✅ Advanced PromptComposer Demo Complete!');
console.log('🎯 Key Features Demonstrated:');
console.log('  • Multiple composer instances');
console.log('  • Complex template inheritance');
console.log('  • Field composition across templates');
console.log('  • Dynamic schema generation');
console.log('  • Template analysis and introspection');
console.log('  • Data isolation between instances');
console.log('  • Clear functionality for testing'); 