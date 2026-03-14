# Torang Bersih

**Bridging Gaps for Smart & Just Waste Management**

[![PROXOCORIS 2026](https://img.shields.io/badge/PROXOCORIS-2026-blue)](https://proxocoris.com)
[![Web Development](https://img.shields.io/badge/Category-Web_Development-green)](https://proxocoris.com)
[![React](https://img.shields.io/badge/Frontend-React.js-61dafb)](https://reactjs.org)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000)](https://flask.palletsprojects.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)](https://postgresql.org)

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Team](#team)
- [Competition](#competition)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About

**Torang Bersih** is a hyperlocal waste management web platform designed specifically for Manado, North Sulawesi, Indonesia. The platform addresses environmental justice issues by bridging the gap between citizens, waste management collaborators, and local government through digital innovation.

### Problem Statement

Manado City produces approximately 650 tons of waste daily, putting significant pressure on the Sumompo Final Disposal Site (TPA). Current waste management faces challenges including:

- Unequal access to sanitation services across different neighborhoods
- Limited public participation in waste reporting and management
- Lack of real-time data for evidence-based policy making
- Insufficient circular economy infrastructure at the community level

### Solution

Torang Bersih provides a comprehensive digital ecosystem that:

- Maps the entire waste management ecosystem in real-time
- Enables citizens to report illegal dumping with transparent tracking
- Connects waste generators directly with recyclers and waste banks
- Promotes circular economy practices at the grassroots level

## Key Features

### 1. Super Map (Interactive Dashboard)

A unified spatial dashboard displaying four dynamic layers:

- **Blue Markers**: Verified collaborators (waste banks, collectors, environmental communities)
- **Green Markers**: Waste management facilities (TPS, composting sites, drop-off points)
- **Red Markers**: Active illegal waste reports with status tracking
- **Yellow Markers**: Recyclable items available in the marketplace

### 2. Illegal Waste Reporting

Three-step reporting system with full transparency:

- Photo evidence upload with automatic GPS coordinates
- Real-time status tracking (Pending -> Accepted -> In Progress -> Completed)
- Before-after documentation of cleanup actions
- Automated email notifications at each status change

### 3. Recycling Marketplace (Lapak Daur Ulang)

Community-driven circular economy platform:

- Citizens can sell or donate recyclable materials
- Spatial integration shows item locations on the main map
- Direct connection between sellers and verified buyers
- Automatic status management (available/sold)

### 4. Digital Literacy Center

Educational content management system:

- Articles on waste management best practices
- 3R (Reduce, Reuse, Recycle) guidelines
- Community-driven content with two-way commenting system
- Bento Grid layout for organized information display

## Technology Stack

### Frontend

- **React.js** - Component-based user interface library
- **React Router** - Client-side routing
- **Leaflet/Google Maps API** - Interactive mapping
- **Axios** - HTTP client for API requests
- **CSS3/Tailwind** - Responsive styling

### Backend

- **Flask** - Lightweight Python web framework
- **Flask-RESTful** - RESTful API development
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-Mail** - Email notification system
- **Flask-CORS** - Cross-Origin Resource Sharing

### Database

- **PostgreSQL** - Relational database management
- **PostGIS** - Geographic information system extension for spatial queries

### Additional Services

- **Google Maps Platform API** - Map rendering and geocoding
- **Reverse Geocoding API** - Coordinate-to-address conversion
- **SMTP Server** - Email delivery service

## System Architecture
