"""
Database reset script.
Drops all tables, recreates them, and optionally seeds data.
Run with: python -m scripts.db.reset_db
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app import create_app
from app.config.extensions import db


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

        print("\nMenghapus semua tabel...")
        db.drop_all()
        print("Semua tabel berhasil dihapus.")

        # print("Membuat ulang tabel...")
        # db.create_all()
        # print("Semua tabel berhasil dibuat.")

        if seed_after:
            print("\nMenjalankan seeder...")
            print("-" * 40)
            from scripts.db.seed import seed_users
            seed_users()

        print("=" * 40)
        print("Reset selesai!")
        print("=" * 40)
        return True


if __name__ == "__main__":
    # Cek argumen: python -m scripts.db.reset_db --seed
    seed = "--seed" in sys.argv
    success = reset_db(seed_after=seed)
    sys.exit(0 if success else 1)