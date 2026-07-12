from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Chunk:
    id: str
    document_id: str
    content: str
    metadata: Dict[str, Any]