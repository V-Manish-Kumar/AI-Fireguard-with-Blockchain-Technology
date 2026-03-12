AI FireGuard 🔐
Intelligent Firewall System with Blockchain Technology
AI FireGuard is an AI-powered intelligent firewall system that detects cyber-attacks, dynamically adjusts firewall protection, and securely records attack events on the blockchain.
The project combines Machine Learning, Cybersecurity concepts, and Blockchain technology to create a secure and transparent firewall monitoring system.
---
📌 Project Overview
In modern systems, cyber attacks such as SQL Injection, DDoS, and XSS can compromise databases and applications.
Traditional firewalls often follow static rules, which makes them less adaptive to evolving threats.
AI FireGuard introduces an intelligent firewall mechanism that:
Detects attack types
Predicts attack severity using Machine Learning
Dynamically reduces firewall health
Allows manual firewall reinforcement
Stores security logs securely on blockchain
The system also provides a real-time dashboard to visualize system status and attack activity.

---
🎯 Key Features
🤖 AI-Based Attack Detection
Uses a Machine Learning model (Decision Tree Classifier) to classify attack severity.
🔥 Dynamic Firewall Protection
Firewall health automatically adjusts depending on attack severity.
📊 Real-Time Security Dashboard
Displays:
Firewall health
Attack activity
Database status
Blockchain transaction links
⛓ Blockchain-Based Logging
Attack events are stored on Ethereum Sepolia Testnet using a smart contract.
🔐 Tamper-Proof Security Logs
Blockchain ensures logs cannot be modified or deleted.
📜 Attack History Tracking
All attacks are stored and can be viewed in the dashboard.
🏗 System Architecture

---

The project follows a three-layer architecture:
1️⃣ Frontend Layer
Provides a visual dashboard for monitoring system status.
2️⃣ Backend + AI Layer
Handles attack detection, machine learning predictions, and firewall logic.
3️⃣ Blockchain Layer
Stores attack logs securely using Ethereum smart contracts.
---

🧠 Role of Artificial Intelligence
Artificial Intelligence is used to make the firewall adaptive and intelligent.
Instead of static responses, the system uses a Machine Learning model to:
Analyze the attack type
Predict the severity level
Adjust firewall protection accordingly
Example:
Attack Type
Predicted Severity
Firewall Damage
SQL Injection
High
-20%
DDoS
Medium
-10%
XSS
Low
-5%
This makes the firewall more realistic and intelligent.
---
⛓ Blockchain Integration
Blockchain ensures secure and immutable logging of security events.
Whenever an attack occurs or the firewall is reinforced:
Event data is hashed using SHA-256
Hash is sent to the smart contract
Transaction is recorded on Ethereum Sepolia Testnet
Each event generates a transaction hash which can be verified on Etherscan.
Benefits:
Tamper-proof records
Transparent security auditing
Decentralized trust
⚙ Tech Stack
Frontend
React
Vite
Tailwind CSS
Backend
Python
Flask
REST APIs
Machine Learning
Scikit-learn
Decision Tree Classifier
LabelEncoder
Blockchain
Ethereum Sepolia Testnet
Solidity Smart Contract
Web3.py
MetaMask
Infura
Database
SQLite

---
📂 Project Structure
Copy code

ai-fireguard-blockchain
│
├── backend
│   ├── app.py
│   ├── database.py
│
├── frontend
│   ├── src
│   ├── package.json
│
├── blockchain
│   ├── FirewallLogs.sol
│   ├── FirewallLogsABI.json
│
├── ml
│   ├── train_model.py
│   ├── attack_data.csv
│
├── README.md
└── requirements.tx

---
▶ How to Run the Project
1️⃣ Clone the Repository
Copy code

git clone https://github.com/yourusername/ai-fireguard-blockchain.git
2️⃣ Install Backend Dependencies
Copy code

pip install -r requirements.txt
3️⃣ Run Backend Server
Copy code

python backend/app.py
Server will run at:
Copy code

http://127.0.0.1:5000
4️⃣ Run Frontend
Copy code

cd frontend
npm install
npm run dev
Open:
Copy code

http://localhost:5173
---
🧪 Demo Workflow
Open dashboard
Click Start Attack
AI predicts attack severity
Firewall health decreases
Attack stored in database
Event logged on blockchain
Transaction visible on Etherscan
🔮 Future Improvements
Real-time multi-device attack simulation
Deep learning based intrusion detection
Integration with enterprise security systems
Live network traffic monitoring
Cloud deployment
👨‍💻 Authors
B.Tech Mini Project
Prudviraj
Team Members
📜 License
This project is developed for academic and educational purposes.
⭐ If you like this project
Give a ⭐ on GitHub

