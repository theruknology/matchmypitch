"""Unit tests for webhook endpoint."""

import pytest
from datetime import datetime
from fastapi.testclient import TestClient

from app.main import app
from app.models import TranscriptPayload


client = TestClient(app)


class TestWebhookEndpoint:
    """Tests for /webhook/elevenlabs endpoint."""

    def test_valid_startup_transcript(self):
        """Test webhook accepts valid startup transcript and returns 202."""
        payload = {
            "call_id": "test-call-123",
            "call_type": "startup",
            "transcript_text": "We are a SaaS company with $1M ARR...",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {"duration": 1800, "language": "en"},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "accepted"
        assert "processing_id" in data
        assert data["processing_id"] is not None
        assert "details" in data

    def test_valid_investor_transcript(self):
        """Test webhook accepts valid investor transcript and returns 202."""
        payload = {
            "call_id": "test-call-456",
            "call_type": "investor",
            "transcript_text": "We invest in early-stage B2B SaaS companies...",
            "timestamp": "2024-01-15T11:00:00Z",
            "metadata": {"duration": 1200},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "accepted"
        assert "processing_id" in data

    def test_missing_required_field_call_id(self):
        """Test webhook returns 400 when call_id is missing."""
        payload = {
            "call_type": "startup",
            "transcript_text": "Some transcript text",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 422  # FastAPI validation error
        data = response.json()
        assert "detail" in data

    def test_missing_required_field_call_type(self):
        """Test webhook returns 400 when call_type is missing."""
        payload = {
            "call_id": "test-call-789",
            "transcript_text": "Some transcript text",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data

    def test_invalid_call_type(self):
        """Test webhook returns 400 when call_type is invalid."""
        payload = {
            "call_id": "test-call-999",
            "call_type": "invalid_type",
            "transcript_text": "Some transcript text",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data

    def test_malformed_json(self):
        """Test webhook returns 400 for malformed JSON."""
        response = client.post(
            "/webhook/elevenlabs",
            data="not valid json",
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 422

    def test_empty_payload(self):
        """Test webhook returns 400 for empty payload."""
        response = client.post("/webhook/elevenlabs", json={})

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data

    def test_missing_transcript_text(self):
        """Test webhook returns 400 when transcript_text is missing."""
        payload = {
            "call_id": "test-call-111",
            "call_type": "startup",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 422

    def test_invalid_timestamp_format(self):
        """Test webhook returns 400 for invalid timestamp format."""
        payload = {
            "call_id": "test-call-222",
            "call_type": "startup",
            "transcript_text": "Some text",
            "timestamp": "not-a-valid-timestamp",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 422

    def test_metadata_optional(self):
        """Test webhook accepts payload without metadata field."""
        payload = {
            "call_id": "test-call-333",
            "call_type": "startup",
            "transcript_text": "Some transcript text",
            "timestamp": "2024-01-15T10:30:00Z",
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "accepted"

    def test_response_format(self):
        """Test webhook response has correct format with snake_case fields."""
        payload = {
            "call_id": "test-call-444",
            "call_type": "investor",
            "transcript_text": "Investment criteria...",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        
        # Check snake_case field naming
        assert "status" in data
        assert "processing_id" in data
        assert "details" in data
        
        # Check no camelCase fields
        assert "processingId" not in data
        assert "callId" not in data

    def test_processing_id_uniqueness(self):
        """Test that each request gets a unique processing_id."""
        payload = {
            "call_id": "test-call-555",
            "call_type": "startup",
            "transcript_text": "Some text",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response1 = client.post("/webhook/elevenlabs", json=payload)
        response2 = client.post("/webhook/elevenlabs", json=payload)

        assert response1.status_code == 202
        assert response2.status_code == 202
        
        data1 = response1.json()
        data2 = response2.json()
        
        assert data1["processing_id"] != data2["processing_id"]
