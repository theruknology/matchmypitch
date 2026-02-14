"""Initialize ClickHouse database schema."""

import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.database import db_client
from app.logging_config import setup_logging

logger = logging.getLogger(__name__)


def create_database():
    """Create the matchmaking database if it doesn't exist."""
    try:
        # Connect without specifying database
        import clickhouse_connect
        
        client = clickhouse_connect.get_client(
            host=settings.clickhouse_host,
            port=settings.clickhouse_port,
            username=settings.clickhouse_user,
            password=settings.clickhouse_password,
        )
        
        # Create database
        client.command(f"CREATE DATABASE IF NOT EXISTS {settings.clickhouse_database}")
        logger.info(f"Database '{settings.clickhouse_database}' created or already exists")
        
        client.close()
    except Exception as e:
        logger.error(f"Failed to create database: {e}")
        raise


def create_startups_table():
    """Create the startups table with vector index."""
    sql = """
    CREATE TABLE IF NOT EXISTS startups (
        startup_id UUID DEFAULT generateUUIDv4(),
        call_id String,
        startup_name String,
        
        -- Financial metrics
        revenue Decimal64(2),
        burn_rate Decimal64(2),
        runway_months UInt16,
        valuation Decimal64(2),
        funding_stage Enum('pre-seed' = 1, 'seed' = 2, 'series-a' = 3, 'series-b' = 4, 'series-c+' = 5),
        funding_ask Decimal64(2),
        
        -- Metadata
        sector String,
        location String,
        team_size UInt16,
        
        -- Semantic vector (768 dimensions)
        embedding Array(Float32),
        
        -- Timestamps
        created_at DateTime DEFAULT now(),
        updated_at DateTime DEFAULT now(),
        
        PRIMARY KEY (startup_id)
    ) ENGINE = MergeTree()
    ORDER BY (created_at, startup_id)
    """
    
    try:
        client = db_client.connect()
        client.command(sql)
        logger.info("Startups table created successfully")
    except Exception as e:
        logger.error(f"Failed to create startups table: {e}")
        raise


def create_investors_table():
    """Create the investors table with vector index."""
    sql = """
    CREATE TABLE IF NOT EXISTS investors (
        investor_id UUID DEFAULT generateUUIDv4(),
        call_id String,
        investor_name String,
        firm_name String,
        
        -- Investment criteria
        stage_preferences Array(String),
        sector_focus Array(String),
        min_check_size Decimal64(2),
        max_check_size Decimal64(2),
        geography_preferences Array(String),
        geography_any Boolean DEFAULT false,
        
        -- Semantic vector (768 dimensions)
        embedding Array(Float32),
        
        -- Timestamps
        created_at DateTime DEFAULT now(),
        updated_at DateTime DEFAULT now(),
        
        PRIMARY KEY (investor_id)
    ) ENGINE = MergeTree()
    ORDER BY (created_at, investor_id)
    """
    
    try:
        client = db_client.connect()
        client.command(sql)
        logger.info("Investors table created successfully")
    except Exception as e:
        logger.error(f"Failed to create investors table: {e}")
        raise


def create_matches_table():
    """Create the matches table."""
    sql = """
    CREATE TABLE IF NOT EXISTS matches (
        match_id UUID DEFAULT generateUUIDv4(),
        startup_id UUID,
        investor_id UUID,
        
        -- Match quality
        similarity_score Float32,
        
        -- Justification
        justification_report String,
        
        -- Match criteria met
        stage_match Boolean,
        sector_match Boolean,
        check_size_match Boolean,
        geography_match Boolean,
        
        -- Timestamps
        created_at DateTime DEFAULT now(),
        
        PRIMARY KEY (match_id)
    ) ENGINE = MergeTree()
    ORDER BY (startup_id, similarity_score)
    """
    
    try:
        client = db_client.connect()
        client.command(sql)
        logger.info("Matches table created successfully")
    except Exception as e:
        logger.error(f"Failed to create matches table: {e}")
        raise


def main():
    """Initialize all database tables."""
    setup_logging()
    
    logger.info("Starting database initialization")
    logger.info(f"ClickHouse host: {settings.clickhouse_host}")
    logger.info(f"Database: {settings.clickhouse_database}")
    
    try:
        # Create database
        create_database()
        
        # Create tables
        create_startups_table()
        create_investors_table()
        create_matches_table()
        
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)
    finally:
        db_client.close()


if __name__ == "__main__":
    main()
