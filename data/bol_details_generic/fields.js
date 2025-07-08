module.exports = [
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439000",
      "name": "Document Type",
      "key": "file_type",
      "type": "string",
      "order": 1,
      "hint": "Type of document being processed (bill_of_lading, invoice, etc.)"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439000",
      "name": "Issuer Name",
      "key": "issuer_name",
      "type": "string",
      "order": 2,
      "hint": "Name of the entity that issued the document"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439000",
      "name": "Vendor",
      "key": "vendor",
      "type": "string",
      "order": 3,
      "hint": "Vendor information"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "Bill of Lading Number",
      "key": "bill_of_lading_number",
      "type": "string",
      "order": 10,
      "hint": "Insert the Bill of Lading Number or bl_number"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "BL Type",
      "key": "bl_type",
      "type": "string",
      "order": 11,
      "hint": "Extract the BL type from the document. Look for keywords like DRAFT, ORIGINAL, COPY, SEAWAY BILL, EXPRESS, WAYBILL, or DOMESTIC"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "SCAC Code",
      "key": "scac_code",
      "type": "string",
      "order": 12,
      "hint": "Only extract if SCAC Code explicitly mentioned"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "MBL Number",
      "key": "mbl_number",
      "type": "string",
      "order": 13,
      "hint": "Master Bill of Lading number"
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "Booking Number",
      "key": "booking_number",
      "type": "string",
      "order": 14,
      "hint": "Extract the booking number or similar terms related to booking no."
    },
    {
      "operation_id": "507f1f77bcf86cd799439001",
      "prompt_template_id": "507f1f77bcf86cd799439011",
      "name": "Marks and Numbers",
      "key": "marks_and_numbers",
      "type": "string",
      "order": 15,
      "hint": "Extract the full Marks and Numbers details from the Bill of Lading"
    }
  ];