import Image from 'next/image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface MarkdownImageProps {
    src?: string;
    alt?: string;
}
interface RenderersProps {
    trackText: string;
}

function MarkdownImage({ src, alt }: MarkdownImageProps) {
    if (!src) {
      return <></>; // maybe a placeholder??
    }

    return (
      <Image
        draggable={false}
        src={src}
        alt={alt || ''}
        width={600}
        height={400}
        priority
        className='rounded-lg shadow-lg my-4 w-full'
      />
    );
  }

export const renderers : Record<string, React.FC<any>> = {
    table: ({ children }) => (
    <table className='table-auto border border-gray-400'>{children}</table>
    ),
    tableHead: ({ children }) => (
    <thead className='bg-gray-100 border border-gray-400'>{children}</thead>
    ),
    tableBody: ({ children }) => (
    <tbody className='border border-gray-400'>{children}</tbody>
    ),
    tableRow: ({ children }) => (
    <tr className='border border-gray-400'>{children}</tr>
    ),
    tableCell: ({ children }) => (
    <td className='px-4 py-2 border border-gray-400'>{children}</td>
    ),
    h1: ({ node, ...props }) => (
        <h1 className='text-4xl font-bold py-5'>{props.children}</h1>
    ),
    h2: ({ node, ...props }) => (
        <h2 className='text-2xl font-bold py-5'>{props.children}</h2>
    ),
    ul: ({ node, ...props }) => (
        <ul className='list-disc list-inside pb-5 pl-2'>{props.children}</ul>
    ),
    li: ({ node, ...props }) => <li className='mb-2'>{props.children}</li>,
    p: ({ node, ...props }) => <p className='block'>{props.children}</p>,
    img: MarkdownImage,
    inlineCode: ({ children }) => (
        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">
            {children}
        </code>
    ),

    // Code blocks
    code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={darcula}
                language={match[1]}
                PreTag="div"
                className="my-2 rounded-lg shadow-lg"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded">
                {children}
            </code>
        );
    },
}