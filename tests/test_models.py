"""Tests for Pydantic models."""

import pytest
from datetime import datetime
from uuid import uuid4

from app.models import (
    FinancialMetrics,
    InvestmentCriteria,
    StartupProfile,
    InvestorProfile,
    Match,
    TranscriptPayload,
    WebhookResponse,
    ValidationResult,
)


class TestFinancialMetrics:
    """Tests for FinancialMetrics model."""

    def test_valid_metrics(self):
        """Test creating valid financial metrics."""
        metrics = FinancialMetrics(
            revenue=1_000_000,
            burn_rate=50_000,
            runway_months=20,
            valuation=10_000_000,
            funding_stage="seed",
            funding_ask=2_000_000,
        )
        assert metrics.revenue == 1_000_000
        assert metrics.burn_rate == 50_000
        assert metrics.runway_months == 20

    def test_negative_revenue_fails(self):
        """Test that negative revenue is rejected."""
        with pytest.raises(ValueError):
            FinancialMetrics(
                revenue=-100,
                burn_rate=50_000,
                runway_months=20,
                valuation=10_000_000,
                funding_stage="seed",
                funding_ask=2_000_000,
            )

    def test_excessive_burn_rate_fails(self):
        """Test that excessive burn rate is rejected."""
        with pytest.raises(ValueError):
            FinancialMetrics(
                revenue=1_000_000,
                burn_rate=20_000_000,  # Over 10M limit
                runway_months=20,
                valuation=10_000_000,
                funding_stage="seed",
                funding_ask=2_000_000,
            )

    def test_invalid_funding_stage_fails(self):
        """Test that invalid funding stage is rejected."""
        with pytest.raises(ValueError):
            FinancialMetrics(
                revenue=1_000_000,
                burn_rate=50_000,
                runway_months=20,
                valuation=10_000_000,
                funding_stage="series-z",  # Invalid stage
                funding_ask=2_000_000,
            )


class TestInvestmentCriteria:
    """Tests for InvestmentCriteria model."""

    def test_valid_criteria(self):
        """Test creating valid investment criteria."""
        criteria = InvestmentCriteria(
            stage_preferences=["seed", "series-a"],
            sector_focus=["fintech", "healthtech"],
            min_check_size=100_000,
            max_check_size=5_000_000,
            geography_preferences=["US", "EU"],
            geography_any=False,
        )
        assert criteria.min_check_size == 100_000
        assert criteria.max_check_size == 5_000_000

    def test_max_less_than_min_fails(self):
        """Test that max_check_size < min_check_size is rejected."""
        with pytest.raises(ValueError, match="max_check_size must be >= min_check_size"):
            InvestmentCriteria(
                stage_preferences=["seed"],
                sector_focus=["fintech"],
                min_check_size=5_000_000,
                max_check_size=100_000,  # Less than min
                geography_preferences=["US"],
            )

    def test_empty_sector_focus_fails(self):
        """Test that empty sector_focus is rejected."""
        with pytest.raises(ValueError):
            InvestmentCriteria(
                stage_preferences=["seed"],
                sector_focus=[],  # Empty list
                min_check_size=100_000,
                max_check_size=5_000_000,
                geography_preferences=["US"],
            )


class TestStartupProfile:
    """Tests for StartupProfile model."""

    def test_valid_profile(self):
        """Test creating valid startup profile."""
        metrics = FinancialMetrics(
            revenue=1_000_000,
            burn_rate=50_000,
            runway_months=20,
            valuation=10_000_000,
            funding_stage="seed",
            funding_ask=2_000_000,
        )
        
        profile = StartupProfile(
            call_id="call-123",
            startup_name="TestCo",
            metrics=metrics,
            sector="fintech",
            location="San Francisco",
            team_size=5,
            embedding=[0.1] * 768,
        )
        
        assert profile.startup_name == "TestCo"
        assert len(profile.embedding) == 768
        assert profile.startup_id is not None

    def test_invalid_embedding_dimension_fails(self):
        """Test that wrong embedding dimension is rejected."""
        metrics = FinancialMetrics(
            revenue=1_000_000,
            burn_rate=50_000,
            runway_months=20,
            valuation=10_000_000,
            funding_stage="seed",
            funding_ask=2_000_000,
        )
        
        with pytest.raises(ValueError):
            StartupProfile(
                call_id="call-123",
                startup_name="TestCo",
                metrics=metrics,
                sector="fintech",
                location="San Francisco",
                team_size=5,
                embedding=[0.1] * 100,  # Wrong dimension
            )


