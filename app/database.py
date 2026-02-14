"""ClickHouse database connection and operations."""

import logging
from typing import Any, Dict, List, Optional
from uuid import UUID

import clickhouse_connect
from clickhouse_connect.driver import Client

from app.config import settings
from app.models import InvestorProfile, Match, StartupProfile

logger = logging.getLogger(__name__)


class ClickHouseClient:
    """Wrapper for ClickHouse database operations."""

    def __init__(self):
        """Initialize ClickHouse client."""
        self.client: Optional[Client] = None

    def connect(self) -> Client:
        """Establish connection to ClickHouse."""
        if self.client is None:
            try:
                self.client = clickhouse_connect.get_client(
                    host=settings.clickhouse_host,
                    port=settings.clickhouse_port,
                    username=settings.clickhouse_user,
                    password=settings.clickhouse_password,
                    database=settings.clickhouse_database,
                )
                logger.info(
                    "Connected to ClickHouse",
                    extra={
                        "operation": "connect",
                        "host": settings.clickhouse_host,
                        "database": settings.clickhouse_database,
                    },
                )
            except Exception as e:
                logger.error(
                    "Failed to connect to ClickHouse",
                    extra={
                        "operation": "connect",
                        "error": str(e),
                    },
                )
                raise
        return self.client

    def close(self):
        """Close ClickHouse connection."""
        if self.client:
            self.client.close()
            self.client = None
            logger.info("Closed ClickHouse connection")

    def write_startup_profile(self, profile: StartupProfile) -> bool:
        """
        Write startup profile and embedding to ClickHouse atomically.

        Args:
            profile: StartupProfile with all fields including embedding

        Returns:
            True if write succeeded, False otherwise
        """
        try:
            client = self.connect()

            # Prepare data for insertion
            data = [
                [
                    str(profile.startup_id),
                    profile.call_id,
                    profile.startup_name,
                    float(profile.metrics.revenue),
                    float(profile.metrics.burn_rate),
                    profile.metrics.runway_months,
                    float(profile.metrics.valuation),
                    profile.metrics.funding_stage,
                    float(profile.metrics.funding_ask),
                    profile.sector,
                    profile.location,
                    profile.team_size,
                    profile.embedding,
                    profile.created_at,
                ]
            ]

            # Execute insert
            client.insert(
                "startups",
                data,
                column_names=[
                    "startup_id",
                    "call_id",
                    "startup_name",
                    "revenue",
                    "burn_rate",
                    "runway_months",
                    "valuation",
                    "funding_stage",
                    "funding_ask",
                    "sector",
                    "location",
                    "team_size",
                    "embedding",
                    "created_at",
                ],
            )

            logger.info(
                "Successfully wrote startup profile",
                extra={
                    "operation": "write_startup_profile",
                    "startup_id": str(profile.startup_id),
                    "startup_name": profile.startup_name,
                },
            )
            return True

        except Exception as e:
            logger.error(
                "Failed to write startup profile",
                extra={
                    "operation": "write_startup_profile",
                    "startup_id": str(profile.startup_id),
                    "error": str(e),
                },
            )
            return False

    def write_investor_profile(self, profile: InvestorProfile) -> bool:
        """
        Write investor profile and embedding to ClickHouse atomically.

        Args:
            profile: InvestorProfile with all fields including embedding

        Returns:
            True if write succeeded, False otherwise
        """
        try:
            client = self.connect()

            # Prepare data for insertion
            data = [
                [
                    str(profile.investor_id),
                    profile.call_id,
                    profile.investor_name,
                    profile.firm_name,
                    profile.criteria.stage_preferences,
                    profile.criteria.sector_focus,
                    float(profile.criteria.min_check_size),
                    float(profile.criteria.max_check_size),
                    profile.criteria.geography_preferences,
                    profile.criteria.geography_any,
                    profile.embedding,
                    profile.created_at,
                ]
            ]

            # Execute insert
            client.insert(
                "investors",
                data,
                column_names=[
                    "investor_id",
                    "call_id",
                    "investor_name",
                    "firm_name",
                    "stage_preferences",
                    "sector_focus",
                    "min_check_size",
                    "max_check_size",
                    "geography_preferences",
                    "geography_any",
                    "embedding",
                    "created_at",
                ],
            )

            logger.info(
                "Successfully wrote investor profile",
                extra={
                    "operation": "write_investor_profile",
                    "investor_id": str(profile.investor_id),
                    "investor_name": profile.investor_name,
                },
            )
            return True

        except Exception as e:
            logger.error(
                "Failed to write investor profile",
                extra={
                    "operation": "write_investor_profile",
                    "investor_id": str(profile.investor_id),
                    "error": str(e),
                },
            )
            return False

    def write_matches(self, matches: List[Match]) -> bool:
        """
        Write match results to ClickHouse.

        Args:
            matches: List of Match objects with justifications

        Returns:
            True if write succeeded, False otherwise
        """
        if not matches:
            logger.warning("No matches to write")
            return True

        try:
            client = self.connect()

            # Prepare data for insertion
            data = [
                [
                    str(match.match_id),
                    str(match.startup_id),
                    str(match.investor_id),
                    match.similarity_score,
                    match.justification_report,
                    match.stage_match,
                    match.sector_match,
                    match.check_size_match,
                    match.geography_match,
                    match.created_at,
                ]
                for match in matches
            ]

            # Execute insert
            client.insert(
                "matches",
                data,
                column_names=[
                    "match_id",
                    "startup_id",
                    "investor_id",
                    "similarity_score",
                    "justification_report",
                    "stage_match",
                    "sector_match",
                    "check_size_match",
                    "geography_match",
                    "created_at",
                ],
            )

            logger.info(
                "Successfully wrote matches",
                extra={
                    "operation": "write_matches",
                    "match_count": len(matches),
                    "startup_id": str(matches[0].startup_id),
                },
            )
            return True

        except Exception as e:
            logger.error(
                "Failed to write matches",
                extra={
                    "operation": "write_matches",
                    "match_count": len(matches),
                    "error": str(e),
                },
            )
            return False


# Global database client instance
db_client = ClickHouseClient()
