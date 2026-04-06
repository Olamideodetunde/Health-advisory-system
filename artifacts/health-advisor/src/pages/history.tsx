import { useListSessions } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TriageBadge } from "@/components/triage-badge";
import { History as HistoryIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function History() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: sessions, isLoading: sessionsLoading } = useListSessions({
    query: {
      enabled: isAuthenticated
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
    <div className="flex-1 p-4 md:p-8 container mx-auto max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My History</h1>
          <p className="text-muted-foreground mt-1">Past symptom checks and recommendations.</p>
        </div>
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link href="/check">New Check</Link>
        </Button>
      </div>

      {sessionsLoading ? (
        <div className="space-y-4">
          <Card className="h-24 animate-pulse bg-muted/50 border-none" />
          <Card className="h-24 animate-pulse bg-muted/50 border-none" />
          <Card className="h-24 animate-pulse bg-muted/50 border-none" />
        </div>
      ) : sessions && sessions.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {sessions.map((session) => (
            <AccordionItem key={session.id} value={`session-${session.id}`} className="border-none bg-card shadow-sm rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors data-[state=open]:bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-4">
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="font-semibold text-lg line-clamp-1">{session.topCondition}</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {format(new Date(session.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <TriageBadge level={session.triageLevel} />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 border-t bg-card text-foreground">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Reported Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.symptoms.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-muted text-sm font-medium">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {session.result && (
                    <>
                      {/* @ts-ignore */}
                      {session.result.topCondition?.selfCareAdvice && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Recommended Action</h4>
                          <ul className="space-y-2">
                            {/* @ts-ignore */}
                            {session.result.topCondition.selfCareAdvice.map((advice: string, i: number) => (
                              <li key={i} className="flex gap-2 text-sm">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                      <Link href="/check">Check these symptoms again</Link>
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="border-none shadow-sm bg-muted/20 text-center py-16">
          <CardContent className="flex flex-col items-center justify-center">
            <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No history found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You have not completed any symptom checks yet. Your results will be saved here automatically.
            </p>
            <Button asChild>
              <Link href="/check">Start a symptom check</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
