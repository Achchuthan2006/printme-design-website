"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import { openSupportChat } from "@/lib/chat";
import { siteConfig } from "@/lib/site";
import { uploadArtworkFile } from "@/lib/uploads";
import { cn } from "@/lib/utils";
import { ArtworkUploadContext, ArtworkUploadMetadata } from "@/types";

type UploadState = "queued" | "uploading" | "uploaded" | "error";

interface UploadItem {
  id: string;
  file: File;
  state: UploadState;
  progress: number;
  error?: string;
  metadata?: ArtworkUploadMetadata;
}

interface ArtworkUploadZoneProps {
  context: ArtworkUploadContext;
  title?: string;
  description?: string;
  helperText?: string;
  onUploaded?: (files: ArtworkUploadMetadata[]) => void;
  className?: string;
}

const acceptedFormats = ".pdf,.jpg,.jpeg,.png,.tif,.tiff,.ai,.eps,.psd,.zip";
const acceptedFileLabels = ["PDF", "JPG", "PNG", "TIFF", "AI", "EPS", "PSD", "ZIP"];

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function makeUploadItem(file: File): UploadItem {
  return {
    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
    file,
    state: "queued",
    progress: 0,
  };
}

export function ArtworkUploadZone({
  context,
  title = "Upload artwork for review",
  description = "Attach print-ready PDFs, artwork files, images, or a ZIP package so PrintMe can check the job before production.",
  helperText = "PDF is preferred. If you are unsure, upload what you have and we will flag anything that needs attention.",
  onUploaded,
  className,
}: ArtworkUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadedRef = useRef(onUploaded);
  const titleId = useId();
  const helperId = useId();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const uploadedCount = items.filter((item) => item.state === "uploaded").length;
  const hasError = items.some((item) => item.state === "error");
  const errorCount = items.filter((item) => item.state === "error").length;
  const continuationCopy =
    context.scope === "quote"
      ? "After upload, continue the quote request so PrintMe can review the files with your quantity, turnaround window, and project notes together."
      : context.scope === "order"
        ? "After upload, continue checkout so PrintMe can review the files with your order details and fulfillment instructions."
        : "After upload, PrintMe can review the files and confirm the best next step.";
  const nextStepTitle =
    context.scope === "quote"
      ? "Next: finish the quote request"
      : context.scope === "order"
        ? "Next: finish checkout"
        : "What happens next";

  useEffect(() => {
    onUploadedRef.current = onUploaded;
  }, [onUploaded]);

  useEffect(() => {
    onUploadedRef.current?.(items.flatMap((item) => (item.metadata ? [item.metadata] : [])));
  }, [items]);

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) {
        trackPrintMeEvent({
          eventName: "upload_removed",
          entityType: "upload",
          entityId: removed.metadata?.id ?? null,
          pageType: context.scope === "order" ? "checkout" : context.scope === "quote" ? "quote_request" : "product",
          properties: {
            scope: context.scope,
            productSlug: context.productSlug ?? null,
            fileName: removed.file.name,
          },
        });
      }
      return current.filter((item) => item.id !== id);
    });
  }

  async function uploadItem(item: UploadItem) {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, state: "uploading", progress: 42, error: undefined }
          : currentItem,
      ),
    );

    try {
      const metadata = await uploadArtworkFile(item.file, context);
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, state: "uploaded", progress: 100, metadata } : currentItem,
        ),
      );
      trackPrintMeEvent({
        eventName: "upload_completed",
        entityType: "upload",
        entityId: metadata.id,
        pageType: context.scope === "order" ? "checkout" : context.scope === "quote" ? "quote_request" : "product",
        funnelName: context.scope === "order" ? "direct_checkout" : context.scope === "quote" ? "quote_to_cash" : "upload_to_production",
        funnelStage: "artwork_upload",
        journey: context.scope === "order" ? "direct_checkout" : context.scope === "quote" ? "quote_to_cash" : "upload_to_production",
        isMicroConversion: true,
        properties: {
          scope: context.scope,
          productSlug: context.productSlug ?? null,
          fileName: metadata.fileName,
          fileSize: metadata.fileSize,
          skipped: Boolean(metadata.skipped),
        },
      });
      return metadata;
    } catch (error) {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                state: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Upload failed. Please try again.",
              }
            : currentItem,
        ),
      );
      trackPrintMeEvent({
        eventName: "upload_failed",
        entityType: "upload",
        pageType: context.scope === "order" ? "checkout" : context.scope === "quote" ? "quote_request" : "product",
        funnelStage: "artwork_upload",
        properties: {
          scope: context.scope,
          productSlug: context.productSlug ?? null,
          fileName: item.file.name,
          reason: error instanceof Error ? error.message : "Upload failed",
        },
      });
      return null;
    }
  }

  function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    const nextItems = files.map(makeUploadItem);
    setItems((current) => [...current, ...nextItems]);
    trackPrintMeEvent({
      eventName: "upload_started",
      entityType: "upload",
      pageType: context.scope === "order" ? "checkout" : context.scope === "quote" ? "quote_request" : "product",
      funnelName: context.scope === "order" ? "direct_checkout" : context.scope === "quote" ? "quote_to_cash" : "upload_to_production",
      funnelStage: "artwork_upload",
      journey: context.scope === "order" ? "direct_checkout" : context.scope === "quote" ? "quote_to_cash" : "upload_to_production",
      isMicroConversion: true,
      properties: {
        scope: context.scope,
        productSlug: context.productSlug ?? null,
        fileCount: files.length,
        relatedLabel: context.relatedLabel ?? null,
      },
    });

    startTransition(async () => {
      await Promise.all(nextItems.map((item) => uploadItem(item)));
    });
  }

  function retryItem(item: UploadItem) {
    startTransition(async () => {
      await uploadItem(item);
    });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    uploadFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    uploadFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <section
      className={cn("surface-card p-5", className)}
      id="upload"
      data-surface="artwork-upload"
      data-flow={context.scope}
      data-state={hasError ? "error" : uploadedCount > 0 ? "success" : "idle"}
    >
      <div
        aria-labelledby={titleId}
        aria-describedby={helperId}
        aria-busy={isPending}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-[1.8rem] border border-dashed p-6 text-center transition duration-300",
          isDragging ? "border-brand bg-brand-soft shadow-glow" : "border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(244,238,231,0.68))] hover:border-brand/40 hover:bg-brand-soft/30",
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,241,236,0.88))] text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_14px_24px_rgba(18,17,16,0.07)]">
          <Icon name="upload" className="h-6 w-6" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Artwork upload</p>
        <h2 id={titleId} className="mt-2 text-2xl font-black text-ink">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate">{description}</p>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-slate">
          Drag files into this area or use the upload button below. PDFs are preferred, but PrintMe can also review source files, images, and ZIP packages.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {acceptedFileLabels.map((label) => (
            <span key={label} className="rounded-full border border-white/85 bg-white/88 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={isPending} data-cta="upload-artwork">
            {isPending ? "Uploading Files..." : "Upload My Artwork"}
          </Button>
          <Button type="button" variant="secondary" href="/artwork-guidelines">
            Check File Guidelines
          </Button>
        </div>
        <input ref={inputRef} type="file" multiple accept={acceptedFormats} className="sr-only" onChange={handleInputChange} aria-describedby={helperId} />
        <p id={helperId} className="mt-4 text-xs font-bold text-slate">{helperText}</p>
        <p className="mt-2 text-xs leading-5 text-slate">
          If a file is not final yet, you can still continue. PrintMe can review what you have first and tell you what still needs attention.
        </p>
        <p className="mt-2 text-xs leading-5 text-slate">{continuationCopy}</p>
        <p className="sr-only" aria-live="polite">
          {isPending
            ? "Artwork upload in progress."
            : hasError
              ? `${errorCount} upload${errorCount === 1 ? "" : "s"} need attention.`
              : uploadedCount > 0
                ? `${uploadedCount} file${uploadedCount === 1 ? "" : "s"} uploaded successfully.`
                : "No files uploaded yet."}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3" aria-live="polite">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.4rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,238,231,0.8))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_20px_rgba(18,17,16,0.05)]"
              data-state={item.state === "error" ? "error" : item.state === "uploaded" ? "success" : item.state}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-ink">{item.file.name}</p>
                  <p className="mt-1 text-xs font-bold text-slate">
                    {formatFileSize(item.file.size)} / {item.file.type || "Artwork file"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.state === "error" ? (
                    <button
                      type="button"
                      onClick={() => retryItem(item)}
                      className="rounded-full px-3 py-1 text-xs font-black text-brand transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      Retry
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full px-3 py-1 text-xs font-black text-slate transition hover:bg-white hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-white"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
                aria-label={`${item.file.name} upload progress`}
              >
                <div
                  className={cn("h-full rounded-full transition-all duration-500", item.state === "error" ? "bg-red-500" : "bg-brand")}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className={cn("mt-2 text-xs font-bold", item.state === "error" ? "text-red-700" : "text-slate")}>
                {item.state === "queued" ? "Ready to upload" : null}
                {item.state === "uploading" ? "Uploading securely..." : null}
                {item.state === "uploaded"
                  ? item.metadata?.skipped
                    ? "Saved for this session. If you leave before submitting, upload it again when you return."
                    : "Uploaded. PrintMe can review this with your quote or order before production."
                  : null}
                {item.state === "error" ? item.error : null}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="focus-band px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">{nextStepTitle}</p>
            <p className="mt-1">
              Uploaded files are matched to your quote or order so the team can check size, bleed, quality, and production fit before anything moves forward.
            </p>
            <p className="mt-2 text-xs leading-5 text-slate">
              {uploadedCount > 0
                ? `${uploadedCount} file${uploadedCount === 1 ? "" : "s"} uploaded successfully so far.`
                : "No files have finished uploading yet."}{" "}
              {hasError ? "If something failed, retry or send the file later after speaking with PrintMe." : "You can keep adding files if the project has multiple pieces."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button type="button" variant="secondary" onClick={openSupportChat}>
              Ask About My Files
            </Button>
            <Button href={siteConfig.phoneHref}>
              Call PrintMe
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
