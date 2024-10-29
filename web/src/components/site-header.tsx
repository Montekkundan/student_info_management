"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlignJustify, XIcon } from "lucide-react";
import Link from "next/link";


export function SiteHeader() {


  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
        <div className="container flex h-[3.5rem] items-center justify-between">
          <Link className="text-md flex items-center" href="/">
            COMP 341
          </Link>

          <div className="ml-auto flex h-full items-center">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mr-6 text-sm"
              )}
              href="/docs"
            >
              DOCS
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
