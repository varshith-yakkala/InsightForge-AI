# 🚀 InsightForge-AI

<div align="center">

# InsightForge-AI

### A Production-Inspired Hybrid Retrieval-Augmented Generation (RAG) System

Build intelligent AI assistants capable of understanding, indexing, retrieving, and answering questions from your own documents using Hybrid Search (FAISS + BM25) and Large Language Models.

<br>

![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-orange?style=for-the-badge)
![BM25](https://img.shields.io/badge/BM25-Lexical%20Retrieval-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

# 📖 Overview

InsightForge-AI is a **production-inspired Hybrid Retrieval-Augmented Generation (RAG) system** that enables users to transform unstructured documents into an intelligent searchable knowledge base.

Instead of relying solely on Large Language Models, the application retrieves relevant information directly from uploaded documents before generating responses. This ensures answers remain **grounded, explainable, and backed by citations**, significantly reducing hallucinations while improving reliability.

The project demonstrates how modern enterprise AI assistants are architected using modular backend services, hybrid retrieval techniques, vector databases, and scalable APIs.

---

# 🎯 Why InsightForge-AI?

Large Language Models possess remarkable reasoning abilities but suffer from several practical limitations:

- They cannot access your private documents.
- They may hallucinate incorrect information.
- They often lack source attribution.
- Their knowledge is limited to training data.

InsightForge-AI solves these issues through Retrieval-Augmented Generation by retrieving relevant context from user-uploaded documents before invoking the language model.

This approach enables:

- Accurate responses
- Explainable outputs
- Source citations
- Domain-specific knowledge
- Better factual consistency

---

# ✨ Features

## 📂 Intelligent Document Processing

- Upload PDF documents
- Upload Markdown files
- Upload Text files
- Automatic document parsing
- Intelligent document chunking
- Metadata extraction
- Persistent local storage
- Automatic indexing
- Document deletion
- Automatic index rebuilding

---

## 🔍 Hybrid Retrieval Engine

Unlike traditional RAG systems that rely solely on embeddings, InsightForge-AI combines multiple retrieval strategies.

### Semantic Retrieval

- Sentence Transformer embeddings
- Dense vector representations
- FAISS similarity search
- Semantic understanding

### Lexical Retrieval

- BM25 ranking
- Exact keyword matching
- Better performance for technical documents

### Hybrid Ranking

Both retrieval methods are combined to improve overall retrieval quality and increase answer relevance.

Benefits include:

- Better recall
- Better precision
- Reduced retrieval failures
- Stronger context quality

---

## 🤖 AI Question Answering

The assistant provides:

- Context-aware responses
- Citation-backed answers
- Retrieved chunk references
- Hallucination mitigation
- Multi-document reasoning
- Confidence-aware responses

---

## 💻 Modern Frontend

The frontend is built using a modern React ecosystem.

Features include:

- Clean dashboard
- Upload interface
- Chat interface
- Document management
- Responsive design
- Modern UI components
- Real-time interaction

---

# 🏗️ System Architecture

```text
                           ┌────────────────────────────┐
                           │        React Frontend      │
                           └──────────────┬─────────────┘
                                          │
                                          ▼
                           ┌────────────────────────────┐
                           │      FastAPI Backend       │
                           └──────────────┬─────────────┘
                                          │
                ┌─────────────────────────┴─────────────────────────┐
                │                                                   │
                ▼                                                   ▼

        Document Upload                                      User Query

                │                                                   │

        Document Parsing                                 Query Embedding

                │                                                   │

        Intelligent Chunking                       Hybrid Retrieval Engine

                │                                   ┌───────────────┐
                ▼                                   │ FAISS Search  │
        Sentence Embeddings                         └───────────────┘

                │                                   ┌───────────────┐
                ▼                                   │ BM25 Search   │
          Vector Storage                            └───────────────┘

                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼

                               Context Builder

                                       │

                                       ▼

                                Language Model

                                       │

                                       ▼

                          Answer + Source Citations
```

---

# 📁 Project Structure

```text
InsightForge-AI
│
├── backend
│   ├── api
│   ├── core
│   ├── ingestion
│   ├── loaders
│   ├── models
│   ├── storage
│   └── tests
│
├── frontend
│   ├── src
│   ├── pages
│   ├── components
│   ├── services
│   └── store
│
├── datasets
│
├── docs
│
├── assets
│
├── README.md
│
├── requirements.txt
│
└── package.json
```

---

# ⚙️ Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React, TypeScript, Tailwind CSS, Zustand, Vite |
| Backend | FastAPI, Python |
| AI Models | Sentence Transformers, HuggingFace Transformers |
| Retrieval | FAISS, BM25 |
| Storage | JSON, Local File System |
| Development | Git, GitHub |

---

# 🔄 End-to-End Workflow

```text
Document Upload
      │
      ▼
Document Parsing
      │
      ▼
Chunk Generation
      │
      ▼
Embedding Creation
      │
      ▼
Store FAISS Index
      │
Store BM25 Index
      │
Persistent Storage
      │
────────────────────────────────────
            User Query
────────────────────────────────────
      │
Generate Query Embedding
      │
Hybrid Retrieval
      │
Context Builder
      │
Large Language Model
      │
Grounded Response
      │
Source Citations
```

---
# 🚀 Getting Started

## Prerequisites

Before running InsightForge-AI, ensure the following are installed:

- Python 3.11+
- Node.js 18+
- npm
- Git

---

# 📥 Clone Repository

```bash
git clone https://github.com/<your-username>/InsightForge-AI.git

cd InsightForge-AI
```

---

# ⚙️ Backend Setup

## Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn backend.api.app:app --reload
```

Backend runs at

```
http://localhost:8000
```

---

# 💻 Frontend Setup

Move into frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 📡 API Documentation

FastAPI automatically generates interactive API documentation.

Open:

```
http://localhost:8000/docs
```

---

## Available Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/upload` | Upload a document |
| POST | `/query` | Ask questions to the knowledge base |
| GET | `/documents` | Retrieve indexed documents |
| DELETE | `/documents/{id}` | Delete a document |
| GET | `/health` | Backend health status |
| GET | `/stats` | Index statistics *(if implemented)* |

---

# 💡 Usage Guide

## Step 1

Start Backend

```bash
uvicorn backend.api.app:app --reload
```

---

## Step 2

Start Frontend

```bash
npm run dev
```

---

## Step 3

Upload Documents

Supported formats

- PDF
- TXT
- Markdown

The backend automatically

- parses documents
- chunks text
- generates embeddings
- stores FAISS vectors
- creates BM25 indexes

---

## Step 4

Ask Questions

Examples

```
Summarize this document.

Explain the main concepts.

What are the key findings?

Who authored this paper?

What technologies are discussed?
```

---

## Step 5

Receive Response

InsightForge-AI returns

- AI-generated answer
- supporting citations
- retrieved document chunks
- confidence-aware response

---

# 📸 Screenshots

## Home Page

> Add screenshot here

```
assets/home.png
```

---

## Upload Documents

> Add screenshot here

```
assets/upload.png
```

---

## Chat Interface

> Add screenshot here

```
assets/chat.png
```

---

## Documents Page

> Add screenshot here

```
assets/documents.png
```

---

## Search Results

> Add screenshot here

```
assets/results.png
```

---

# 🧠 Engineering Decisions

This project was intentionally designed using modular components similar to production AI systems.

---

## Why FastAPI?

FastAPI provides

- excellent performance
- automatic OpenAPI documentation
- async support
- clean architecture
- easy deployment

---

## Why React?

React enables

- reusable components
- excellent developer experience
- responsive UI
- scalable frontend architecture

---

## Why FAISS?

FAISS offers

- extremely fast vector similarity search
- efficient local indexing
- production-grade retrieval performance

---

## Why BM25?

Dense embeddings sometimes miss exact keyword matches.

BM25 complements semantic retrieval through lexical ranking.

This is especially beneficial for

- technical documents
- code
- abbreviations
- product names
- version numbers

---

## Why Hybrid Retrieval?

Rather than depending on one retrieval method,

InsightForge-AI combines

```
Semantic Retrieval

+

Lexical Retrieval

=

Higher Retrieval Accuracy
```

This significantly improves

- precision
- recall
- robustness

---

## Why Modular Architecture?

Every subsystem is isolated.

```
Loaders

↓

Chunking

↓

Embedding

↓

Storage

↓

Retrieval

↓

LLM

↓

API

↓

Frontend
```

This makes the project

- maintainable
- extensible
- production friendly

---

# 📊 Current Capabilities

| Feature | Status |
|----------|--------|
| PDF Upload | ✅ |
| Markdown Upload | ✅ |
| TXT Upload | ✅ |
| Chunk Generation | ✅ |
| Sentence Embeddings | ✅ |
| FAISS Retrieval | ✅ |
| BM25 Retrieval | ✅ |
| Hybrid Retrieval | ✅ |
| Persistent Storage | ✅ |
| Context Builder | ✅ |
| Source Attribution | ✅ |
| Document Listing | ✅ |
| Document Deletion | ✅ |
| FastAPI APIs | ✅ |
| React Dashboard | ✅ |

---

# ⚡ Performance Highlights

Current implementation provides

- Fast semantic search
- Hybrid retrieval
- Persistent indexes
- Local inference
- Citation-backed answers
- Modular architecture
- Scalable backend design

---

# 🧪 Testing

Recommended testing workflow

✔ Upload documents

✔ Verify indexing

✔ Ask questions

✔ Verify citations

✔ Delete documents

✔ Restart backend

✔ Verify persistence

✔ Test multiple documents

✔ Test unsupported files

✔ Test empty knowledge base

---
# 🌍 Real-World Applications

InsightForge-AI is designed as a generic Retrieval-Augmented Generation platform and can be adapted across multiple industries.

## 📚 Enterprise Knowledge Assistant

- Internal documentation search
- HR policy assistant
- Employee onboarding
- Engineering documentation
- Company wiki search

---

## ⚖️ Legal Document Analysis

- Contract search
- Legal precedent lookup
- Case summarization
- Compliance document retrieval

---

## 🏥 Healthcare

- Medical guideline assistant
- Clinical protocol retrieval
- Research paper exploration
- Hospital knowledge base

---

## 🎓 Education

- AI-powered learning assistant
- Digital library search
- Course material retrieval
- Research paper exploration

---

## 💰 Finance

- Financial report analysis
- Company policy search
- Regulatory document assistant
- Investment research support

---

## 🏭 Manufacturing

- Standard Operating Procedure (SOP) search
- Maintenance manuals
- Equipment troubleshooting
- Incident knowledge base

---

# 🚀 Future Roadmap

The current implementation establishes a strong Hybrid RAG foundation. Future versions will focus on enterprise-scale retrieval, advanced AI workflows, and production deployment.

---

# 📍 Phase 1 — Retrieval Improvements

### Cross Encoder Re-ranking

Improve retrieval quality using a transformer reranker after hybrid retrieval.

Benefits

- Better precision
- Improved ranking quality
- More relevant context

---

### Reciprocal Rank Fusion (RRF)

Combine FAISS and BM25 using RRF instead of weighted averaging.

Benefits

- More stable retrieval
- Better performance across document types

---

### Adaptive Chunking

Current implementation uses static chunking.

Future versions will implement

- Semantic chunking
- Recursive chunking
- Adaptive chunk sizing

---

### Parent-Child Retrieval

Support hierarchical retrieval by linking parent documents with child chunks.

---

### Context Compression

Remove irrelevant retrieved text before sending context to the language model.

---

# 📍 Phase 2 — AI Improvements

### Multi-turn Conversational Memory

Maintain previous conversations.

Features

- Session memory
- Context retention
- Follow-up questions

---

### Query Rewriting

Automatically rewrite user queries for better retrieval.

Example

User

```
Explain transformers
```

Rewritten

```
Explain transformer architecture in machine learning.
```

---

### Agentic RAG

Introduce autonomous reasoning agents capable of

- planning
- searching
- verifying
- refining answers

---

### Hallucination Detection

Automatically estimate answer confidence.

Warn users whenever retrieved evidence is insufficient.

---

### Answer Verification

Verify generated responses against retrieved documents before returning them.

---

# 📍 Phase 3 — Search Enhancements

Future search capabilities include

- Metadata filtering
- Date filtering
- Author filtering
- Tag filtering
- Document categories
- Duplicate detection
- Semantic clustering
- Document recommendations

---

# 📍 Phase 4 — Performance

Improve scalability through

- Redis caching
- Background indexing
- Streaming responses
- Parallel embedding generation
- GPU inference
- Batch processing

---

# 📍 Phase 5 — Security

Enterprise security improvements

- User authentication
- Role Based Access Control (RBAC)
- Encrypted storage
- Secure API keys
- Rate limiting
- Audit logging

---

# 📍 Phase 6 — Scalability

Support enterprise deployments using

- Docker
- Docker Compose
- Kubernetes
- PostgreSQL
- Redis
- Qdrant
- Milvus
- Pinecone
- AWS
- Azure
- Google Cloud

---

# 📍 Phase 7 — Developer Experience

Improve maintainability with

- CI/CD
- Unit testing
- Integration testing
- End-to-End testing
- Logging
- Monitoring
- OpenTelemetry
- GitHub Actions

---

# 🏆 Project Highlights

✔ Hybrid Retrieval (FAISS + BM25)

✔ Modular Architecture

✔ FastAPI REST APIs

✔ Persistent Indexes

✔ Modern React Frontend

✔ Intelligent Document Processing

✔ Source Attribution

✔ Automatic Document Management

✔ Citation-backed Responses

✔ Production-inspired Design

---

# 📚 Challenges & Learnings

Developing InsightForge-AI provided hands-on experience with modern Retrieval-Augmented Generation systems and reinforced several important software engineering concepts.

### AI & Machine Learning

- Building dense vector embeddings
- Hybrid retrieval strategies
- Semantic search
- Prompt grounding
- Context construction

---

### Backend Development

- FastAPI architecture
- REST API design
- Modular backend development
- Data persistence
- Index management

---

### Frontend Development

- State management with Zustand
- React component architecture
- TypeScript integration
- Responsive UI design

---

### Software Engineering

- Clean architecture
- Modular code organization
- Error handling
- Debugging
- Performance optimization
- Git workflow

---

# ⚠️ Current Limitations

Current implementation intentionally prioritizes simplicity and local deployment.

Limitations include

- Local file storage
- Single-user workflow
- No authentication
- Local vector database
- Full index rebuild after document deletion
- No streaming responses
- No conversational memory
- No distributed deployment

These limitations provide opportunities for future enhancements and learning.

---
# 🤝 Contributing

Contributions are always welcome!

If you would like to improve InsightForge-AI, feel free to fork the repository and submit a Pull Request.

## Contribution Workflow

1. Fork the repository

2. Clone your fork

```bash
git clone https://github.com/<your-username>/InsightForge-AI.git
```

3. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push your branch

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request

---

# 📝 Coding Standards

To keep the project maintainable, contributors are encouraged to follow these guidelines:

- Write clean, readable code.
- Follow PEP 8 for Python.
- Use meaningful variable and function names.
- Keep components modular and reusable.
- Add comments where necessary.
- Update documentation for major changes.
- Write tests for new functionality whenever possible.

---

# 🐛 Reporting Issues

Found a bug?

Please open a GitHub Issue including:

- A clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

This helps identify and resolve issues more efficiently.

---

# 💡 Ideas for Contribution

Some areas that would make excellent contributions include:

### Retrieval

- Cross-Encoder Re-ranking
- Reciprocal Rank Fusion
- Better chunk ranking
- Metadata filtering
- Hybrid score optimization

### AI

- Multi-turn conversational memory
- Tool calling
- Agentic workflows
- Query planning
- Hallucination detection
- Answer verification

### Frontend

- Chat history
- Dark mode
- Mobile optimization
- Better document previews
- Advanced search filters

### Backend

- Background task processing
- Streaming responses
- Authentication
- Multi-user workspaces
- Role-based permissions

### DevOps

- Docker support
- Kubernetes deployment
- GitHub Actions
- CI/CD pipelines
- Automated testing
- Monitoring & logging

---

# 📈 Possible Future Research Directions

InsightForge-AI provides a solid foundation for experimenting with modern Retrieval-Augmented Generation techniques.

Potential research directions include:

- GraphRAG
- Agentic RAG
- Self-RAG
- Corrective RAG (CRAG)
- Adaptive RAG
- Multi-Agent Retrieval
- Knowledge Graph Integration
- Long Context Retrieval
- Retrieval Evaluation Benchmarks
- Domain-Specific Fine-Tuning

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to:

- Use
- Modify
- Distribute
- Build upon the project

with proper attribution.

---

# 🙏 Acknowledgements

This project was inspired by modern Retrieval-Augmented Generation systems and the open-source AI ecosystem.

Special thanks to the communities behind:

- FastAPI
- React
- Hugging Face
- Sentence Transformers
- FAISS
- BM25
- Tailwind CSS
- TypeScript

Their tools and libraries made this project possible.

---

# 👨‍💻 Author

## Yakkala Sri Varshith

**B.Tech Computer Science & Engineering (AI & ML)**

VIT-AP University

### Interests

- Artificial Intelligence
- Large Language Models
- Retrieval-Augmented Generation
- Machine Learning
- NLP
- MLOps
- Full Stack AI Applications

### Connect with Me

GitHub:
```
https://github.com/varshith-yakkala
```

LinkedIn:
```
[https://linkedin.com/in/<your-linkedin-profile>](https://www.linkedin.com/in/sri-varshith-yakkala/)
```



Email:
```
varshithyakkala@gmail.com
```

---

# ⭐ Why This Project?

InsightForge-AI was built to explore how modern AI assistants can be grounded in private knowledge instead of relying solely on pretrained language models.

Rather than being just another chatbot, the project demonstrates the complete lifecycle of a Retrieval-Augmented Generation (RAG) system:

- Document ingestion
- Intelligent chunking
- Embedding generation
- Hybrid retrieval (FAISS + BM25)
- Context construction
- Grounded response generation
- Source attribution
- Persistent indexing
- Document lifecycle management

The architecture emphasizes modularity, scalability, and maintainability, making it a practical learning project as well as a foundation for future experimentation with advanced RAG techniques.

---

# 🚀 What's Next?

Future development will focus on transforming InsightForge-AI into a more production-ready AI platform by adding:

- Cross-Encoder reranking
- Streaming LLM responses
- Conversational memory
- Metadata-aware retrieval
- Agentic RAG workflows
- Cloud-native vector databases
- Authentication and multi-user support
- Docker and Kubernetes deployment
- Automated evaluation pipelines
- Comprehensive testing and CI/CD

---

<div align="center">

## ⭐ If you found this project interesting, consider giving it a star!

**Thank you for visiting InsightForge-AI!**

Built with ❤️ using Python, FastAPI, React, TypeScript, FAISS, BM25, and Large Language Models.

</div>
