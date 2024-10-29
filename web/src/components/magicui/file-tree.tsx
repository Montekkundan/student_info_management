import { File, Folder, Tree } from "@/components/ui/file-tree";

export function FileTree() {
  return (
    <div className="relative flex h-[300px] w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Tree
        className="p-2 overflow-hidden rounded-md bg-background"
        initialSelectedId="3"
        initialExpandedItems={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
        elements={ELEMENTS}
      >
        <Folder element="student_info_management" value="1">
          <File value="2">
            <p>README.md</p>
          </File>
          <File value="3">
            <p>Makefile</p>
          </File>
          <Folder value="4" element="config">
            <File value="5">
              <p>student_management.cfg</p>
            </File>
          </Folder>
          <Folder value="6" element="data">
            <File value="7">
              <p>student_list_orig.txt</p>
            </File>
            <File value="8">
              <p>basic_info.txt</p>
            </File>
            <File value="9">
              <p>academic_info.txt</p>
            </File>
            <File value="10">
              <p>student_info.txt</p>
            </File>
            <File value="11">
              <p>student_summary.txt</p>
            </File>
          </Folder>
          <Folder value="12" element="src">
            <File value="13">
              <p>student_info_manager.py</p>
            </File>
            <File value="14">
              <p>simulation.py</p>
            </File>
            <File value="15">
              <p>config_handler.py</p>
            </File>
            <File value="16">
              <p>generate_summary.py</p>
            </File>
          </Folder>
          <Folder value="17" element="web" />
        </Folder>
      </Tree>
    </div>
  );
}

const ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "student_info_management",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "README.md",
      },
      {
        id: "3",
        isSelectable: true,
        name: "Makefile",
      },
      {
        id: "4",
        isSelectable: true,
        name: "config",
        children: [
          {
            id: "5",
            isSelectable: true,
            name: "student_management.cfg",
          },
        ],
      },
      {
        id: "6",
        isSelectable: true,
        name: "data",
        children: [
          {
            id: "7",
            isSelectable: true,
            name: "student_list_orig.txt",
          },
          {
            id: "8",
            isSelectable: true,
            name: "basic_info.txt",
          },
          {
            id: "9",
            isSelectable: true,
            name: "academic_info.txt",
          },
          {
            id: "10",
            isSelectable: true,
            name: "student_info.txt",
          },
          {
            id: "11",
            isSelectable: true,
            name: "student_summary.txt",
          },
        ],
      },
      {
        id: "12",
        isSelectable: true,
        name: "src",
        children: [
          {
            id: "13",
            isSelectable: true,
            name: "student_info_manager.py",
          },
          {
            id: "14",
            isSelectable: true,
            name: "simulation.py",
          },
          {
            id: "15",
            isSelectable: true,
            name: "config_handler.py",
          },
          {
            id: "16",
            isSelectable: true,
            name: "generate_summary.py",
          },
        ],
      },
      {
        id: "17",
        isSelectable: true,
        name: "web",
      },
    ],
  },
];
