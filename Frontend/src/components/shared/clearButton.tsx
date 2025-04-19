import React from "react";
import {X} from "lucide-react";
import {cn} from "@/lib/utils";


interface Props {
    className?: string;
    onClick?: () => void;
}

export const ClearButton: React.FC<Props> = (
    {
        className,
        onClick
    }) => {
    return (
        <button
            className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer',
                className,
            )}
            type="button"
            onClick={onClick}
        >
            <X className="h-5 w-5"/>
        </button>
    )
}
