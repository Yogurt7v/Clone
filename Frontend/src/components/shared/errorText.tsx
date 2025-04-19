import React from "react";
import {cn} from "@/lib/utils";

interface Props {
    text: string;
    className?: string;
}
export const ErrorText: React.FC<Props> = ({text, className}) => {
    return <p className={cn('text-red-700 text-sm', className)}>{text}</p>
}
