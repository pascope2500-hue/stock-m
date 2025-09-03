"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Phone, Edit, Eye } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { ReusableForm } from "@/components/ReusableForm";
import { Roles, StatusList } from "@/types/resources";
import axios from "axios";
type Users = Omit<User, "password" | "company" | "createdAt" | "updatedAt">;
type Userp = Omit<User, "company" | "createdAt" | "updatedAt">;


export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [userss, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const oncloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };
  const fetchUsers = async () => {
    toast.loading("Fetching users...",{id: "fetchingUsers"});
    const users = await fetch("/api/users");
    const data = await users.json();
    setUsers(data);
    toast.dismiss("fetchingUsers");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSaveUser = async (data: Omit<Users, "id" | "status">) => {
    try {
      const save =  selectedUser ? await axios.put("/api/"+selectedUser.id+"/users/", data, ) : await axios.post("/api/users", data);
      console.log(save);
      if (selectedUser ? (save.data.status === 202) : save.data.status === 201) {
        toast.success(selectedUser ? "User updated successfully" : "User created successfully");
        oncloseModal();
        fetchUsers();
      }
    } catch (err) {
      toast.error("Error creating user");
      console.error(err);
    }
  };


  
const columns: Column<Users>[] = [
  {
    key: "firstName",
    header: "Names",
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-accent-foreground">
            {row.firstName.charAt(0).toUpperCase() +
              row.lastName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium">{row.firstName + " " + row.lastName}</p>
          <p className="text-sm text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
    render: (value) => (
      <Badge
        variant={
          value === "Admin"
            ? "default"
            : value === "Moderator"
            ? "secondary"
            : "outline"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value) => (
      <Badge
        variant={
          value === "active"
            ? "success"
            : value === "inactive"
            ? "error"
            : "warning"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (value) => (
      <div className="flex items-center space-x-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: "id",
    header: "Actions",
    render: (value, row) => (
      <div className="flex items-center space-x-2">
        {/* <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button> */}
        <Button variant="ghost" size="sm" onClick={() => {setSelectedUser(row); setModalOpen(true)}} className="cursor-pointer">
          <Edit className="h-4 w-4 cursor-pointer" />
        </Button>
      </div>
    ),
  },
];
  return (
    <DashboardLayout
      title="Users"
      subtitle="Manage your application users and their permissions"
    >
      <Toaster/>
      <div className="space-y-6">
        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  A list of all users in my Company
                </CardDescription>
              </div>
              <Button
                className="cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={userss}
              columns={columns}
              searchPlaceholder="Search users..."
              pageSize={10}
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={modalOpen}
        size="lg"
        onClose={oncloseModal}
        title="User Details"
      >
        <ReusableForm<Omit<Userp, "id">>
          fields={[
            {
              name: "firstName",
              label: "First Name",
              type: "text",
              required:  true,
            },
            {
              name: "lastName",
              label: "Last Name",
              type: "text",
              required: true,
            },
            {
              name: "phone",
              label: "Phone",
              type: "text",
              required : true,
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              required : true,
            },
            {
              name: "role",
              label: "Role",
              type: "select",
              options: Roles.filter((role) => role.value !== "Admin"),
              required: true,
              colSpan: 2,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: StatusList,
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              required: selectedUser ? false : true,
            }
          ]}
          initialValues={{
            firstName: selectedUser? selectedUser.firstName : "",
            lastName: selectedUser ? selectedUser.lastName : "",
            email: selectedUser ? selectedUser.email : "",
            role: selectedUser? selectedUser.role : "Seller",
            phone: selectedUser? selectedUser.phone :"",
            status: selectedUser? selectedUser.status : "Active",
            password: ""
          }}
          onSubmit={onSaveUser}
          submitButtonText= {selectedUser ? 'Update' : 'Create'}
        />
      </Modal>
    </DashboardLayout>
  );
}
