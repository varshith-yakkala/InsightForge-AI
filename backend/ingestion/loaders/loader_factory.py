import os

from backend.ingestion.loaders.base_loader import BaseLoader
from backend.ingestion.loaders.markdown_loader import MarkdownLoader
from backend.ingestion.loaders.pdf_loader import PDFLoader
from backend.ingestion.loaders.text_loader import TextLoader


class LoaderFactory:

    @staticmethod
    def get_loader(path: str) -> BaseLoader:

        extension = os.path.splitext(path)[1].lower()

        if extension == ".txt":
            return TextLoader()

        elif extension == ".md":
            return MarkdownLoader()

        elif extension == ".pdf":
            return PDFLoader()

        raise ValueError(f"Unsupported file type: {extension}")