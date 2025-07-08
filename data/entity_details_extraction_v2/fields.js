module.exports = [
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Shipper",
    "key": "shipper",
    "type": "object",
    "order": 1,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of the shipper organization"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of the shipper"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Consignee",
    "key": "consignee",
    "type": "object",
    "order": 2,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of the consignee organization"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of the consignee"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Notify Party",
    "key": "notify",
    "type": "object",
    "order": 3,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of the notify party"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of the notify party"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Carrier",
    "key": "carrier",
    "type": "object",
    "order": 4,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of the carrier (issuer)"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Cargo Pickup Location",
    "key": "cargo_pickup_location",
    "type": "object",
    "order": 5,
    "hint": "extract from \"SUPPLIER\" section when cagro pickup location is not present",
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of cargo pickup location"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of cargo pickup location"
      },
      {
        "name": "Firms Code",
        "key": "firms_code",
        "type": "string",
        "hint": "4 letter code regex: [A-Z][A-Z\\d][A-Z\\d]\\d"
      },
      {
        "name": "Zipcode",
        "key": "zipcode",
        "type": "string",
        "hint": "Zipcode of cargo pickup location"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Customs Clear",
    "key": "customs_clear",
    "type": "object",
    "order": 6,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of customs clearance entity"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of customs clearance entity"
      }
    ]
  },
  {
    "operation_id": "507f1f77bcf86cd799439001",
    "prompt_template_id": "507f1f77bcf86cd799439001",
    "name": "Cargo Return Location",
    "key": "cargo_return_location",
    "type": "object",
    "order": 7,
    "fields": [
      {
        "name": "Name",
        "key": "name",
        "type": "string",
        "hint": "Name of cargo return location"
      },
      {
        "name": "Address",
        "key": "address",
        "type": "string",
        "hint": "Address of cargo return location"
      }
    ]
  }
]; 