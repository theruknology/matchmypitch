"""Pydantic models for all data structures."""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class TranscriptPayload(BaseModel):
    """Payload received from ElevenLabs webhook."""

    call_id: str
    call_type: Literal["startup", "investor"]
    transcript_text: str
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WebhookResponse(BaseModel):
    """Response returned by webhook endpoint."""

    status: Literal["accepted", "error"]
    processing_id: str
    details: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response format."""

    error: str
    details: str
    field: Optional[str] = None
    constraint: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class FinancialMetrics(BaseModel):
    """Financial metrics extracted from startup transcripts."""

    revenue: float = Field(ge=0, lt=1_000_000_000, description="Annual revenue in USD")
    burn_rate: float = Field(ge=0, lt=10_000_000, description="Monthly burn rate in USD")
    runway_months: int = Field(ge=0, lt=120, description="Runway in months")
    valuation: float = Field(ge=0, lt=100_000_000_000, description="Company valuation in USD")
    funding_stage: Literal["pre-seed", "seed", "series-a", "series-b", "series-c+"]
    funding_ask: float = Field(ge=0, description="Amount seeking to raise in USD")


class StartupProfile(BaseModel):
    """Complete startup profile with metrics and embedding."""

    startup_id: Optional[UUID] = Field(default_factory=uuid4)
    call_id: str
    startup_name: str
    metrics: FinancialMetrics
    sector: str
    location: str
    team_size: int = Field(ge=1, description="Number of team members")
    embedding: List[float] = Field(min_length=768, max_length=768, description="768-dimension semantic vector")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class InvestmentCriteria(BaseModel):
    """Investment criteria extracted from investor transcripts."""

    stage_preferences: List[str] = Field(description="Preferred funding stages")
    sector_focus: List[str] = Field(min_length=1, description="Sectors of interest")
    min_check_size: float = Field(ge=0, description="Minimum investment amount in USD")
    max_check_size: float = Field(ge=0, description="Maximum investment amount in USD")
    geography_preferences: List[str] = Field(description="Preferred geographic regions")
    geography_any: bool = Field(default=False, description="Whether geography is flexible")

    @field_validator("max_check_size")
    @classmethod
    def check_size_range(cls, v: float, info) -> float:
        """Validate that max_check_size >= min_check_size."""
        if "min_check_size" in info.data and v < info.data["min_check_size"]:
            raise ValueError("max_check_size must be >= min_check_size")
        return v


class InvestorProfile(BaseModel):
    """Complete investor profile with criteria and embedding."""

    investor_id: Optional[UUID] = Field(default_factory=uuid4)
    call_id: str
    investor_name: str
    firm_name: str
    criteria: InvestmentCriteria
    embedding: List[float] = Field(min_length=768, max_length=768, description="768-dimension semantic vector")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Match(BaseModel):
    """Match between a startup and investor with justification."""

    match_id: Optional[UUID] = Field(default_factory=uuid4)
    startup_id: UUID
    investor_id: UUID
    similarity_score: float = Field(ge=0, le=1, description="Cosine similarity score (0=identical, 1=orthogonal)")
    justification_report: str = Field(description="Explanation of why this match is recommended")
    stage_match: bool = Field(description="Whether funding stages align")
    sector_match: bool = Field(description="Whether sectors align")
    check_size_match: bool = Field(description="Whether check size fits")
    geography_match: bool = Field(description="Whether geography aligns")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ValidationResult(BaseModel):
    """Result of data validation."""

    is_valid: bool
    violations: List[Dict[str, str]] = Field(default_factory=list)
    message: Optional[str] = None
