"""Structured JSON logging configuration."""

import logging
import sys
from datetime import datetime

from pythonjsonlogger import jsonlogger

from app.config import settings


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with ISO 8601 timestamps."""

    def add_fields(self, log_record, record, message_dict):
        """Add custom fields to log records."""
        super().add_fields(log_record, record, message_dict)
        
        # Add ISO 8601 timestamp
        log_record["timestamp"] = datetime.utcnow().isoformat() + "Z"
        
        # Add log level
        log_record["level"] = record.levelname
        
        # Add component (logger name)
        log_record["component"] = record.name


def setup_logging():
    """Configure structured JSON logging for the application."""
    
    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    
    # Set formatter
    formatter = CustomJsonFormatter(
        "%(timestamp)s %(level)s %(component)s %(message)s"
    )
    handler.setFormatter(formatter)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(getattr(logging, settings.log_level.upper()))
    
    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    
    return root_logger


# Initialize logger
logger = setup_logging()
