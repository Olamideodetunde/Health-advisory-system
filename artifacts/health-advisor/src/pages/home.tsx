import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Shield, Stethoscope, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Hero Section */}
      <section className="px-4 py-12 md:py-24 bg-gradient-to-b from-primary/10 to-background flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 text-primary">
          <Activity className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-3xl mb-6">
          Understand your symptoms in plain language.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          HealthAdvisor helps you figure out what might be wrong, how urgent it is, and what you can do about it right now. Clear, calm, and reassuring.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button size="lg" className="w-full text-md h-14" asChild>
            <Link href="/check">
              Start symptom checker <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {!isAuthenticated && (
            <Button size="lg" variant="outline" className="w-full text-md h-14" asChild>
              <Link href="/register">Create an account</Link>
            </Button>
          )}
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4" /> Your data is private and secure
        </p>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">Why use HealthAdvisor?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="pt-8 text-center flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plain Language</h3>
              <p className="text-muted-foreground">
                No confusing medical jargon. Just clear explanations of what you might be experiencing.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="pt-8 text-center flex flex-col items-center">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clear Triage</h3>
              <p className="text-muted-foreground">
                Know immediately if you need to see a doctor soon, go to the emergency room, or rest at home.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="pt-8 text-center flex flex-col items-center">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Self-Care Steps</h3>
              <p className="text-muted-foreground">
                Actionable advice on what you can do right now to feel better, tailored to your symptoms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 bg-muted/20 border-y">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden sm:block absolute top-6 left-[15%] right-[15%] h-0.5 bg-border border-dashed border-t-2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Tell us about yourself</h3>
              <p className="text-sm text-muted-foreground">
                Basic details like age and how long you've felt unwell.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Select your symptoms</h3>
              <p className="text-sm text-muted-foreground">
                Pick from an easy-to-read list of common symptoms.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get clear advice</h3>
              <p className="text-sm text-muted-foreground">
                Receive a probable condition, urgency level, and next steps.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/check">Start now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Disclaimer */}
      <section className="px-4 py-8 text-center text-sm text-muted-foreground container mx-auto max-w-3xl">
        <p>
          <strong>Please note:</strong> This tool is not a substitute for professional medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </section>
    </div>
  );
}