class TestInvestorProfile:
    """Tests for InvestorProfile model."""

    def test_valid_profile(self):
        """Test creating valid investor profile."""
        criteria = InvestmentCriteria(
            stage_preferences=["seed", "series-a"],
            sector_focus=["fintech"],
            min_check_size=100_000,
            max_check_size=5_000_000,
            geography_preferences=["US"],
        )
        
        profile = InvestorProfile(
            call_id="call-456",
            investor_name="Jane Doe",
            firm_name="Acme Ventures",
            criteria=criteria,
            embedding=[0.2] * 768,
        )
        
        assert profile.investor_name == "Jane Doe"
        assert profile.firm_name == "Acme Ventures"
        assert len(profile.embedding) == 768


class TestMatch:
    """Tests for Match model."""

    def test_valid_match(self):
        """Test creating valid match."""
        match = Match(
            startup_id=uuid4(),
            investor_id=uuid4(),
            similarity_score=0.85,
            justification_report="Strong alignment on fintech focus and stage",
            stage_match=True,
            sector_match=True,
            check_size_match=True,
            geography_match=True,
        )
        
        assert 0 <= match.similarity_score <= 1
        assert match.stage_match is True

    def test_invalid_similarity_score_fails(self):
        """Test that similarity score outside [0,1] is rejected."""
        with pytest.raises(ValueError):
            Match(
                startup_id=uuid4(),
                investor_id=uuid4(),
                similarity_score=1.5,  # Over 1.0
                justification_report="Test",
                stage_match=True,
                sector_match=True,
                check_size_match=True,
                geography_match=True,
            )


class TestTranscriptPayload:
    """Tests for TranscriptPayload model."""

    def test_valid_startup_payload(self):
        """Test creating valid startup transcript payload."""
        payload = TranscriptPayload(
            call_id="call-789",
            call_type="startup",
            transcript_text="We are a fintech startup...",
            timestamp=datetime.utcnow(),
        )
        
        assert payload.call_type == "startup"
        assert payload.call_id == "call-789"

    def test_valid_investor_payload(self):
        """Test creating valid investor transcript payload."""
        payload = TranscriptPayload(
            call_id="call-790",
            call_type="investor",
            transcript_text="I invest in early stage...",
            timestamp=datetime.utcnow(),
        )
        
        assert payload.call_type == "investor"

    def test_invalid_call_type_fails(self):
        """Test that invalid call_type is rejected."""
        with pytest.raises(ValueError):
            TranscriptPayload(
                call_id="call-791",
                call_type="unknown",  # Invalid type
                transcript_text="Test",
                timestamp=datetime.utcnow(),
            )


class TestWebhookResponse:
    """Tests for WebhookResponse model."""

    def test_accepted_response(self):
        """Test creating accepted webhook response."""
        response = WebhookResponse(
            status="accepted",
            processing_id="proc-123",
        )
        
        assert response.status == "accepted"
        assert response.processing_id == "proc-123"

    def test_error_response(self):
        """Test creating error webhook response."""
        response = WebhookResponse(
            status="error",
            processing_id="proc-124",
            details="Invalid payload structure",
        )
        
        assert response.status == "error"
        assert response.details == "Invalid payload structure"


class TestValidationResult:
    """Tests for ValidationResult model."""

    def test_valid_result(self):
        """Test creating valid validation result."""
        result = ValidationResult(
            is_valid=True,
            violations=[],
            message="All constraints satisfied",
        )
        
        assert result.is_valid is True
        assert len(result.violations) == 0

    def test_invalid_result_with_violations(self):
        """Test creating invalid validation result with violations."""
        result = ValidationResult(
            is_valid=False,
            violations=[
                {"field": "revenue", "constraint": "non-negative", "value": "-100"},
                {"field": "burn_rate", "constraint": "< 10M", "value": "20000000"},
            ],
            message="Validation failed",
        )
        
        assert result.is_valid is False
        assert len(result.violations) == 2
