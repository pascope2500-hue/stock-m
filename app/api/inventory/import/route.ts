// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import * as XLSX from "xlsx";
// // import { Readable } from "stream"; 
// interface FileData {
//     name: string;
//     type: string;
//     size: number;
//     arrayBuffer: () => Promise<ArrayBuffer>;
// }

// export async function POST(request: NextRequest) {
//     const companyId = request.headers.get("x-company-id");
//     try {
//         const data = await request.formData();
//         const file = data.get("file") as unknown as FileData;

//         if (!file) {
//             return NextResponse.json(
//                 { error: "No file provided" },
//                 { status: 400 }
//             );
//         }

//         // Validate file type
//         const allowedTypes = [
//             'text/csv',
//             'application/vnd.ms-excel',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         ];

//         if (!allowedTypes.includes(file.type)) {
//             return NextResponse.json(
//                 { error: "Invalid file type. Please upload CSV or Excel files." },
//                 { status: 400 }
//             );
//         }

//         let rows: any[][] = [];

//         if (file.type === 'text/csv') {
//             // Process CSV file
//             const text = await file.arrayBuffer().then(buffer =>
//                 new TextDecoder().decode(buffer)
//             );
//             rows = processCSV(text);
//         } else {
//             // Process Excel file
//             const buffer = await file.arrayBuffer();
//             rows = processExcel(buffer);
//         }

//         // Validate and insert data
//         const result = await insertDataIntoDatabase(rows);

//         return NextResponse.json({
//             message: "Data processed successfully",
//             insertedCount: result.insertedCount,
//             errors: result.errors
//         });

//     } catch (error) {
//         console.error("Error processing file:", error);
//         return NextResponse.json(
//             { error: "Failed to process file" },
//             { status: 500 }
//         );
//     }
// }

// function processCSV(csvText: string): any[][] {
//     const rows = csvText.split("\n").filter(row => row.trim() !== "");

//     return rows.map((row, index) => {
//         // Handle quoted values and commas within values
//         const values = row.split(',').map(value => {
//             let cleaned = value.trim();
//             // Remove surrounding quotes if present
//             if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
//                 cleaned = cleaned.slice(1, -1);
//             }
//             return cleaned;
//         });

//         return values;
//     });
// }

// function processExcel(buffer: ArrayBuffer): any[][] {
//     const workbook = XLSX.read(buffer, { type: 'array' });
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
// }

// async function insertDataIntoDatabase(rows: any[][]): Promise<{
//     insertedCount: number;
//     errors: string[];
// }>, companyId: string {
//     const errors: string[] = [];
//     let insertedCount = 0;

//     // Assuming first row contains headers
//     const headers = rows[0];
//     const dataRows = rows.slice(1);

//     // Validate headers (customize based on your database schema)
//     const expectedHeaders = ['sku', 'productName', 'quantity', 'purchasePrice', 'sellingPrice', 'purchaseDate', 'expirationDate']; // Example headers
//     const isValidHeaders = expectedHeaders.every(header =>
//         headers.map(h => h.toLowerCase()).includes(header.toLowerCase())
//     );

//     if (!isValidHeaders) {
//         throw new Error(`Invalid file structure. Expected headers: ${expectedHeaders.join(', ')}`);
//     }

//     for (let i = 0; i < dataRows.length; i++) {
//         try {
//             const row = dataRows[i];

//             // Skip empty rows
//             if (row.every(cell => cell === '' || cell === null || cell === undefined)) {
//                 continue;
//             }

//             // Map row data to your Prisma model (customize this part)
//             const userData = {
//                 sku: row[headers.indexOf('sku')] || '',
//                 companyId: companyId,
//                 productName: row[headers.indexOf('productName')] || '',
//                 quantity: parseInt(row[headers.indexOf('quantity')]) || 0,
//                 purchasePrice: parseFloat(row[headers.indexOf('purchasePrice')]) || 0,
//                 sellingPrice: parseFloat(row[headers.indexOf('sellingPrice')]) || 0,
//                 purchaseDate: new Date(row[headers.indexOf('purchaseDate')]) || new Date(),
//                 expirationDate: new Date(row[headers.indexOf('expirationDate')]) || new Date(),
//             };

//             // Validate data
//             //   if (!userData.email.includes('@')) {
//             //     errors.push(`Row ${i + 2}: Invalid email format`);
//             //     continue;
//             //   }

//             // Insert into database using Prisma
            
//             await prisma.inventory.create({
//                 data: userData
//             });
//             insertedCount++;
//         } catch (error) {
//             errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         }
//     }

//     return { insertedCount, errors };
// }