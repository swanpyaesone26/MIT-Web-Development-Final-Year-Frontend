import { CheckCircle, Info, X } from "lucide-react";
import { toast } from "sonner";

export const errorToast = (header: string, message: string) => {
    toast.custom((t) => (
        <div className="flex gap-3 items-start min-w-[200px] max-w-[360px] p-4 rounded-lg bg-red-900 text-red-100 shadow-lg border border-red-800">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex justify-center items-center">
                <Info size={18} className="text-white" />
            </div>
            <div className="flex-1 pr-6">
                <h1 className="text-sm font-semibold">{header}</h1>
                <p className="text-xs opacity-90 leading-snug">{message}</p>
            </div>
            <button
                className="w-9 h-9 rounded-lg border border-white group group-hover:border-2 cursor-pointer flex justify-center items-center"
                onClick={() => toast.dismiss(t)}
            >
                <X size={20} className="text-white opacity-80 group-hover:scale-110" />
            </button>
        </div>
    ));
};

export const successToast = (header: string, message: string) => {
    toast.custom((t) => (
        <div className="flex gap-3 items-start min-w-[200px] max-w-[360px] p-4 rounded-lg bg-green-900 text-green-100 shadow-lg border border-green-800">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex justify-center items-center">
                <CheckCircle size={18} className="text-white" />
            </div>
            <div className="flex-1 pr-6">
                <h1 className="text-sm font-semibold">{header}</h1>
                <p className="text-xs opacity-90 leading-snug">{message}</p>
            </div>
            <button
                className="w-9 h-9 rounded-lg border border-white group hover:border-2 cursor-pointer flex justify-center items-center"
                onClick={() => toast.dismiss(t)}
            >
                <X size={20} className="text-white opacity-80 group-hover:scale-110" />
            </button>
        </div>
    ));
};