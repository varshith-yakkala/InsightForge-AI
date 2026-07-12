import os

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


@router.get(
    "/health",
    response_model=HealthResponse,
)
def health():

    return {
        "status": "healthy"
    }


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

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/upload",
    response_model=UploadResponse,
)
async def upload_file(
    request: Request,
    file: UploadFile = File(...)
):

    upload_dir = "datasets/uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True,
    )

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

    rag = request.app.state.rag

    try:

        rag.load_document(
            file_path
        )

        return {
            "message": "Document indexed successfully.",
            "filename": file.filename,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )