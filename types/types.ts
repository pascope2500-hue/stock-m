interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: Role;
    password: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
}

type Role = "Admin" | "User" | "Seller";
type UserStatus = "Active" | "Inactive";
interface Company {
    id: number;
    name: string;
    logo: string
    address: string;
    lowStockLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

interface Inventory {
    id: number;
    sku?: number | null;
    productName: string;
    quantity: number | '';
    purchasePrice: number | '';
    sellingPrice: number | '';
    purchaseDate?: Date | null;
    expirationDate?: Date | null;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
}

interface Customer {
    id: number;
    customerName: string;
    customerPhone: string;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
}
interface Sells {
    id: number;
    userId: number;
    company: Company;
    inventory: Inventory;
    quantity: number;
    totalAmount: number;
    status: Status;
    customer: Customer;
    createdAt: Date;
    updatedAt: Date;
}

enum Status {
    "Pending", "Failed", "Cancelled"
}



interface UserAuthPayload {
    id: number;
    companyId: number;
    role: Role;
    names: string;
    email: string;
    companyName: string;
    companyAddress: string;
}

