import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye, X, FileText, FileArchive, FileImage, FileSpreadsheet, FileVideo, FileAudio, File, Presentation } from "lucide-react";
import type { AttachedFile } from "@/types/data";

const FILE_CONFIG: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
    pdf: { icon: FileText, color: "text-red-600", bg: "bg-red-100", label: "PDF" },
    doc: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100", label: "DOC" },
    docx: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100", label: "DOCX" },
    txt: { icon: FileText, color: "text-gray-600", bg: "bg-gray-100", label: "TXT" },
    zip: { icon: FileArchive, color: "text-yellow-700", bg: "bg-yellow-100", label: "ZIP" },
    rar: { icon: FileArchive, color: "text-yellow-700", bg: "bg-yellow-100", label: "RAR" },
    "7z": { icon: FileArchive, color: "text-yellow-700", bg: "bg-yellow-100", label: "7Z" },
    png: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "PNG" },
    jpg: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "JPG" },
    jpeg: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "JPEG" },
    gif: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "GIF" },
    webp: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "WEBP" },
    svg: { icon: FileImage, color: "text-green-600", bg: "bg-green-100", label: "SVG" },
    xlsx: { icon: FileSpreadsheet, color: "text-emerald-700", bg: "bg-emerald-100", label: "XLSX" },
    xls: { icon: FileSpreadsheet, color: "text-emerald-700", bg: "bg-emerald-100", label: "XLS" },
    csv: { icon: FileSpreadsheet, color: "text-emerald-700", bg: "bg-emerald-100", label: "CSV" },
    pptx: { icon: Presentation, color: "text-orange-600", bg: "bg-orange-100", label: "PPTX" },
    ppt: { icon: Presentation, color: "text-orange-600", bg: "bg-orange-100", label: "PPT" },
    mp4: { icon: FileVideo, color: "text-purple-600", bg: "bg-purple-100", label: "MP4" },
    mp3: { icon: FileAudio, color: "text-pink-600", bg: "bg-pink-100", label: "MP3" },
    wav: { icon: FileAudio, color: "text-pink-600", bg: "bg-pink-100", label: "WAV" },
};

const DEFAULT_CONFIG = { icon: File, color: "text-muted-foreground", bg: "bg-muted", label: "FILE" };

function getExt(name: string) {
    return name.split(".").pop()?.toLowerCase() ?? "";
}

function getConfig(name: string) {
    return FILE_CONFIG[getExt(name)] ?? DEFAULT_CONFIG;
}

function isImage(name: string) {
    return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(getExt(name));
}

function isPdf(name: string) {
    return getExt(name) === "pdf";
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Compact card for a single file — Google Classroom style */
export function FileCard({ file, onRemove }: { file: AttachedFile; onRemove?: () => void }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const cfg = getConfig(file.name);
    const Icon = cfg.icon;
    const canPreview = isImage(file.name) || isPdf(file.name);

    return (
        <>
            <div
                className={`group relative flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-shadow hover:shadow-md ${canPreview ? "cursor-pointer" : ""}`}
                onClick={canPreview ? () => setPreviewOpen(true) : undefined}
            >
                {/* File icon / thumbnail */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                    {isImage(file.name) ? (
                        <img src={file.url} alt={file.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label} · {formatFileSize(file.size)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canPreview && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => { e.stopPropagation(); setPreviewOpen(true); }}
                        >
                            <Eye className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <a href={file.url} download={file.name} onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </a>
                    {onRemove && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Preview dialog */}
            {canPreview && (
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Icon className={`h-5 w-5 ${cfg.color}`} />
                                {file.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center justify-center">
                            {isImage(file.name) ? (
                                <img src={file.url} alt={file.name} className="max-h-[65vh] max-w-full rounded-lg object-contain" />
                            ) : isPdf(file.name) ? (
                                <iframe src={file.url} className="h-[65vh] w-full rounded-lg border" title={file.name} />
                            ) : null}
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">{cfg.label} · {formatFileSize(file.size)}</p>
                            <a href={file.url} download={file.name}>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Download className="h-4 w-4" /> Download
                                </Button>
                            </a>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

/** Grid of file cards */
export function FileGrid({ files, onRemove }: { files: AttachedFile[]; onRemove?: (index: number) => void }) {
    if (files.length === 0) return null;
    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {files.map((f, i) => (
                <FileCard key={i} file={f} onRemove={onRemove ? () => onRemove(i) : undefined} />
            ))}
        </div>
    );
}
