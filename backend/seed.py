from database import SessionLocal
import models

def seed_database():
    db = SessionLocal()

    if db.query(models.Workspace).first():
        print("Database already seeded.")
        return

    # Workspaces
    ws1 = models.Workspace(name="Production (US-East)")
    ws2 = models.Workspace(name="Staging & QA")
    db.add_all([ws1, ws2])
    db.commit()
    db.refresh(ws1)
    db.refresh(ws2)

    # API Keys
    keys = [
        models.ApiKey(workspace_id=ws1.id, name="Production API Key - OpenAI GPT-4o", provider="OpenAI", masked_key="sk-proj-••••••••9482", quota=2000.0, usage=1420.50, is_active=True),
        models.ApiKey(workspace_id=ws1.id, name="Claude 3.5 Sonnet - Backend Service", provider="Anthropic", masked_key="sk-ant-••••••••1109", quota=1500.0, usage=1850.00, is_active=True),
        models.ApiKey(workspace_id=ws1.id, name="Gemini 1.5 Flash - Document Parsing", provider="Google", masked_key="AIzaSy••••••••8841", quota=1000.0, usage=320.40, is_active=True),
        models.ApiKey(workspace_id=ws2.id, name="Legacy QA Embeddings Key", provider="OpenAI", masked_key="sk-proj-••••••••3310", quota=500.0, usage=694.00, is_active=False),
    ]
    db.add_all(keys)
    db.commit()

    # Optimizations
    opts = [
        models.OptimizationRecommendation(title="Route simple summarization to Gemini Flash", description="Redirect 65% of summarization requests from GPT-4o to Gemini 1.5 Flash without quality degradation.", savings="$1,240 /mo", impact="High", applied=False),
        models.OptimizationRecommendation(title="Enable semantic caching for repeated prompts", description="Cache frequent knowledge base queries in Redis with 0.85 similarity threshold.", savings="$850 /mo", impact="Medium", applied=True),
        models.OptimizationRecommendation(title="Downgrade embedding model from ada-002 to 3-small", description="Switch vector embedding pipeline to text-embedding-3-small for 5x lower per-token cost.", savings="$310 /mo", impact="Low", applied=False),
    ]
    db.add_all(opts)
    db.commit()

    # Budget Alerts
    alerts = [
        models.BudgetAlert(workspace_id=ws1.id, threshold_amount=2000.0, alert_email="cto@vaultpulse.ai", is_active=True)
    ]
    db.add_all(alerts)
    db.commit()

    print("Successfully seeded PostgreSQL database.")

if __name__ == "__main__":
    seed_database()
