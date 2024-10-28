'use client'

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ReactMarkdown from "react-markdown"
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import SyntaxHighlighter from "react-syntax-highlighter"
import remarkGfm from 'remark-gfm';
import { renderers } from "@/components/renderer"

export default function Page() {
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false)
  const [fileTree, setFileTree] = React.useState<any>({})
  const [currentPath, setCurrentPath] = React.useState<string[]>([])
  const [fileContent, setFileContent] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchFileStructure()
  }, [])

  const fetchFileStructure = async () => {
    try {
      const response = await fetch('/api/file-struct')
      const data = await response.json()
      setFileTree(data)
    } catch (error) {
      console.error('Error fetching file structure:', error)
    }
  }

  const fetchFileContent = async (path: string) => {
    try {
      const response = await fetch(`/api/file-struct?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      setFileContent(data.content)
    } catch (error) {
      console.error('Error fetching file content:', error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar fileTree={fileTree} setCurrentPath={setCurrentPath} fetchFileContent={fetchFileContent} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {currentPath.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === currentPath.length - 1 ? (
                      <BreadcrumbPage>{item}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="#">{item}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
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
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
              {fileContent ? (
                currentPath[currentPath.length - 1].endsWith('.md') ? (
                  <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={renderers}
                >
                    {fileContent}
                  </ReactMarkdown>
                ) : (
                  <SyntaxHighlighter language="python" style={darcula}>
                    {fileContent}
                  </SyntaxHighlighter>
                )
              ) : (
                <p>Select a file to view its content</p>
              )}
            </div>
          </div>
          <TerminalView isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar({ fileTree, setCurrentPath, fetchFileContent }: { fileTree: any, setCurrentPath: (path: string[]) => void, fetchFileContent: (path: string) => void }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            {Object.keys(fileTree).length > 0 ? (
              <SidebarMenu>
                {Object.entries(fileTree).map(([key, value]: [string, any]) => (
                  <Tree key={key} item={{ name: key, ...value }} path={[key]} setCurrentPath={setCurrentPath} fetchFileContent={fetchFileContent} />
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

function Tree({ item, path, setCurrentPath, fetchFileContent }: { item: any, path: string[], setCurrentPath: (path: string[]) => void, fetchFileContent: (path: string) => void }) {
  const handleClick = () => {
    setCurrentPath(path)
    if (!item.isDirectory) {
      fetchFileContent(path.join('/'))
    }
  }

  if (!item.isDirectory) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleClick}>
          <File className="mr-2 h-4 w-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton onClick={handleClick}>
            <ChevronRight className="transition-transform mr-2 h-4 w-4" />
            <Folder className="mr-2 h-4 w-4" />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {Array.isArray(item.children) ? (
              item.children.map((child: any) => (
                <Tree key={child.name} item={child} path={[...path, child.name]} setCurrentPath={setCurrentPath} fetchFileContent={fetchFileContent} />
              ))
            ) : (
              <Tree key={item.name} item={item} path={path} setCurrentPath={setCurrentPath} fetchFileContent={fetchFileContent} />
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function TerminalView({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [command, setCommand] = React.useState("")
  const [output, setOutput] = React.useState("")
  const rootDir = "/";
  const [currentDir, setCurrentDir] = React.useState(rootDir)
  const [history, setHistory] = React.useState<string[]>([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!command.trim()) return

    setOutput((prev) => `${prev}${currentDir} > ${command}\n`)
    setHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    try {
      const response = await fetch('/api/execute-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      })

      const result = await response.json()

      if (result.output === '__clear__') {
        setOutput("")
      } else {
        setOutput((prev) => `${prev}${result.output}\n`)
        if (result.currentDir) {
          setCurrentDir(result.currentDir)
        }
      }
    } catch (error) {
      console.error('Error executing command:', error)
      setOutput((prev) => `${prev}Error: Failed to execute command\n`)
    }

    setCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand('')
      }
    }
  }

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 md:w-2/4 rounded-lg bg-black text-white shadow-lg transition-all duration-300 ease-in-out ${
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
        <pre className="text-sm whitespace-pre-wrap">{output}</pre>
        <div className="flex items-center">
          <span className="mr-2">{currentDir} {'>'}</span>
          <form onSubmit={handleCommandSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none text-white"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
