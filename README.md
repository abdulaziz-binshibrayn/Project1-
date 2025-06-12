# retrieve data from API revel system 
# consume Kafka to SQL Data Pipeline

This project demonstrates a simple data pipeline where data is consumed from a Kafka topic using Node.js and inserted into an MS SQL Server database using Sequelize ORM. The project is containerized with Docker.

---

## 📦 Technologies Used

- [Node.js](https://nodejs.org/)
- [KafkaJS](https://kafka.js.org/)
- [Sequelize ORM](https://sequelize.org/)
- [MSSQL Server](https://www.microsoft.com/en-us/sql-server/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Apache Kafka](https://kafka.apache.org/)
- [Axios] libarary used to get data from API revel system

---

## 📁 Project Structure
2 services ( reteival - insertion )

## ⚙️ Requirements

- Docker & Docker Compose installed
- Node.js v16+ (for local testing)
- A valid stored procedure in your MSSQL database
