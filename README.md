# Order Data Pipeline

A containerized data pipeline built with **NestJS**, **Kafka**, **MongoDB**, and **Elasticsearch**.

The project extracts order data from an external API, sends it through Kafka, stores it in MongoDB, and indexes it in Elasticsearch for fast search.

---

## Project Flow

```text
External API / Revel API
        ↓
Data Retrieval Service
        ↓
Kafka Topic
        ↓
Data Insertion Service
        ↓
MongoDB + Elasticsearch

Features
Fetches order data from an external API.
Sends data to Kafka as messages.
Consumes Kafka messages in a separate service.
Inserts or updates orders in MongoDB.
Indexes orders in Elasticsearch.
Runs all services using Docker Compose.
Uses .env for configuration and secrets.
Tech Stack
NestJS
TypeScript
Kafka
KafkaJS
MongoDB
Mongoose
Elasticsearch
Docker
Docker Compose
Zookeeper
Project Structure
src
├── data-retrieval
│   ├── data-retrieval.controller.ts
│   ├── data-retrieval.module.ts
│   ├── data-retrieval.service.ts
│   └── Dockerfile
│
├── data-insertion
│   ├── db
│   │   ├── schemas
│   │   │   └── order.schema.ts
│   │   └── db.service.ts
│   ├── data-insertion.module.ts
│   ├── data-insertion.service.ts
│   └── Dockerfile
│
├── kafka
│   ├── kafka.module.ts
│   └── kafka.service.ts
│
├── shared
│   ├── elasticsearch.module.ts
│   ├── elasticsearch.service.ts
│   └── error-message.util.ts
│
├── app.module.ts
└── main.ts
Environment Variables

Create a .env file in the root directory:

MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_DATABASE=orders
MONGO_URI=mongodb://root:example@mongo:27017/orders?authSource=admin

KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=data_pipeline_topic

API_URL=https://example.com/resources/Order/
API_KEY=your_api_key_here

ELASTICSEARCH_URL=http://elasticsearch:9200

Do not commit .env to GitHub. Use .env.example instead.

Run the Project
docker compose up --build -d

Check running containers:

docker compose ps
Trigger the Pipeline
curl -X POST http://localhost:3000/

Expected response:

success
Verify Logs

Data retrieval service:

docker logs data-retrieval --tail=100

Data insertion service:

docker logs data-insertion --tail=100
Verify MongoDB
docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin

Then run:

use orders
db.orders.countDocuments()
db.orders.find().limit(5).pretty()
Verify Elasticsearch
curl http://localhost:9200/_cat/indices?v

Search orders:

curl "http://localhost:9200/orders/_search?pretty&size=5"
Pipeline Type

This project is an EL pipeline:

Extract → Load

It extracts data from an external API and loads it into MongoDB and Elasticsearch, with light validation and formatting before storage.

Author

Developed by Abdulaziz Bin Shibrayn.