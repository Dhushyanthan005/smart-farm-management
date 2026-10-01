export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  roles?: string[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Herd Management", href: "/cows", icon: "Beef" },
  { title: "Milk Production", href: "/milk", icon: "Milk" },
  { title: "Health Records", href: "/health", icon: "HeartPulse" },
  { title: "Vaccinations", href: "/vaccinations", icon: "Syringe" },
  { title: "Breeding & Calving", href: "/breeding", icon: "GitFork" },
  { title: "Feed & Nutrition", href: "/feed", icon: "Wheat" },
  { title: "Inventory", href: "/inventory", icon: "Boxes" },
  { title: "Customers", href: "/customers", icon: "Users" },
  { title: "Subscriptions", href: "/subscriptions", icon: "CalendarCheck" },
  { title: "Orders", href: "/orders", icon: "ShoppingBag" },
  { title: "Deliveries", href: "/deliveries", icon: "Truck" },
  { title: "Finance & Accounts", href: "/finance", icon: "Coins" },
  { title: "Staff & Shifts", href: "/staff", icon: "UserCheck" },
  { title: "Reports", href: "/reports", icon: "BarChart3" },
  { title: "Notifications", href: "/notifications", icon: "Bell" },
  { title: "Farm Settings", href: "/settings", icon: "Settings" },
];
