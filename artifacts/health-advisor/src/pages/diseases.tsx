import { useListDiseases } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TriageBadge } from "@/components/triage-badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Diseases() {
  const { data: diseases, isLoading } = useListDiseases();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiseases = diseases?.filter(disease => 
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    disease.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 p-4 md:p-8 container mx-auto max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conditions Guide</h1>
          <p className="text-muted-foreground mt-1">A reference for common health conditions.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conditions..." 
            className="pl-9 bg-card border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-muted/50 border-none" />
          ))}
        </div>
      ) : filteredDiseases.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((disease) => (
            <Card key={disease.id} className="border-none shadow-sm flex flex-col hover:shadow-md transition-shadow bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <CardTitle className="text-xl leading-tight">{disease.name}</CardTitle>
                </div>
                <TriageBadge level={disease.triageLevel} className="w-fit" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {disease.description}
                </p>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Common Symptoms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {disease.commonSymptoms.slice(0, 3).map(sym => (
                      <span key={sym} className="text-xs bg-muted px-2 py-1 rounded-md font-medium text-foreground/80">
                        {sym.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {disease.commonSymptoms.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium text-muted-foreground">
                        +{disease.commonSymptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No conditions found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
