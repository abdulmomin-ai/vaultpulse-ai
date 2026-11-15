from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    api_keys = relationship("ApiKey", back_populates="workspace")
    alerts = relationship("BudgetAlert", back_populates="workspace")

class ApiKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    name = Column(String)
    provider = Column(String)
    masked_key = Column(String)
    quota = Column(Float, default=1000.0)
    usage = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)

    workspace = relationship("Workspace", back_populates="api_keys")
    usage_logs = relationship("UsageLog", back_populates="api_key")

class UsageLog(Base):
    __tablename__ = "usage_logs"
    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"))
    model = Column(String)
    tokens = Column(Integer)
    cost = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    api_key = relationship("ApiKey", back_populates="usage_logs")

class BudgetAlert(Base):
    __tablename__ = "budget_alerts"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    threshold_amount = Column(Float)
    alert_email = Column(String)
    is_active = Column(Boolean, default=True)

    workspace = relationship("Workspace", back_populates="alerts")

class OptimizationRecommendation(Base):
    __tablename__ = "optimizations"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    savings = Column(String)
    impact = Column(String)
    applied = Column(Boolean, default=False)
