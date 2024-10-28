"use client"
import * as React from "react"
import { ChevronRight, File, Folder, Terminal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">ui</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>button.tsx</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            >
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
          <TerminalView isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Sidebar component to fetch and render Docker file structure
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [fileTree, setFileTree] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function fetchFileTree() {
      const response = await fetch("/api/docker/files");
      const data = await response.json();
      if (data.files) {
        setFileTree(data.files);
      }
    }
    fetchFileTree();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            {fileTree.length > 0 ? (
              <SidebarMenu>
                {fileTree.map((item, index) => (
                  <Tree key={index} item={item} />
                ))}
              </SidebarMenu>
            ) : (
              <p>Loading file structure...</p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

// Tree component to render the Docker container file structure
function Tree({ item }: { item: string }) {
  const isFile = !item.endsWith("/");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        {isFile ? <File /> : <ChevronRight />}
        {item}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// Terminal component to send and display terminal commands
function TerminalView({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [command, setCommand] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the command to the API to run it in Docker
    const response = await fetch("/api/docker/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();
    if (data.output) {
      setOutput((prev) => `${prev}\n$ ${command}\n${data.output}`);
    }

    setCommand("");
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 rounded-lg bg-black text-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "h-96 opacity-100" : "h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-700 p-2">
        <span className="text-sm font-semibold">Terminal</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">
        <pre className="text-sm">{output}</pre>
      </div>
      <form onSubmit={handleCommandSubmit} className="p-2 border-t border-gray-700">
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none text-white"
          placeholder="Enter command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
      </form>
    </div>
  );
}
