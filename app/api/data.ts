export const data = {
  "users": [
    {
      "id": 1,
      "firstName": "Pascal",
      "lastName": "Ndacyayisenga",
      "email": "pascal@example.com",
      "role":"Seller",
      "password": "hashed_password_123",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-15T14:30:00.000Z",
      "company": {
        "id": 1,
        "name": "TechStore Ltd",
        "logo": "https://example.com/logos/techstore.png",
        "address": "123 Kigali Innovation City, Rwanda",
        "lowStockLevel": 10,
        "createdAt": "2025-01-01T09:00:00.000Z",
        "updatedAt": "2025-01-15T13:00:00.000Z"
      }
    },
    {
      "id": 2,
      "firstName": "Alice",
      "lastName": "Wang",
      "email": "alice.wang@example.com",
      "role":"Seller",
      "password": "hashed_password_456",
      "createdAt": "2025-01-05T11:00:00.000Z",
      "updatedAt": "2025-01-20T12:00:00.000Z",
      "company": {
        "id": 2,
        "name": "Global Electronics",
        "logo": "https://example.com/logos/globalelec.png",
        "address": "45 Shenzhen Tech Park, China",
        "lowStockLevel": 15,
        "createdAt": "2025-01-03T09:00:00.000Z",
        "updatedAt": "2025-01-18T13:00:00.000Z"
      }
    },
    {
      "id": 3,
      "firstName": "David",
      "lastName": "Mukasa",
      "email": "david.mukasa@example.com",
      "role":"Seller",
      "password": "hashed_password_789",
      "createdAt": "2025-01-07T09:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z",
      "company": null
    },
    {
      "id": 4,
      "firstName": "Maria",
      "lastName": "Lopez",
      "email": "maria.lopez@example.com",
      "password": "hashed_password_321",
      "role":"Seller",
      "createdAt": "2025-01-10T08:00:00.000Z",
      "updatedAt": "2025-01-22T12:00:00.000Z",
      "company": {
        "id": 3,
        "name": "SmartGadgets Inc",
        "logo": "https://example.com/logos/smartgadgets.png",
        "address": "890 Silicon Valley, USA",
        "lowStockLevel": 20,
        "createdAt": "2025-01-08T09:00:00.000Z",
        "updatedAt": "2025-01-20T10:00:00.000Z"
      }
    }
  ],
  "inventories": [
    {
      "id": 1,
      "sku": 1001,
      "productName": "Smartphone X10",
      "quantity": 50,
      "purchasePrice": 250,
      "sellingPrice": 350,
      "purchaseDate": "2025-01-05T09:00:00.000Z",
      "expirationDate": null,
      "companyId": 1,
      "createdAt": "2025-01-05T10:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    },
    {
      "id": 2,
      "sku": 1002,
      "productName": "Wireless Earbuds Pro",
      "quantity": 100,
      "purchasePrice": 40,
      "sellingPrice": 70,
      "purchaseDate": "2025-01-06T08:00:00.000Z",
      "expirationDate": null,
      "companyId": 1,
      "createdAt": "2025-01-06T08:30:00.000Z",
      "updatedAt": "2025-01-18T11:00:00.000Z"
    },
    {
      "id": 3,
      "sku": 2001,
      "productName": "4K Smart TV 55''",
      "quantity": 20,
      "purchasePrice": 400,
      "sellingPrice": 600,
      "purchaseDate": "2025-01-07T09:00:00.000Z",
      "expirationDate": null,
      "companyId": 2,
      "createdAt": "2025-01-07T10:00:00.000Z",
      "updatedAt": "2025-01-15T14:00:00.000Z"
    },
    {
      "id": 4,
      "sku": 2002,
      "productName": "Gaming Laptop Z15",
      "quantity": 15,
      "purchasePrice": 800,
      "sellingPrice": 1200,
      "purchaseDate": "2025-01-08T11:00:00.000Z",
      "expirationDate": null,
      "companyId": 2,
      "createdAt": "2025-01-08T11:30:00.000Z",
      "updatedAt": "2025-01-20T09:30:00.000Z"
    },
    {
      "id": 5,
      "sku": 3001,
      "productName": "Smartwatch Ultra",
      "quantity": 60,
      "purchasePrice": 120,
      "sellingPrice": 200,
      "purchaseDate": "2025-01-09T08:00:00.000Z",
      "expirationDate": null,
      "companyId": 3,
      "createdAt": "2025-01-09T08:30:00.000Z",
      "updatedAt": "2025-01-18T10:00:00.000Z"
    }
  ],
  "sells": [
    {
      "id": 1,
      "userId": 1,
      "inventoryId": 1,
      "quantity": 2,
      "customerName": "John Doe",
      "customerPhone": "+250788123456",
      "status": "Pending",
      "createdAt": "2025-01-15T16:00:00.000Z",
      "updatedAt": "2025-01-15T16:30:00.000Z"
    },
    {
      "id": 2,
      "userId": 2,
      "inventoryId": 2,
      "quantity": 1,
      "customerName": "Jane Smith",
      "customerPhone": "+250788654321",
      "status": "Cancelled",
      "createdAt": "2025-01-18T10:00:00.000Z",
      "updatedAt": "2025-01-18T11:00:00.000Z"
    },
    {
      "id": 3,
      "userId": 2,
      "inventoryId": 3,
      "quantity": 1,
      "customerName": "Michael Johnson",
      "customerPhone": "+8613900012345",
      "status": "Failed",
      "createdAt": "2025-01-19T09:00:00.000Z",
      "updatedAt": "2025-01-19T10:00:00.000Z"
    },
    {
      "id": 4,
      "userId": 4,
      "inventoryId": 5,
      "quantity": 3,
      "customerName": "Sarah Lee",
      "customerPhone": "+14155552671",
      "status": "Pending",
      "createdAt": "2025-01-20T15:00:00.000Z",
      "updatedAt": "2025-01-20T16:00:00.000Z"
    }
  ]
}
