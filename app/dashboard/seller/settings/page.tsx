"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { ThemeSwitcher } from "@/components/advanced/theme-switcher"
import { ReusableForm } from "@/components/ReusableForm"
import toast from "react-hot-toast"
import axios from "axios"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Company {
  id: number;
  name: string;
  logo: string;
  address: string;
  lowStockLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await axios.get('/api/company');
      setCompany(response.data);
    } catch (error) {
      toast.error("Failed to fetch company profile");
    } finally {
      setLoading(false);
    }
  };

  const appearanceTab = (
    <div className="space-y-6">
      <ThemeSwitcher />
    </div>
  )

  const securityTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReusableForm
            layout="vertical"
            size="full"
            fields={[
              {
                label: "Current Password",
                name: "currentPassword",
                type: "password",
                placeholder: "Enter current password",
                required: true,
                explanation: "Enter your current password to confirm changes"
              },
              {
                label: "New Password",
                name: "newPassword",
                type: "password",
                placeholder: "Enter new password",
                required: true,
              },
              {
                label: "Confirm New Password",
                name: "confirmNewPassword",
                required: true,
                type: "password",
                placeholder: "Confirm new password",
              }
            ]}
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: ""
            }}
            onSubmit={async (values) => {
              if (values.newPassword !== values.confirmNewPassword) {
                return toast.error("Passwords do not match")
              }
              await axios.put('/api/users/edit', values)
                .then(() => {
                  toast.success("Password updated successfully")
                })
                .catch((err) => {
                  toast.error(err.response.data.message)
                })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )

  const companyTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your company information and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <LoadingSpinner/>
            </div>
          ) : (
            <ReusableForm
              layout="vertical"
              size="full"
              fields={[
                {
                  label: "Company Name",
                  name: "name",
                  type: "text",
                  placeholder: "Enter company name",
                  required: true,
                },
                {
                  label: "Logo URL",
                  name: "logo",
                  type: "text",
                  placeholder: "Enter logo URL",
                  explanation: "Provide a direct link to your company logo image"
                },
                {
                  label: "Address",
                  name: "address",
                  type: "textarea",
                  placeholder: "Enter company address",
                  required: true,
                  explanation: "Enter the physical address of your company"
                },
                {
                  label: "Low Stock Level",
                  name: "lowStockLevel",
                  type: "number",
                  placeholder: "Enter low stock threshold",
                  required: true,
                  explanation: "Minimum stock level before triggering low stock alerts"
                }
              ]}
              initialValues={{
                name: company?.name || "",
                logo: company?.logo || "",
                address: company?.address || "",
                lowStockLevel: company?.lowStockLevel || 10
              }}
              onSubmit={async (values) => {
                try {
                  const response = company 
                    ? await axios.put('/api/company', values)
                    : await axios.post('/api/company', values);
                  
                  setCompany(response.data);
                  toast.success("Company profile updated successfully");
                } catch (error: any) {
                  toast.error(error.response?.data?.message || "Failed to update company profile");
                }
              }}
              submitButtonText={company ? "Update Company Profile" : "Create Company Profile"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )

  const tabItems: TabItem[] = [
    {
      id: "appearance",
      label: "Appearance",
      content: appearanceTab,
    },
    {
      id: "security",
      label: "Security",
      content: securityTab,
    },
    {
      id: "company",
      label: "Company Profile",
      content: companyTab,
    }
  ]

  return (
    <DashboardLayout title="Settings" subtitle="Configure your application preferences and account settings">
      <Tabs items={tabItems} defaultValue="appearance" />
    </DashboardLayout>
  )
}