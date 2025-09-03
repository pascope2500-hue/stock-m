"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Tabs, type TabItem } from "@/components/ui/tabs"
import { ThemeSwitcher } from "@/components/advanced/theme-switcher"

export default function SettingsPage() {

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
          <FormField label="Current Password" type="password" placeholder="Enter current password" />
          <FormField label="New Password" type="password" placeholder="Enter new password" />
          <FormField label="Confirm New Password" type="password" placeholder="Confirm new password" />
          <Button>Update Password</Button>
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
      id: "campany",
      label: "Campany Profile",
      content: securityTab,
    }
  ]

  return (
    <DashboardLayout title="Settings" subtitle="Configure your application preferences and account settings">
      <Tabs items={tabItems} defaultValue="appearance" />
    </DashboardLayout>
  )
}
