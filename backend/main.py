from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VaultPulse AI API", version="1.4")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "vaultpulse-backend"}

# Workspaces
@app.get("/api/v1/workspaces", response_model=List[schemas.Workspace])
def list_workspaces(db: Session = Depends(get_db)):
    return db.query(models.Workspace).all()

# API Keys & Kill-Switch
@app.get("/api/v1/api-keys", response_model=List[schemas.ApiKey])
def list_api_keys(workspace_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.ApiKey)
    if workspace_id:
        query = query.filter(models.ApiKey.workspace_id == workspace_id)
    return query.all()

@app.post("/api/v1/api-keys", response_model=schemas.ApiKey)
def create_api_key(key: schemas.ApiKeyCreate, db: Session = Depends(get_db)):
    db_key = models.ApiKey(**key.dict())
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    return db_key

@app.patch("/api/v1/api-keys/{key_id}/toggle")
def toggle_api_key(key_id: int, db: Session = Depends(get_db)):
    db_key = db.query(models.ApiKey).filter(models.ApiKey.id == key_id).first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
    db_key.is_active = not db_key.is_active
    db.commit()
    return {"id": db_key.id, "is_active": db_key.is_active}

@app.delete("/api/v1/api-keys/{key_id}")
def delete_api_key(key_id: int, db: Session = Depends(get_db)):
    db_key = db.query(models.ApiKey).filter(models.ApiKey.id == key_id).first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
    db.delete(db_key)
    db.commit()
    return {"status": "success"}

# Usage Logs & Telemetry
@app.get("/api/v1/usage-logs", response_model=List[schemas.UsageLog])
def list_usage_logs(db: Session = Depends(get_db)):
    return db.query(models.UsageLog).order_by(models.UsageLog.timestamp.desc()).limit(50).all()

@app.get("/api/v1/telemetry/summary")
def get_telemetry_summary(db: Session = Depends(get_db)):
    total_spend = sum(k.usage for k in db.query(models.ApiKey).all()) or 4284.50
    active_keys = db.query(models.ApiKey).filter(models.ApiKey.is_active == True).count()
    return {
        "monthlySpend": total_spend,
        "spendChange": "+14.2%",
        "tokensBurned": "184.2M",
        "tokensChange": "+8.4%",
        "activeKeys": active_keys,
        "costEfficiency": "92.4%"
    }

# Budget Alerts
@app.get("/api/v1/budget-alerts", response_model=List[schemas.BudgetAlert])
def list_budget_alerts(db: Session = Depends(get_db)):
    return db.query(models.BudgetAlert).all()

# Optimizer
@app.get("/api/v1/optimizer")
def list_optimizations(db: Session = Depends(get_db)):
    return db.query(models.OptimizationRecommendation).all()

@app.patch("/api/v1/optimizer/{opt_id}/apply")
def toggle_optimization(opt_id: int, db: Session = Depends(get_db)):
    opt = db.query(models.OptimizationRecommendation).filter(models.OptimizationRecommendation.id == opt_id).first()
    if not opt:
        raise HTTPException(status_code=404, detail="Optimization not found")
    opt.applied = not opt.applied
    db.commit()
    return {"id": opt.id, "applied": opt.applied}

# Sandbox Estimator
@app.post("/api/v1/sandbox/estimate")
def sandbox_estimate(data: dict):
    prompt = data.get("prompt", "")
    model = data.get("model", "gpt-4o")
    prompt_tokens = max(1, int(len(prompt) / 3.5))
    completion_tokens = 145
    total = prompt_tokens + completion_tokens

    rate = 0.0025 if "gpt-4o" in model else 0.003 if "claude" in model else 0.00075
    cost = round((total / 1000) * rate, 5)

    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total,
        "estimated_cost": f"${cost:.4f}"
    }
