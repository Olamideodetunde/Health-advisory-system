import { useAuth } from "@/lib/auth";
import { useGetSessionStats, getGetSessionStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, ArrowRight } from "lucide-react";
import { TriageBadge } from "@/components/triage-badge";
import { LogoMark } from "@/components/logo";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading, isError } = useGetSessionStats({
    query: {
      queryKey: getGetSessionStatsQueryKey(),
      enabled: isAuthenticated,
      retry: false
    }
  });

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="flex-1 p-4 md:p-8 container mx-auto max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hello, {user?.name || "there"}</h1>
          <p className="text-muted-foreground mt-1">Here is your health overview.</p>
        </div>
        <Button asChild>
          <Link href="/check">Start new check</Link>
        </Button>
      </div>

      {statsLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full md:col-span-1 lg:col-span-1 border-none shadow-sm h-32 animate-pulse bg-muted/50" />
          <Card className="col-span-full md:col-span-1 lg:col-span-1 border-none shadow-sm h-32 animate-pulse bg-muted/50" />
          <Card className="col-span-full md:col-span-2 lg:col-span-1 border-none shadow-sm h-32 animate-pulse bg-muted/50" />
        </div>
      ) : isError || !stats ? (
        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <LogoMark size={48} className="text-muted-foreground opacity-40 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No health checks yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              When you complete a symptom check, your past results and insights will appear here.
            </p>
            <Button asChild>
              <Link href="/check">Start your first check</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Sessions */}
          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-primary">Total Checks</CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed symptom checks
              </p>
            </CardContent>
          </Card>

          {/* Top Condition */}
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Most Frequent Result</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold truncate">
                {stats.topConditions && stats.topConditions.length > 0
                  ? stats.topConditions[0].condition
                  : "None"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.topConditions && stats.topConditions.length > 0
                  ? `Seen in ${stats.topConditions[0].count} checks`
                  : "Complete more checks for insights"}
              </p>
            </CardContent>
          </Card>

          {/* Recent Session */}
          <Card className="col-span-full md:col-span-2 lg:col-span-1 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Recent Check</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentSession ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-lg line-clamp-1">{stats.recentSession.topCondition}</span>
                  </div>
                  <TriageBadge level={stats.recentSession.triageLevel} />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(stats.recentSession.createdAt), "MMM d, yyyy")}
                    </span>
                    <Button variant="link" size="sm" className="px-0 h-auto" asChild>
                      <Link href={`/history?id=${stats.recentSession.id}`}>
                        View details <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">No recent checks found.</div>
              )}
            </CardContent>
          </Card>

          {/* Triage Breakdown */}
          {Object.keys(stats.triageBreakdown || {}).length > 0 && (
            <Card className="col-span-full border-none shadow-sm bg-muted/10">
              <CardHeader>
                <CardTitle>Urgency Breakdown</CardTitle>
                <CardDescription>A summary of recommended actions from your past checks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {Object.entries(stats.triageBreakdown).map(([level, count]) => {
                    const percentage = Math.round((count / stats.totalSessions) * 100);
                    let colorClass = "bg-gray-200";
                    if (level === "emergency") colorClass = "bg-red-500";
                    else if (level === "seek_doctor") colorClass = "bg-amber-500";
                    else if (level === "monitor") colorClass = "bg-yellow-400";
                    else if (level === "self_care") colorClass = "bg-emerald-500";

                    let label = level;
                    if (level === "emergency") label = "Emergency";
                    else if (level === "seek_doctor") label = "See Doctor";
                    else if (level === "monitor") label = "Monitor";
                    else if (level === "self_care") label = "Self Care";

                    return (
                      <div key={level} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{label}</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-right text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
