"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export function CopyButton({ text }: { text: string }) {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(text)
		setIsCopied(true)
		setTimeout(() => {
			setIsCopied(false)
		}, 2000)
		toast.success("Copied to clipboard")
	}

	return (
		<Button size="icon" variant={"outline"} onClick={handleCopy} className="size-7 p-4">
			{isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
		</Button>
	)
}
