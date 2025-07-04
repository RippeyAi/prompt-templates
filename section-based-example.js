// 
const {
    registerSection,
    registerOverride,
    registerTask,
    generateSectionPrompt,
    generateTaskPrompt
} = require('./section-based-engine');

// Register the "invoice_details" section (global)
const invoiceDetailsSection = {
    section: "invoice_details",
    name: "Invoice Details",
    type: "object", // generates JSON object
    fields: [
        {
            name: "Invoice Number", 
            key: "invoice_no",
            hint: "look for fields like inv#, Invoice No:"
        },
        {
            name: "Shipment References", 
            key: "shipment_references[]",
            hint: "look for fields like MBL, shipment#, job#, create an array of strings"
        }
    ]
};

// Register the "charge_details" section (global)
const chargeDetailsSection = {
    section: "charge_details",
    name: "Charge Details", 
    type: "array", // generates JSON array
    fields: [
        {
            name: "PO Number",
            key: "po_number", 
            hint: "look for fields like PO#, Purchase Order #"
        },
        {
            name: "HS Code",
            key: "hs_code",
            hint: "look for HS data in the HS Code column"
        }
    ]
};

// Register sections
registerSection(invoiceDetailsSection);
registerSection(chargeDetailsSection);

// Register Walmart-specific override for HS Code
const walmartOverride = {
    section: "charge_details",
    issuer: "WalMart",
    fields: [
        {
            name: "HS Code",
            key: "hs_code", 
            hint: "look for HS Number of this format #####.## in the description column of the table"
        }
    ]
};

registerOverride(walmartOverride);

// Register a task that combines multiple sections
const commercialInvoiceTask = {
    name: "commercial_invoice_extraction",
    instructions: "You are an expert supply chain AI. Extract data from the commercial invoice document.",
    sections: ["invoice_details", "charge_details"]
};

registerTask(commercialInvoiceTask);

console.log('🎯 LLM 2.0 Section-Based Prompt Engine Demo');
console.log('=' .repeat(60));

// Demo 1: Generate individual section prompts
console.log('\n📋 SECTION 1: Invoice Details (Global)');
console.log('-'.repeat(40));
const invoicePrompt = generateSectionPrompt("invoice_details");
console.log(invoicePrompt.prompt);

console.log('\n📦 SECTION 2: Charge Details (Global)');
console.log('-'.repeat(40));
const chargePrompt = generateSectionPrompt("charge_details");
console.log(chargePrompt.prompt);

console.log('\n🏪 SECTION 2: Charge Details (Walmart Override)');
console.log('-'.repeat(40));
const walmartChargePrompt = generateSectionPrompt("charge_details", "WalMart");
console.log(walmartChargePrompt.prompt);

// Demo 2: Generate complete task prompt (multiple sections)
console.log('\n\n🚀 COMPLETE TASK: Commercial Invoice (Global)');
console.log('='.repeat(60));
const taskPrompt = generateTaskPrompt("commercial_invoice_extraction", null, {
    input: "COMMERCIAL INVOICE\nInvoice #: INV-2024-001\nMBL: MSKU1234567\nPO#: PO-98765\nHS Code: 1234.56"
});
console.log(taskPrompt.prompt);

console.log('\n\n🏪 COMPLETE TASK: Commercial Invoice (Walmart)');
console.log('='.repeat(60));
const walmartTaskPrompt = generateTaskPrompt("commercial_invoice_extraction", "WalMart", {
    input: "WALMART INVOICE\nInvoice #: WMT-2024-001\nDescription: Steel Pipes - HS: 73063.05\nPO#: WM-12345"
});
console.log(walmartTaskPrompt.prompt);

console.log('\n\n💡 Key Benefits:');
console.log('- ✅ Sections are reusable across tasks');
console.log('- ✅ Field overrides work per issuer');
console.log('- ✅ Prompts generate automatically from definitions');
console.log('- ✅ No prompt engineering required');
console.log('- ✅ Visual UI could easily manage this structure'); 