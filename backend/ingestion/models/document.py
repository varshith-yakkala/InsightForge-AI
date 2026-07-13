from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any


@dataclass
class Document:
    id: str
    content: str
    metadata: Dict[str, Any]

    filename: str
    file_type: str
    size_bytes: int

    uploaded_at: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )