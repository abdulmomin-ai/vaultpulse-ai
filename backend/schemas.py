from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WorkspaceBase(BaseModel):
    name: str

class WorkspaceCreate(WorkspaceBase):
    pass

class Workspace(WorkspaceBase):
    id: int
    class Config:
        from_attributes = True

class ApiKeyBase(BaseModel):
    name: str
    provider: str
    masked_key: str
    quota: float
    is_active: bool = True

class ApiKeyCreate(ApiKeyBase):
    workspace_id: int

class ApiKey(ApiKeyBase):
    id: int
    workspace_id: int
    usage: float = 0.0
    class Config:
        from_attributes = True

class UsageLogBase(BaseModel):
    api_key_id: int
    tokens: int
    cost: float
    model: str

class UsageLog(UsageLogBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class BudgetAlertBase(BaseModel):
    workspace_id: int
    threshold_amount: float
    alert_email: str
    is_active: bool = True

class BudgetAlert(BudgetAlertBase):
    id: int
    class Config:
        from_attributes = True
