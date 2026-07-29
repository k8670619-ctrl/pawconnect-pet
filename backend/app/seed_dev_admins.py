import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.models.models import User
from app.core.security import get_password_hash

logger = logging.getLogger("pawconnect.seeder")
logging.basicConfig(level=logging.INFO)

DEFAULT_ACCOUNTS = [
    {
        "email": "admin@pawconnect.ai",
        "password": "Admin@123456",
        "full_name": "Default Super Admin",
        "role": "super_admin",
        "username": "superadmin",
        "phone": "+919999900001",
    },
    {
        "email": "support@pawconnect.ai",
        "password": "Admin@123456",
        "full_name": "Default Admin",
        "role": "admin",
        "username": "supportadmin",
        "phone": "+919999900002",
    },
]

def seed_default_admins(db: Session) -> None:
    """
    Seeds default development admin accounts automatically if they do not exist.
    THIS FUNCTION EXECUTES ONLY IN DEVELOPMENT / TESTING MODES AND NEVER IN PRODUCTION.
    """
    env = settings.ENVIRONMENT.lower()
    if env == "production" or env == "prod":
        logger.info("🛡️ Production environment detected. Default admin seeding skipped.")
        return

    logger.info("🔧 Development environment detected (%s). Checking default admin accounts...", env)

    for acc in DEFAULT_ACCOUNTS:
        existing = db.query(User).filter(User.email == acc["email"]).first()
        if not existing:
            hashed_pwd = get_password_hash(acc["password"])
            admin_user = User(
                full_name=acc["full_name"],
                username=acc["username"],
                email=acc["email"],
                phone=acc["phone"],
                hashed_password=hashed_pwd,
                role=acc["role"],
                is_active=True,
                is_email_verified=True,
                is_phone_verified=True,
                is_identity_verified=True,
                verification_status="verified",
                trust_score=100.0,
                verified_badge="verified" if acc["role"] == "admin" else "super_admin"
            )
            db.add(admin_user)
            db.commit()
            logger.info("🔑 [DEV SEED] Created %s (%s) with password 'Admin@123456'", acc["role"].upper(), acc["email"])
        else:
            logger.info("✅ Account already exists: %s (%s)", acc["email"], existing.role)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_default_admins(session)
        print("\n" + "=" * 60)
        print(" Development Admin Seeding Complete!")
        print(" Super Admin : admin@pawconnect.ai / Admin@123456")
        print(" Admin       : support@pawconnect.ai / Admin@123456")
        print("=" * 60 + "\n")
    finally:
        session.close()
