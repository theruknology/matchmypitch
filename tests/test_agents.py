"""Unit tests for agent routing functions."""

import pytest
from datetime import datetime

from app.agents import process_startup_transcript, process_investor_transcript
from app.models import TranscriptPayload


class TestAgentFunctions:
    """Tests for agent processing functions."""

    @pytest.mark.asyncio
    async def test_process_startup_transcript_returns_correct_structure(self):
        """Test that process_startup_transcript returns expected structure."""
        payload = TranscriptPayload(
            call_id="test-startup-001",
            call_type="startup",
            transcript_text="We are a SaaS company with $1M ARR...",
            timestamp=datetime.fromisoformat("2024-01-15T10:30:00"),
            metadata={},
        )
        processing_id = "test-processing-123"

        result = await process_startup_transcript(payload, processing_id)

        assert isinstance(result, dict)
        assert result["status"] == "queued"
        assert result["agent"] == "due_diligence"
        assert result["processing_id"] == processing_id
        assert "message" in result

    @pytest.mark.asyncio
    async def test_process_investor_transcript_returns_correct_structure(self):
        """Test that process_investor_transcript returns expected structure."""
        payload = TranscriptPayload(
            call_id="test-investor-001",
            call_type="investor",
            transcript_text="We invest in early-stage B2B SaaS companies...",
            timestamp=datetime.fromisoformat("2024-01-15T11:00:00"),
            metadata={},
        )
        processing_id = "test-processing-456"

        result = await process_investor_transcript(payload, processing_id)

        assert isinstance(result, dict)
        assert result["status"] == "queued"
        assert result["agent"] == "thesis"
        assert result["processing_id"] == processing_id
        assert "message" in result

    @pytest.mark.asyncio
    async def test_process_startup_transcript_with_metadata(self):
        """Test startup processing with metadata."""
        payload = TranscriptPayload(
            call_id="test-startup-002",
            call_type="startup",
            transcript_text="Our startup is in the fintech space...",
            timestamp=datetime.fromisoformat("2024-01-15T12:00:00"),
            metadata={"duration": 1800, "language": "en"},
        )
        processing_id = "test-processing-789"

        result = await process_startup_transcript(payload, processing_id)

        assert result["status"] == "queued"
        assert result["agent"] == "due_diligence"

    @pytest.mark.asyncio
    async def test_process_investor_transcript_with_metadata(self):
        """Test investor processing with metadata."""
        payload = TranscriptPayload(
            call_id="test-investor-002",
            call_type="investor",
            transcript_text="We focus on Series A investments...",
            timestamp=datetime.fromisoformat("2024-01-15T12:30:00"),
            metadata={"duration": 1200, "language": "en"},
        )
        processing_id = "test-processing-101"

        result = await process_investor_transcript(payload, processing_id)

        assert result["status"] == "queued"
        assert result["agent"] == "thesis"

    @pytest.mark.asyncio
    async def test_process_startup_transcript_message_content(self):
        """Test that startup processing message mentions Due Diligence Agent."""
        payload = TranscriptPayload(
            call_id="test-startup-003",
            call_type="startup",
            transcript_text="Test transcript",
            timestamp=datetime.fromisoformat("2024-01-15T13:00:00"),
            metadata={},
        )
        processing_id = "test-processing-202"

        result = await process_startup_transcript(payload, processing_id)

        assert "Due Diligence Agent" in result["message"]

    @pytest.mark.asyncio
    async def test_process_investor_transcript_message_content(self):
        """Test that investor processing message mentions Thesis Agent."""
        payload = TranscriptPayload(
            call_id="test-investor-003",
            call_type="investor",
            transcript_text="Test transcript",
            timestamp=datetime.fromisoformat("2024-01-15T13:30:00"),
            metadata={},
        )
        processing_id = "test-processing-303"

        result = await process_investor_transcript(payload, processing_id)

        assert "Thesis Agent" in result["message"]

    @pytest.mark.asyncio
    async def test_multiple_startup_processing_calls(self):
        """Test multiple startup processing calls work correctly."""
        for i in range(3):
            payload = TranscriptPayload(
                call_id=f"test-startup-multi-{i}",
                call_type="startup",
                transcript_text=f"Startup transcript {i}",
                timestamp=datetime.fromisoformat("2024-01-15T14:00:00"),
                metadata={},
            )
            processing_id = f"test-processing-{i}"

            result = await process_startup_transcript(payload, processing_id)

            assert result["status"] == "queued"
            assert result["agent"] == "due_diligence"
            assert result["processing_id"] == processing_id

    @pytest.mark.asyncio
    async def test_multiple_investor_processing_calls(self):
        """Test multiple investor processing calls work correctly."""
        for i in range(3):
            payload = TranscriptPayload(
                call_id=f"test-investor-multi-{i}",
                call_type="investor",
                transcript_text=f"Investor transcript {i}",
                timestamp=datetime.fromisoformat("2024-01-15T15:00:00"),
                metadata={},
            )
            processing_id = f"test-processing-{i}"

            result = await process_investor_transcript(payload, processing_id)

            assert result["status"] == "queued"
            assert result["agent"] == "thesis"
            assert result["processing_id"] == processing_id
