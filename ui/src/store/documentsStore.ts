import { create } from "zustand";

import type { Document } from "@/types";

import {
  uploadDocuments,
  getDocuments,
} from "@/services/api";

interface UploadProgress {

  file: File;

  progress: number;

}

interface DocumentsState {

  documents: Document[];

  uploading: UploadProgress[];

  refresh: (
    backendUrl: string,
  ) => Promise<void>;

  addDocuments: (
    docs: Document[],
  ) => void;

  removeDocument: (
    id: string,
  ) => void;

  toggleFavorite: (
    id: string,
  ) => void;

  clearDocuments: () => void;

  upload: (
    backendUrl: string,
    files: File[],
  ) => Promise<void>;
}

export const useDocumentsStore =
create<DocumentsState>((set, get) => ({

  documents: [],

  uploading: [],

  refresh: async (
    backendUrl,
  ) => {

    const docs =
      await getDocuments(
        backendUrl,
      );

    set({

      documents: docs,

    });

  },

  addDocuments: (
    docs,
  ) =>

    set((state) => ({

      documents: [
        ...docs,
        ...state.documents,
      ],

    })),

  removeDocument: (
    id,
  ) =>

    set((state) => ({

      documents:
        state.documents.filter(

          (doc) =>
            doc.id !== id

        ),

    })),

  toggleFavorite: (
    id,
  ) =>

    set((state) => ({

      documents:

        state.documents.map(

          (doc) =>

            doc.id === id

              ? {

                  ...doc,

                  favorite:
                    !doc.favorite,

                }

              : doc

        ),

    })),

  clearDocuments: () =>

    set({

      documents: [],

    }),

  upload: async (

    backendUrl,

    files,

  ) => {

    set((state) => ({

      uploading: [

        ...state.uploading,

        ...files.map(

          (file) => ({

            file,

            progress: 0,

          })

        ),

      ],

    }));

    await uploadDocuments(

      backendUrl,

      files,

      (progress) => {

        set((state) => ({

          uploading:

            state.uploading.map(

              (upload) =>

                files.includes(

                  upload.file

                )

                  ? {

                      ...upload,

                      progress,

                    }

                  : upload

            ),

        }));

      },

    );

    await get().refresh(
      backendUrl,
    );

    set((state) => ({

      uploading:

        state.uploading.filter(

          (upload) =>

            !files.includes(
              upload.file,
            ),

        ),

    }));

  },

}));