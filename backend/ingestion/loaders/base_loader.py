from abc import ABC,abstractmethod
from backend.ingestion.models.document import Document
class BaseLoader(ABC):
    @abstractmethod
    def load(self,path:str)->Document:
        pass