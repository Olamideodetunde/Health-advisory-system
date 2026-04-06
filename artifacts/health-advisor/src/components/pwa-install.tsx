import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
}

export function PwaInstallBanner() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    if (isIOS()) {
      const timer = setTimeout(() => setShowIOSGuide(true), 5000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setInstallEvent(null);
    setShowIOSGuide(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
    }
  };

  if (dismissed) return null;

  if (installEvent) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg safe-area-inset-bottom">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Add HealthAdvisor to your phone</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Works offline. No app store needed. Free.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" onClick={handleInstall} className="h-8 px-3 text-xs">
                Install
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDismiss} className="h-8 w-8 flex-shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showIOSGuide) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Share className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Add to your home screen</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tap the Share button below, then choose "Add to Home Screen".
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={handleDismiss} className="h-8 w-8 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
