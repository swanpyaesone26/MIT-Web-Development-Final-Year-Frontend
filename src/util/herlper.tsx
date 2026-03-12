/* eslint-disable react-refresh/only-export-components */
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function HelperError(error: unknown) {
    if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message);
    } else if (error instanceof Error) {
        throw new Error(error.message);
    } else {
        throw new Error("Unknown error occurred");
    }
}
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const formatDate = (date: string) => {
    const d = new Date(date);

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
