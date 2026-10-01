import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beef, Milk, CalendarCheck, Truck, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Operations Dashboard"
        description="Real-time herd vitals, daily milk yields, and logistics orchestration."
      >
        <Link href="/milk">
          <Button variant="outline" size="sm">Record Milk</Button>
        </Link>
        <Link href="/cows">
          <Button size="sm">Register Cow</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Herd</CardTitle>
            <Beef className="w-4 h-4 text-[#1E3A2F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2421]">142</div>
            <p className="text-xs text-gray-500 mt-1">98 Active Lactating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Milk Yield</CardTitle>
            <Milk className="w-4 h-4 text-[#1E3A2F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2421]">1,840 L</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
            <CalendarCheck className="w-4 h-4 text-[#4D6A42]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2421]">384</div>
            <p className="text-xs text-gray-500 mt-1">Daily recurring morning delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Deliveries</CardTitle>
            <Truck className="w-4 h-4 text-[#4D6A42]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1F2421]">24</div>
            <p className="text-xs text-gray-500 mt-1">3 routes actively in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Milk Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-[#E2E5DF] rounded-md text-gray-400 text-sm">
              Milk production analytics chart placeholder (Ready for Recharts integration in Phase 5)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="font-semibold text-amber-800">5 Vaccinations Due</p>
              <p className="text-amber-700 mt-0.5">Foot-and-Mouth scheduled for Pen B cows.</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-semibold text-blue-800">Silage Stock Alert</p>
              <p className="text-blue-700 mt-0.5">Corn silage reserve below 15% threshold.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
