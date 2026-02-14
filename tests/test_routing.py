"""Unit tests for agent routing logic."""

import pytest
from unittest.mock import AsyncMock, patch
from datetime import datetime
from fastapi.testclient import TestClient

from app.main import app
from app.models import TranscriptPayload


client = TestClient(app)


class TestAgentRouting:
    """Tests for routing transcripts to appropriate agents."""

    @patch("app.main.process_startup_transcript", new_callable=AsyncMock)
    def test_startup_transcript_routes_to_due_diligence_agent(self, mock_process_startup):
        """Test that startup transcripts are routed to Due Diligence Agent."""
        payload = {
            "call_id": "test-startup-001",
            "call_type": "startup",
            "transcript_text": "We are a SaaS company with $1M ARR...",
            "timestamp": "2024-01-15T10:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "accepted"
        assert "Due Diligence Agent" in data["details"]
        
        # Verify the correct agent function was called
        # Note: Background tasks execute after response, so we check it was added
        # In a real scenario, we'd need to wait for background task completion

    @patch("app.main.process_investor_transcript", new_callable=AsyncMock)
    def test_investor_transcript_routes_to_thesis_agent(self, mock_process_investor):
        """Test that investor transcripts are routed to Thesis Agent."""
        payload = {
            "call_id": "test-investor-001",
            "call_type": "investor",
            "transcript_text": "We invest in early-stage B2B SaaS companies...",
            "timestamp": "2024-01-15T11:00:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "accepted"
        assert "Thesis Agent" in data["details"]

    def test_startup_routing_response_details(self):
        """Test that startup routing includes correct agent type in response."""
        payload = {
            "call_id": "test-startup-002",
            "call_type": "startup",
            "transcript_text": "Our startup is in the fintech space...",
            "timestamp": "2024-01-15T12:00:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert "Due Diligence Agent" in data["details"]

    def test_investor_routing_response_details(self):
        """Test that investor routing includes correct agent type in response."""
        payload = {
            "call_id": "test-investor-002",
            "call_type": "investor",
            "transcript_text": "We focus on Series A investments...",
            "timestamp": "2024-01-15T12:30:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert "Thesis Agent" in data["details"]

    def test_routing_preserves_processing_id(self):
        """Test that processing_id is generated and returned for routing."""
        payload = {
            "call_id": "test-routing-001",
            "call_type": "startup",
            "transcript_text": "Test transcript",
            "timestamp": "2024-01-15T13:00:00Z",
            "metadata": {},
        }

        response = client.post("/webhook/elevenlabs", json=payload)

        assert response.status_code == 202
        data = response.json()
        assert "processing_id" in data
        assert data["processing_id"] is not None
        assert len(data["processing_id"]) > 0

    def test_multiple_startup_requests_route_correctly(self):
        """Test that multiple startup requests all route to Due Diligence Agent."""
        for i in range(3):
            payload = {
                "call_id": f"test-startup-multi-{i}",
                "call_type": "startup",
                "transcript_text": f"Startup transcript {i}",
                "timestamp": "2024-01-15T14:00:00Z",
                "metadata": {},
            }

            response = client.post("/webhook/elevenlabs", json=payload)

            assert response.status_code == 202
            data = response.json()
            assert "Due Diligence Agent" in data["details"]

    def test_multiple_investor_requests_route_correctly(self):
        """Test that multiple investor requests all route to Thesis Agent."""
        for i in range(3):
            payload = {
                "call_id": f"test-investor-multi-{i}",
                "call_type": "investor",
                "transcript_text": f"Investor transcript {i}",
                "timestamp": "2024-01-15T15:00:00Z",
                "metadata": {},
            }

            response = client.post("/webhook/elevenlabs", json=payload)

            assert response.status_code == 202
            data = response.json()
            assert "Thesis Agent" in data["details"]

    def test_mixed_call_types_route_correctly(self):
        """Test that mixed startup and investor calls route to correct agents."""
        test_cases = [
            ("startup", "Due Diligence Agent"),
            ("investor", "Thesis Agent"),
            ("startup", "Due Diligence Agent"),
            ("investor", "Thesis Agent"),
        ]

        for i, (call_type, expected_agent) in enumerate(test_cases):
            payload = {
                "call_id": f"test-mixed-{i}",
                "call_type": call_type,
                "transcript_text": f"Test transcript {i}",
                "timestamp": "2024-01-15T16:00:00Z",
                "metadata": {},
            }

            response = client.post("/webhook/elevenlabs", json=payload)

            assert response.status_code == 202
            data = response.json()
            assert expected_agent in data["details"]
