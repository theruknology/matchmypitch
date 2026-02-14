"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import ValidationError

from app.agents import process_startup_transcript, process_investor_transcript
from app.config import settings
from app.database import db_client
from app.logging_config import setup_logging
from app.models import TranscriptPayload, WebhookResponse

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info(
        "Starting matchmaking backend",
        extra={
            "operation": "startup",
            "clickhouse_host": settings.clickhouse_host,
            "clickhouse_database": settings.clickhouse_database,
        },
    )
    
    # Connect to ClickHouse
    try:
        db_client.connect()
    except Exception as e:
        logger.error(
            "Failed to connect to ClickHouse during startup",
            extra={"operation": "startup", "error": str(e)},
        )
    
    yield
    
    # Shutdown
    logger.info("Shutting down matchmaking backend", extra={"operation": "shutdown"})
    db_client.close()


# Create FastAPI application
app = FastAPI(
    title="Matchmaking Backend Cognitive Engine",
    description="AI-powered matchmaking platform connecting startups and investors",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "matchmaking-backend",
        "version": "0.1.0",
    }


@app.get("/health")
async def health():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected" if db_client.client else "disconnected",
    }


@app.post("/webhook/elevenlabs", response_model=WebhookResponse, status_code=202)
async def receive_transcript(payload: TranscriptPayload, background_tasks: BackgroundTasks) -> WebhookResponse:
    """
    Receive and process post-call transcripts from ElevenLabs.
    
    Accepts JSON payloads with call transcripts and routes them to appropriate
    agents based on call_type (startup or investor).
    
    Args:
        payload: TranscriptPayload with call_id, call_type, transcript_text, timestamp, metadata
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        WebhookResponse with status "accepted" and processing_id for tracking
        
    Raises:
        HTTPException(400): Invalid payload structure or missing required fields
        HTTPException(500): Internal server error during processing
    """
    # Generate processing ID for tracking
    processing_id = str(uuid4())
    
    try:
        logger.info(
            "Received transcript webhook",
            extra={
                "operation": "receive_transcript",
                "processing_id": processing_id,
                "call_id": payload.call_id,
                "call_type": payload.call_type,
                "timestamp": payload.timestamp.isoformat(),
            },
        )
        
        # Route to appropriate agent based on call_type
        if payload.call_type == "startup":
            # Route to Due Diligence Agent (async background task)
            background_tasks.add_task(process_startup_transcript, payload, processing_id)
            agent_type = "Due Diligence Agent"
        elif payload.call_type == "investor":
            # Route to Thesis Agent (async background task)
            background_tasks.add_task(process_investor_transcript, payload, processing_id)
            agent_type = "Thesis Agent"
        else:
            # This should never happen due to Pydantic validation, but handle defensively
            raise ValueError(f"Invalid call_type: {payload.call_type}")
        
        logger.info(
            "Transcript routed to agent",
            extra={
                "operation": "receive_transcript",
                "processing_id": processing_id,
                "call_id": payload.call_id,
                "call_type": payload.call_type,
                "agent": agent_type,
            },
        )
        
        # Return 202 Accepted with processing_id
        return WebhookResponse(
            status="accepted",
            processing_id=processing_id,
            details=f"Transcript received and queued for {agent_type} processing",
        )
        
    except ValidationError as e:
        # Pydantic validation errors (should be caught by FastAPI, but handle explicitly)
        logger.error(
            "Validation error in transcript payload",
            extra={
                "operation": "receive_transcript",
                "processing_id": processing_id,
                "call_id": payload.call_id if hasattr(payload, 'call_id') else None,
                "error": str(e),
            },
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid payload structure",
                "details": str(e),
                "processing_id": processing_id,
            },
        )
    
    except Exception as e:
        # Unexpected server errors
        logger.error(
            "Unexpected error processing transcript",
            extra={
                "operation": "receive_transcript",
                "processing_id": processing_id,
                "error": str(e),
            },
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "details": "An unexpected error occurred while processing the transcript",
                "processing_id": processing_id,
            },
        )

