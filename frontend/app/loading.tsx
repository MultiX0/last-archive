"use client"

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md text-center space-y-6">
                <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 rounded-full blur-2xl" />
                        <div className="relative w-full h-full flex items-center justify-center">
                            <AlertCircle className="w-24 h-24 text-primary opacity-80"/>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
                    <p className="text-base text-muted-foreground">
                        Sorry, the page you're looking for doesn't exist or has been moved. let's get you back on track.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button variant={"default"} asChild className="gap-2">
                        <Link href={"/"}>
                            <Home className="w-4 h-4"/>
                            Go Home
                        </Link>
                    </Button>
                    <Button variant={"outline"} onClick={() => {window.history.back()}} className="gap-2">
                        <ArrowLeft className="w-4 h-4"/>
                        Go Back
                    </Button>
                </div>
            </div>
        </main>

    )
}