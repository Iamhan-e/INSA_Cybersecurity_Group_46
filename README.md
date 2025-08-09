 Smart Campus Network Access Control (NAC) System

 Overview

This project implements a Network Access Control (NAC) system designed for university or corporate campus environments. The system authenticates and authorizes users and their devices before granting network access, improving overall security and management of the network.

The NAC system features:
- User authentication with role differentiation (student, staff, guest).
- IoT device fingerprinting to identify and classify connected devices.
- Dynamic network access policies based on user role, device type, and location.
- Real-time monitoring and alerting for unauthorized or suspicious activities.
- Optional integration of AI agents for anomaly detection and adaptive security.

---

 Features

- Role-Based Access Control (RBAC): Differentiate users by role to enforce tailored access rules.
- Device Fingerprinting: Identify device types through network metadata and behavior.
- Authentication Integration: Supports LDAP/Active Directory and other identity providers.
- Captive Portal / 802.1X Support: Enforce login before network access.
- Admin Dashboard: Monitor connected devices, users, and compliance status.
- Alerts & Automated Responses: Notify admins or quarantine suspicious devices.
- Modular Design: Easily extendable to add AI monitoring, location awareness, and more.


 How It Works

1. User Connects to Network:  
   Device associates with Wi-Fi or wired network but has limited access.

2. Login Prompt:  
   User is redirected to a captive portal or performs 802.1X authentication.

3. User Authentication & Role Lookup:  
   Credentials are verified against an identity provider, and the user's role (student, staff, guest) is retrieved.

4. Device Fingerprinting:  
   The system analyzes device metadata to classify its type and compliance.

5. Policy Enforcement:  
   Based on role and device type, the system assigns appropriate network access or restrictions.

6. Continuous Monitoring:  
   The system monitors device behavior and alerts or quarantines suspicious activity.


 Why Use This System?

- Prevents unauthorized network access even if passwords are leaked.
- Enforces role-based network policies tailored for different user groups.
- Improves visibility into all devices connected to the network.
- Supports BYOD and IoT device management securely.
- Enhances security posture with options for AI-based anomaly detection.


 Technology Stack

- Backend: Node.js / Python (Flask, FastAPI)
- Frontend: React / Vue.js for login and admin dashboard
- Database: MongoDB / PostgreSQL / SQLite
- Device Fingerprinting: Custom rules or ML with scikit-learn / TensorFlow
- Authentication: LDAP / OAuth / Active Directory integration
- Network Simulation: GNS3, Cisco Packet Tracer (for testing)
- AI Monitoring (Optional): Python ML libraries



 Getting Started

 Prerequisites

- Node.js / Python installed
- Database system installed and configured
- Optional: Network simulation environment for testing

 Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/smart-campus-nac.git
cd smart-campus-nac

