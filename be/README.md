# LasalleVibers - Backend

Flask REST API backend with JWT authentication, Google OAuth, PostgreSQL database, and Cloudinary integration.

## Tech Stack

- **Flask** - Web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Flask-JWT-Extended** - JWT & Role-based authentication
- **Flask-Migrate** - Database migrations
- **Flask-Limiter** - API Rate limiting
- **Flask-Mail** - SMTP Email service (for verification & password reset)
- **Cloudinary** - Avatar image uploads
- **Marshmallow** - Request schema validation
- **Requests** - HTTP client (for Google OAuth token verification)

## Project Structure

```
be/
├── app/
│   ├── __init__.py          # Application factory
│   ├── api/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # Blueprint routes
│   │   └── services/        # Business logic
│   ├── config/              # Config classes
│   ├── database/
│   │   └── models/          # SQLAlchemy models
│   ├── lib/                 # External libraries
│   ├── middlewares/         # Middlewares
│   ├── schemas/             # Marshmallow schemas
│   └── utils/               # Utilities
├── docs/                    # Documentation
├── scripts/                 # Scripts
├── tests/                   # Tests
├── server.py                # Entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

### 1. Create Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy environment variables from `.env.example` to `.env`

```bash
cp .env.example .env
```

Edit environment variables in `.env` with the appropriate configuration

### 4. Setup Database

```bash
# Initialize migrations (first time only)
flask db init

# Create migration (first time only)
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

### 5. Run Server

```bash
python server.py # Development

gunicorn server:app --bind 0.0.0.0:5000 # Production
```

Server akan berjalan sesuai dengan host dan port yang ditentukan di `.env`

## API Documentation

Lihat dokumentasi lengkap di [docs/API.md](docs/API.md)

## Scripts

### Seed Database

```bash
python -m scripts.db.seed
```

Membuat sample users:

- admin@example.com (Admin)
- user@example.com (User)

Password: lihat di `scripts/db/seed.py`

### Create Admin

```bash
python -m scripts.db.create_admin
```

Interactive script untuk membuat admin user baru.

## Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/auth/test_auth.py -v
```
