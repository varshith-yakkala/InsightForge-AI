import os
import traceback

from fastapi import (
    APIRouter,
    HTTPException,
    Request,
    UploadFile,
    File,
)

from backend.api.schemas import (
    HealthResponse,
    QueryRequest,
    QueryResponse,
    UploadResponse,
)

router = APIRouter()


# -------------------------------------------------
# Health
# -------------------------------------------------

@router.get(
    "/health",
    response_model=HealthResponse,
)
def health():

    return {
        "status": "healthy",
        "embeddingModel": "all-MiniLM-L6-v2",
        "llmModel": "gemini-flash-latest",
    }


# -------------------------------------------------
# Documents
# -------------------------------------------------

@router.get(
    "/documents",
)
def get_documents(
    request: Request,
):

    rag = request.app.state.rag

    return rag.get_documents()


@router.get(
    "/documents/{document_id}",
)
def get_document(
    document_id: str,
    request: Request,
):

    rag = request.app.state.rag

    document = rag.get_document(
        document_id
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return document


# -------------------------------------------------
# Dashboard Stats
# -------------------------------------------------

@router.get(
    "/stats",
)
def get_stats(
    request: Request,
):

    rag = request.app.state.rag

    return rag.get_stats()


# -------------------------------------------------
# Query
# -------------------------------------------------

@router.post(
    "/query",
    response_model=QueryResponse,
)
def query(
    request: Request,
    body: QueryRequest,
):

    rag = request.app.state.rag

    try:

        return rag.query(
            body.question
        )

    except Exception as e:

        print("\n" + "=" * 80)
        print("QUERY PIPELINE ERROR")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# -------------------------------------------------
# Upload
# -------------------------------------------------

@router.post(
    "/upload",
    response_model=UploadResponse,
)
async def upload_files(
    request: Request,
    files: list[UploadFile] = File(...),
):

    upload_dir = "datasets/uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True,
    )

    saved_paths = []

    for file in files:

        file_path = os.path.join(
            upload_dir,
            file.filename,
        )

        with open(
            file_path,
            "wb",
        ) as f:

            f.write(
                await file.read()
            )

        saved_paths.append(
            file_path
        )

    rag = request.app.state.rag

    try:

        documents = rag.load_documents(
            saved_paths
        )

        return {
            "message": f"{len(documents)} document(s) indexed successfully.",
            "documents": documents,
        }

    except Exception as e:

        print("\n" + "=" * 80)
        print("UPLOAD ERROR")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )