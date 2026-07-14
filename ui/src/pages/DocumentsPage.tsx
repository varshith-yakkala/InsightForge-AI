import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuSearch,
  LuTrash2,
  LuStar,
  LuUpload,
  LuFilter,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar } from "@/components/layout/Navbar";
import {
  FileTypeIcon,
  fileTypeConfig,
} from "@/components/common/FileTypeIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { useDocumentsStore } from "@/store/documentsStore";
import { useSettingsStore } from "@/store/settingsStore";

import {
  formatBytes,
  formatRelativeTime,
} from "@/utils/format";

import { cn } from "@/utils/cn";

import type {
  FileKind,
  IndexStatus,
} from "@/types";

const typeFilters: (
  | FileKind
  | "all"
)[] = [
  "all",
  "pdf",
  "txt",
  "md",
];

const statusStyles: Record<
  IndexStatus,
  {
    variant:
      | "success"
      | "warning"
      | "danger"
      | "default";
    label: string;
  }
> = {

  indexed: {
    variant: "success",
    label: "Indexed",
  },

  embedding: {
    variant: "warning",
    label: "Embedding",
  },

  chunking: {
    variant: "warning",
    label: "Chunking",
  },

  queued: {
    variant: "default",
    label: "Queued",
  },

  failed: {
    variant: "danger",
    label: "Failed",
  },

};

export function DocumentsPage() {

  const navigate = useNavigate();

  const backendUrl =
    useSettingsStore(
      s => s.backendUrl
    );

  const {

    documents,

    refresh,

    removeDocument,

    toggleFavorite,

  } = useDocumentsStore();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<
      FileKind | "all"
    >("all");

  const [
    favOnly,
    setFavOnly,
  ] =
    useState(false);

  useEffect(() => {

    refresh(
      backendUrl
    );

  }, [
    backendUrl,
    refresh,
  ]);

  const filtered =
    useMemo(() => {

      return documents.filter(
        d => {

          if (
            typeFilter !== "all" &&
            d.fileType !== typeFilter
          )
            return false;

          if (
            favOnly &&
            !d.favorite
          )
            return false;

          if (
            search &&
            !d.filename
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
            return false;

          return true;

        }
      );

    }, [
      documents,
      search,
      typeFilter,
      favOnly,
    ]);

  const totalStorage =
    documents.reduce(

      (
        sum,
        d,
      ) =>
        sum +
        d.sizeBytes,

      0,

    );

  const totalChunks =
    documents.reduce(

      (
        sum,
        d,
      ) =>
        sum +
        d.chunks,

      0,

    );

  return (

    <div className="flex h-full min-w-0 flex-1 flex-col">

      <Navbar title="Documents" />

      <div className="flex-1 overflow-y-auto p-6">

        <div className="mx-auto max-w-5xl">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div>

              <h1 className="text-lg font-semibold text-text">

                Knowledge Base

              </h1>

              <p className="mt-0.5 text-xs text-text-muted">

                {documents.length}
                {" "}documents ·{" "}
                {totalChunks}
                {" "}chunks ·{" "}
                {formatBytes(
                  totalStorage
                )}

              </p>

            </div>

            <Button

              icon={
                <LuUpload className="h-3.5 w-3.5" />
              }

              onClick={() =>
                navigate("/upload")
              }

            >

              Upload documents

            </Button>

          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">

            <div className="relative flex-1 min-w-[200px]">

              <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />

              <input

                value={search}

                onChange={e =>
                  setSearch(
                    e.target.value
                  )
                }

                placeholder="Search documents..."

                className="focus-ring w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-xs"

              />

            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">

              {

                typeFilters.map(
                  type => (

                    <button

                      key={type}

                      onClick={() =>
                        setTypeFilter(
                          type
                        )
                      }

                      className={cn(

                        "focus-ring rounded-md px-2.5 py-1.5 text-[11px] uppercase",

                        typeFilter ===
                          type
                          ? "gradient-primary text-white"
                          : "text-text-muted"

                      )}

                    >

                      {type}

                    </button>

                  )
                )

              }

            </div>

            <button

              onClick={() =>
                setFavOnly(
                  !favOnly
                )
              }

              className="focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px]"

            >

              <LuStar className={cn(
                "h-3.5 w-3.5",
                favOnly &&
                  "fill-current"
              )} />

              Favorites

            </button>

            <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px]">

              <LuFilter className="h-3.5 w-3.5" />

              More filters

            </button>

          </div>

          {

            filtered.length === 0

            ?

            <EmptyState
              onUpload={() =>
                navigate("/upload")
              }
            />

            :

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <AnimatePresence>

                {

                  filtered.map(
                    doc => {

                      const status =
                        statusStyles[
                          doc.embeddingStatus
                        ];

                      const type =
                        fileTypeConfig(
                          doc.fileType
                        );

                      return (

                        <motion.div

                          key={doc.id}

                          layout

                          initial={{
                            opacity:0,
                            y:8,
                          }}

                          animate={{
                            opacity:1,
                            y:0,
                          }}

                          exit={{
                            opacity:0,
                          }}

                          className="group rounded-xl border border-border bg-card p-4"

                        >

                          <div className={cn(
                            "absolute inset-x-0 top-0 h-0.5",
                            type.bg.replace("/10",""),
                          )}/>

                          <div className="flex items-start gap-3">

                            <FileTypeIcon
                              type={doc.fileType}
                            />

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-medium">

                                {doc.filename}

                              </p>

                              <p className="text-[11px] text-text-muted">

                                {formatBytes(doc.sizeBytes)}
                                {" · "}
                                {formatRelativeTime(doc.uploadedAt)}

                              </p>

                            </div>

                          </div>

                          <div className="mt-3 flex gap-2">

                            <Badge variant={status.variant} dot>

                              {status.label}

                            </Badge>

                            <Badge>

                              {doc.chunks} chunks

                            </Badge>

                          </div>

                          <div className="mt-3 flex items-center justify-between">

                            <button
                              onClick={()=>
                                toggleFavorite(doc.id)
                              }
                            >
                              <LuStar className={cn(
                                "h-4 w-4",
                                doc.favorite &&
                                "fill-current text-warning"
                              )}/>
                            </button>

                            <button
                              onClick={()=>{
                                removeDocument(doc.id);
                                toast.success("Removed");
                              }}
                            >
                              <LuTrash2 className="h-4 w-4"/>
                            </button>

                          </div>

                        </motion.div>

                      );

                    }

                  )

                }

              </AnimatePresence>

            </div>

          }

        </div>

      </div>

    </div>

  );

}

function EmptyState({

  onUpload,

}:{

  onUpload:()=>void;

}){

  return(

    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">

      <LuSearch className="h-8 w-8 text-text-muted"/>

      <p className="mt-3 text-sm">

        No documents found

      </p>

      <Button

        className="mt-4"

        onClick={onUpload}

        icon={
          <LuUpload className="h-3.5 w-3.5"/>
        }

      >

        Upload documents

      </Button>

    </div>

  );

}