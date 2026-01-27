import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "../ui/button";

const CodeBlock = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    const language = className?.split("-")[1];
    const code = String(children).replace(/\n$/, "");
    
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative my-6 rounded-lg overflow-hidden border border-neutral-800">
            <div className="flex items-center justify-between bg-neutral-900 px-3 py-2.5 text-xs text-neutral-300">
                <span className="font-mono">{language || "bash"}</span>

                <Button
                    size={"icon-sm"}
                    variant={"outline"}
                    onClick={copy}
                    className="hover:text-white transition cursor-pointer"
                >
                    {copied ? <CopyCheck className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                </Button>
            </div>

            <SyntaxHighlighter style={vscDarkPlus} language={language ?? "bash"} PreTag="div" customStyle={{ background: "transparent"}} >
                {String(children).replace(/\n$/, "")} 
            </SyntaxHighlighter> 
        </div>
    );
}

export default CodeBlock;