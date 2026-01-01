import { RocketIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
    return (
        <header className="border-b border-border w-full bg-card">
        <div className="mx-7 py-2">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <RocketIcon className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Launch Pad</h1>
                <p className="text-xs text-muted-foreground">GitHub Deployments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 hidden md:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Documentation
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
}