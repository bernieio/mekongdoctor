import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Shield, 
  Loader2,
  RefreshCw,
  UserCheck,
  UserX
} from "lucide-react";

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  province: string | null;
  created_at: string;
}

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  newThisWeek: number;
  totalDiagnoses: number;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    totalDiagnoses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-users");
      
      if (error) throw error;
      
      if (data) {
        setUsers(data.users || []);
        setStats({
          totalUsers: data.stats?.totalUsers || 0,
          activeToday: data.stats?.activeToday || 0,
          newThisWeek: data.stats?.newThisWeek || 0,
          totalDiagnoses: data.stats?.totalDiagnoses || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAdmin()) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-bold mb-2">{t("admin.accessDenied")}</h2>
              <p className="text-muted-foreground">{t("admin.accessDeniedDescription")}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
            <p className="text-muted-foreground">{t("admin.dashboardDescription")}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {t("admin.refresh")}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.totalUsers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.registeredUsers")}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.activeToday")}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeToday}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.last24Hours")}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.newThisWeek")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.newThisWeek}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.newRegistrations")}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("admin.totalDiagnoses")}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalDiagnoses}
              </div>
              <p className="text-xs text-muted-foreground">{t("admin.aiDiagnoses")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="border-2">
            <TabsTrigger value="users">{t("admin.users")}</TabsTrigger>
            <TabsTrigger value="activity">{t("admin.activity")}</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{t("admin.userManagement")}</CardTitle>
                <CardDescription>{t("admin.userManagementDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("admin.noUsers")}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.user")}</TableHead>
                        <TableHead>{t("admin.email")}</TableHead>
                        <TableHead>{t("admin.province")}</TableHead>
                        <TableHead>{t("admin.joined")}</TableHead>
                        <TableHead>{t("admin.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback>
                                  {profile.full_name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{profile.full_name || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {profile.email || "-"}
                          </TableCell>
                          <TableCell>{profile.province || "-"}</TableCell>
                          <TableCell>{formatDate(profile.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="gap-1">
                              <UserCheck className="h-3 w-3" />
                              {t("admin.active")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{t("admin.recentActivity")}</CardTitle>
                <CardDescription>{t("admin.recentActivityDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  {t("admin.activityComingSoon")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
