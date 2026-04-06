import { useState } from "react";
import { useListSymptoms, useAnalyzeSymptoms } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriageBadge } from "@/components/triage-badge";
import { Activity, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, HeartPulse, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Check() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  
  // Form State
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [durationDays, setDurationDays] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // API Hooks
  const { data: symptomCategories, isLoading: isLoadingSymptoms } = useListSymptoms();
  const analyzeMutation = useAnalyzeSymptoms();

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    analyzeMutation.mutate({
      data: {
        symptoms: selectedSymptoms,
        age: age ? parseInt(age, 10) : undefined,
        gender: gender || undefined,
        durationDays: durationDays ? parseInt(durationDays, 10) : undefined,
        saveSession: isAuthenticated
      }
    });
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setAge("");
    setGender("");
    setDurationDays("");
    analyzeMutation.reset();
  };

  return (
    <div className="flex-1 bg-muted/10 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        
        {step < 4 && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Symptom Checker</h1>
            <p className="text-muted-foreground">Answer a few questions to get guidance on your symptoms.</p>
            
            <div className="flex items-center gap-2 mt-6">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
              <span>About You</span>
              <span>Symptoms</span>
              <span>Review</span>
            </div>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Step 1: Demographics */}
          {step === 1 && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>
                  This helps us provide more accurate guidance. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="e.g. 35" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="duration">How many days have you been feeling unwell?</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="e.g. 3" 
                    value={durationDays} 
                    onChange={e => setDurationDays(e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext} className="w-full sm:w-auto">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Symptoms */}
          {step === 2 && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>What are you experiencing?</CardTitle>
                <CardDescription>
                  Select all the symptoms that apply to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSymptoms ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-8">
                      {symptomCategories?.map((category) => (
                        <div key={category.category} className="space-y-3">
                          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-2 z-10">
                            {category.category.replace(/_/g, ' ')}
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {category.symptoms.map((symptom) => (
                              <div 
                                key={symptom.id} 
                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                                  selectedSymptoms.includes(symptom.id) 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-border hover:bg-muted/50'
                                }`}
                                onClick={() => toggleSymptom(symptom.id)}
                              >
                                <Checkbox 
                                  id={`symptom-${symptom.id}`} 
                                  checked={selectedSymptoms.includes(symptom.id)}
                                  onCheckedChange={() => toggleSymptom(symptom.id)}
                                  className="mt-0.5"
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label 
                                    htmlFor={`symptom-${symptom.id}`}
                                    className="font-medium text-sm cursor-pointer"
                                  >
                                    {symptom.label}
                                  </label>
                                  {symptom.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {symptom.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={selectedSymptoms.length === 0}
                >
                  Review ({selectedSymptoms.length}) <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Review</CardTitle>
                <CardDescription>
                  Make sure everything looks correct before we analyze.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Age</span>
                      <span className="font-medium">{age || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Gender</span>
                      <span className="font-medium capitalize">{gender || "Not specified"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">Duration of symptoms</span>
                      <span className="font-medium">{durationDays ? `${durationDays} days` : "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Selected Symptoms ({selectedSymptoms.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(id => {
                      const symptom = symptomCategories?.flatMap(c => c.symptoms).find(s => s.id === id);
                      return (
                        <div key={id} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          {symptom?.label || id}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleAnalyze} size="lg" className="px-8">
                  Get Guidance
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-6">
              {analyzeMutation.isPending ? (
                <Card className="border-none shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Activity className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Analyzing your symptoms</h3>
                  <p className="text-muted-foreground">Gathering insights and recommendations...</p>
                </Card>
              ) : analyzeMutation.isError ? (
                <Card className="border-none shadow-sm border-destructive/20 bg-destructive/5">
                  <CardContent className="flex flex-col items-center text-center pt-8 pb-8">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-xl font-bold mb-2">We couldn't complete the analysis</h3>
                    <p className="text-muted-foreground mb-6">There was an issue processing your symptoms. Please try again.</p>
                    <Button onClick={handleAnalyze} variant="outline">Try Again</Button>
                  </CardContent>
                </Card>
              ) : analyzeMutation.data ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Your Results</h2>
                    <p className="text-muted-foreground">Based on the symptoms you shared.</p>
                  </div>

                  <Card className="border-none shadow-md overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <CardDescription className="mb-1 text-sm font-medium uppercase tracking-wider text-primary">Probable Condition</CardDescription>
                          <CardTitle className="text-2xl mb-2">{analyzeMutation.data.topCondition.disease}</CardTitle>
                        </div>
                        <TriageBadge level={analyzeMutation.data.topCondition.triageLevel} className="text-sm px-3 py-1 self-start" />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg mt-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold block mb-1">When to see a doctor:</span>
                          <span className="text-sm text-muted-foreground">{analyzeMutation.data.topCondition.whenToSeeDoctor}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2 mb-3">
                          <HeartPulse className="h-5 w-5 text-primary" /> Self-Care Steps
                        </h4>
                        <ul className="space-y-3">
                          {analyzeMutation.data.topCondition.selfCareAdvice.map((advice, i) => (
                            <li key={i} className="flex gap-3 text-muted-foreground">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">General Advice</h4>
                        <p className="text-muted-foreground text-sm">{analyzeMutation.data.generalAdvice}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {analyzeMutation.data.otherConditions.length > 0 && (
                    <Card className="border-none shadow-sm bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Other possibilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analyzeMutation.data.otherConditions.map((condition, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 last:pb-0">
                              <span className="font-medium text-muted-foreground">{condition.disease}</span>
                              <TriageBadge level={condition.triageLevel} className="text-xs scale-90 origin-right" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button onClick={handleReset} className="w-full sm:w-auto h-12">
                      Check another symptom
                    </Button>
                    {!isAuthenticated && (
                      <Button variant="outline" asChild className="w-full sm:w-auto h-12">
                        <Link href="/register">Create account to save history</Link>
                      </Button>
                    )}
                    {isAuthenticated && (
                      <Button variant="outline" asChild className="w-full sm:w-auto h-12">
                        <Link href="/history">View my history</Link>
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground text-center flex items-start gap-2 bg-muted/30 p-4 rounded-lg mt-8">
                    <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-left">{analyzeMutation.data.disclaimer}</p>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
