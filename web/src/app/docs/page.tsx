import { DataFlow } from "@/components/magicui/data-flow"
import { FileTree } from "@/components/magicui/file-tree"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="container mx-auto p-4 space-y-8">    
    <h1 className="text-3xl font-bold text-center mb-8">
        <Link href="/">
           Home 
        </Link>
        </h1>  
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Problem Analysis</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="design">System Design</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Problem Analysis</CardTitle>
              <CardDescription>Key aspects of the student info management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Process and convert student data from various formats</li>
                <li>Simulate new student academic information</li>
                <li>Merge basic and academic information</li>
                <li>Generate weekly summaries with GPA calculations</li>
                <li>Implement access control for teachers</li>
                <li>Provide a user-friendly interface for data management</li>
              </ul>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Data Flow Diagram</h3>
                <div className="bg-muted p-4 rounded-md">
                  <DataFlow />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constraints">
          <Card>
            <CardHeader>
              <CardTitle>Constraints Consideration</CardTitle>
              <CardDescription>Key constraints and considerations for the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>File format compatibility (txt files with specific delimiters)</li>
                <li>Hourly simulation of new student data</li>
                <li>Weekly summary generation</li>
                <li>Configuration management via file and command-line arguments</li>
                <li>Access control limited to "teacher" user group</li>
                <li>Exception handling and non-zero exit codes</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>System Design</CardTitle>
              <CardDescription>Architecture and components of the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Components</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>File Parser</li>
                    <li>Data Simulator</li>
                    <li>Information Merger</li>
                    <li>Summary Generator</li>
                    <li>Configuration Handler</li>
                    <li>Web Interface (Nextjs)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">File Structure</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <FileTree />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Implementation</CardTitle>
              <CardDescription>Key implementation details and code snippets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Python 3.6+</li>
                    <li>Nextjs for web interface</li>
                    <li>Makefile for task automation</li>
                    <li>Linux user group management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>File parsing and conversion</li>
                    <li>Data simulation</li>
                    <li>GPA calculation</li>
                    <li>Access control</li>
                    <li>Configuration management</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Sample Code: GPA Calculation</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <Code className="inline-block mr-2" />
                    {`def calculate_gpa(assignments, project, midterm, final):
    gpa = (0.3 * assignments +
           0.2 * project +
           0.2 * midterm +
           0.3 * final)
    return gpa

# Usage
student_gpa = calculate_gpa(85, 90, 88, 92)
print(f"Student GPA: {student_gpa}")`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}