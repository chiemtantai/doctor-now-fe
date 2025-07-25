import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "../../components/AdminSidebar"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AdminSidebar />

                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-16 border-b bg-card shadow-sm">
                        <div className="flex items-center justify-between h-full px-6">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger />
                                <h1 className="text-xl font-semibold text-foreground">
                                    Admin Dashboard
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Admin User</span>
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-6 bg-gradient-to-br from-background to-accent">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}