import { useState } from "react"
import {
    Users,
    Calendar,
    Settings,
    BarChart3,
    Stethoscope,
    UserPlus,
    CalendarDays,
    Bell,
    Home
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Quản lý Bác sĩ", url: "/admin/doctors", icon: Stethoscope },
    { title: "Quản lý Lịch hẹn", url: "/admin/appointments", icon: Calendar },
    { title: "Bệnh nhân", url: "/admin/patients", icon: Users },
]

const settingsItems = [
    { title: "Cài đặt", url: "/admin/settings", icon: Settings },
    { title: "Thông báo", url: "/admin/notifications", icon: Bell },
]

export function AdminSidebar() {
    const { state } = useSidebar()
    const location = useLocation()
    const currentPath = location.pathname
    const isCollapsed = state === "collapsed"

    const isActive = (path: string) => currentPath === path
    const isMainGroupExpanded = mainItems.some((item) => isActive(item.url))
    const isSettingsGroupExpanded = settingsItems.some((item) => isActive(item.url))

    const getNavCls = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
            : "hover:bg-accent hover:text-accent-foreground"

    return (
        <Sidebar
            className="transition-all duration-300 border-r shadow-lg"
            collapsible="icon"
        >
            <div className="p-4 border-b bg-gradient-to-r from-primary to-primary-glow">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    {!isCollapsed && (
                        <div className="text-white font-bold text-lg">DoctorNow</div>
                    )}
                </div>
            </div>

            <SidebarContent className="bg-card">
                <SidebarGroup className="mt-2">
                    <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4">
                        {!isCollapsed && "Quản lý chính"}
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 px-2">
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-11">
                                        <NavLink
                                            to={item.url}
                                            end
                                            className={getNavCls}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            {!isCollapsed && <span className="ml-3">{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-4">
                        {!isCollapsed && "Hệ thống"}
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 px-2">
                            {settingsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-11">
                                        <NavLink
                                            to={item.url}
                                            className={getNavCls}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            {!isCollapsed && <span className="ml-3">{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}