import axios from "axios";
import type {
  Document,
  DashboardStats,
  SystemStatus,
} from "@/types";

function client(backendUrl: string) {
  return axios.create({
    baseURL: backendUrl,
    timeout: 30000,
  });
}

/* ---------------------------------- */
/* Health */
/* ---------------------------------- */

export async function checkHealth(
  backendUrl: string,
): Promise<SystemStatus> {

  const started = performance.now();

  try {

    const res =
      await client(backendUrl).get("/health");

    return {

      backend: "online",

      embeddingModel:
        res.data.embeddingModel,

      llmModel:
        res.data.llmModel,

      latencyMs:
        Math.round(
          performance.now() - started
        ),

    };

  } catch {

    return {

      backend: "offline",

      embeddingModel: "Unavailable",

      llmModel: "Unavailable",

    };

  }

}

/* ---------------------------------- */
/* Documents */
/* ---------------------------------- */

export async function getDocuments(
  backendUrl: string,
): Promise<Document[]> {

  const res =
    await client(
      backendUrl,
    ).get(
      "/documents",
    );

  return res.data.map(
    (doc: any) => ({

      id: doc.id,

      filename:
        doc.file_name,

      fileType:
        doc.file_type,

      sizeBytes:
        doc.size_bytes,

      uploadedAt:
        doc.indexed_at,

      chunks:
        doc.chunk_count,

      embeddingStatus:
        doc.status,

      indexed: true,

      favorite: false,

    }),
  );

}

/* ---------------------------------- */
/* Upload */
/* ---------------------------------- */

export interface UploadResult {

  documents: Document[];

}

export async function uploadDocuments(

  backendUrl: string,

  files: File[],

  onProgress?: (
    percent: number,
  ) => void,

): Promise<UploadResult> {

  const form =
    new FormData();

  files.forEach(file => {

    form.append(
      "files",
      file,
    );

  });

  const res =
    await client(
      backendUrl,
    ).post(

      "/upload",

      form,

      {

        headers: {

          "Content-Type":
            "multipart/form-data",

        },

        onUploadProgress: e => {

          if (
            e.total &&
            onProgress
          ) {

            onProgress(

              Math.round(

                e.loaded /
                  e.total *
                  100,

              ),

            );

          }

        },

      },

    );

  return {

    documents:

      res.data.documents.map(
        (doc: any) => ({

          id: doc.id,

          filename:
            doc.file_name,

          fileType:
            doc.file_type,

          sizeBytes:
            doc.size_bytes,

          uploadedAt:
            doc.indexed_at,

          chunks:
            doc.chunk_count,

          embeddingStatus:
            doc.status,

          indexed: true,

          favorite: false,

        }),
      ),

  };

}

/* ---------------------------------- */
/* Dashboard */
/* ---------------------------------- */

export async function getDashboardStats(

  backendUrl: string,

): Promise<DashboardStats> {

  const stats =
    await client(
      backendUrl,
    ).get(
      "/stats",
    );

  const docs =
    await getDocuments(
      backendUrl,
    );

  return {

    ...stats.data,

    uploadTrend: [],

    queriesTrend: [],

    documentTypeBreakdown: [

      {

        type: "pdf",

        count:
          docs.filter(
            d => d.fileType === "pdf",
          ).length,

      },

      {

        type: "txt",

        count:
          docs.filter(
            d => d.fileType === "txt",
          ).length,

      },

      {

        type: "md",

        count:
          docs.filter(
            d => d.fileType === "md",
          ).length,

      },

    ],

  };

}

/* ---------------------------------- */
/* Query */
/* ---------------------------------- */

export interface QueryResult {

  content: string;

  confidence: number;

  sources: any[];

  retrievedChunks: any[];

  generationTimeMs: number;

  tokenUsage: {

    prompt: number;

    completion: number;

    total: number;

  };

}

export async function runQuery(

  backendUrl: string,

  question: string,

  settings: {

    topK: number;

    temperature: number;

    maxTokens: number;

  },

): Promise<QueryResult> {

  const res =
    await client(
      backendUrl,
    ).post(

      "/query",

      {

        question,

        ...settings,

      },

    );

  console.log("========== BACKEND RESPONSE ==========");
  console.log(res.data);
  console.log("======================================");

  return {

    content:
      res.data.content,

    confidence:
      res.data.confidence ?? 0,

    generationTimeMs:
      res.data.generationTimeMs ?? 0,

    tokenUsage:
      res.data.tokenUsage ?? {

        prompt: 0,

        completion: 0,

        total: 0,

      },

    retrievedChunks:
      res.data.retrievedChunks ?? [],

    sources:

      (res.data.sources ?? []).map(
        (source: any) => ({

          id:
            source.id,

          documentId:
            source.documentId,

          filename:
            source.filename,

          fileType:
            source.fileType,

          page:
            source.page,

          chunkIndex:
            source.chunkIndex,

          similarity:
            source.similarity,

          preview:
            source.preview,

        }),
      ),

  };

}