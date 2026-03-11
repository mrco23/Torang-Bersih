"""
Database reset script.
Drops all tables (including alembic_version), recreates them via migrations, and optionally seeds data.

Usage:
    python -m scripts.db.reset_db           # reset saja
    python -m scripts.db.reset_db --seed    # reset + seed data
"""
import sys
import os
import subprocess

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app import create_app
from app.config.extensions import db
from sqlalchemy import text


def reset_db(seed_after=False):
    app = create_app()

    with app.app_context():
        print("=" * 40)
        print("Database Reset")
        print("=" * 40)

        # Konfirmasi
        confirm = input("Semua data akan dihapus. Lanjutkan? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("Dibatalkan.")
            return False

        # Hapus semua tabel
        print("\nMenghapus semua tabel...")
        db.drop_all()
        print("Semua tabel aplikasi berhasil dihapus.")

        # Hapus tabel alembic_version agar migration bisa jalan dari awal
        print("Menghapus alembic_version...")
        db.session.execute(text("DROP TABLE IF EXISTS alembic_version"))
        db.session.commit()
        print("alembic_version berhasil dihapus.")

        print("=" * 40)
        print("Reset selesai!")
        print("=" * 40)



    # Seed data (opsional)
    if seed_after:
        print("\nMenjalankan seeder...")
        print("-" * 40)
        with app.app_context():
            from scripts.db.seed import seed_users
            seed_users()
        print("-" * 40)
        print("Seeder selesai.")

    print("\n" + "=" * 40)
    print("Setup selesai! Database siap digunakan.")
    print("Silahkan migrasi atau upgrade database")
    print("=" * 40)
    return True


if __name__ == "__main__":
    seed = "--seed" in sys.argv
    success = reset_db(seed_after=seed)
    sys.exit(0 if success else 1)