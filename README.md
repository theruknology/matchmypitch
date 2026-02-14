# Matchmaking Backend Cognitive Engine

AI-powered matchmaking platform connecting startups and investors using voice call transcripts.

## Overview

This backend processes call transcripts from ElevenLabs to create intelligent matches between startups and investors. The system uses three specialized AI agents orchestrated through the strands-agents framework, with data stored in ClickHouse for hybrid vector similarity and SQL-based filtering.

## Architecture

- **API Layer**: FastAPI webhook endpoint for transcript ingestion
- **Agent Layer**: Three specialized agents (Due Diligence, Thesis, Matchmaker)
- **Storage Layer**: ClickHouse for profiles/vectors, S3 via MCP for documents
- **Orchestration**: strands-agents framework for agent coordination

## Setup

### Prerequisites

- Python 3.10+
- ClickHouse database
- Virtual environment (recommended)

### Installation

1. Clone the repository
2. Create and activate virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   Or with Poetry:
   ```bash
   poetry install
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize ClickHouse database:
   ```bash
   python scripts/init_db.py
   ```

### Running the Application

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /webhook/elevenlabs` - Receive call transcripts (coming soon)

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run only property-based tests
pytest -m property_test
```

### Code Formatting

```bash
# Format code
black app/

# Lint code
ruff check app/
```

## Project Structure

```
matchmaking-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models.py            # Pydantic data models
│   ├── database.py          # ClickHouse client
│   ├── logging_config.py    # Structured logging
│   ├── agents/              # AI agents (coming soon)
│   └── routes/              # API routes (coming soon)
├── tests/                   # Test suite (coming soon)
├── scripts/                 # Utility scripts (coming soon)
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Poetry configuration
└── README.md               # This file
```

## License

Proprietary
