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
```

---

## Features

- Fetches order data from an external API.
- Sends data to Kafka as messages.
- Consumes Kafka messages in a separate service.
- Inserts or updates orders in MongoDB.
- Indexes orders in Elasticsearch.
- Runs all services using Docker Compose.
- Uses `.env` for configuration and secrets.

---

## Tools & Technologies

| Tool | Purpose |
|---|---|
| **NestJS** | Backend framework used to build the services |
| **TypeScript** | Main programming language |
| **Axios** | Used to fetch data from the external API |
| **Kafka** | Message broker used to stream data between services |
| **KafkaJS** | Node.js client for Kafka |
| **MongoDB** | Database used to store order data |
| **Mongoose** | ODM used to work with MongoDB in NestJS |
| **Elasticsearch** | Used to index and search order data |
| **Docker** | Used to containerize the services |
| **Docker Compose** | Used to run all services together |
| **Zookeeper** | Used by Kafka for coordination |

---

## Project Structure

```text
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
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_USERNAME=root
MONGO_PASSWORD=example
MONGO_DATABASE=orders
MONGO_URI=mongodb://root:example@mongo:27017/orders?authSource=admin

KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=data_pipeline_topic

API_URL=https://example.com/resources/Order/
API_KEY=your_api_key_here

ELASTICSEARCH_URL=http://elasticsearch:9200
```

> Do not commit `.env` to GitHub. Use `.env.example` instead.

---

## Run the Project

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

---

## Trigger the Pipeline

```bash
curl -X POST http://localhost:3000/
```

Expected response:

```text
success
```

---

## Verify Logs

Data retrieval service:

```bash
docker logs data-retrieval --tail=100
```

Data insertion service:

```bash
docker logs data-insertion --tail=100
```

---

## Verify MongoDB

```bash
docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin
```

Then run:

```js
use orders
db.orders.countDocuments()
db.orders.find().limit(5).pretty()
```

---

## Verify Elasticsearch

List indices:

```bash
curl http://localhost:9200/_cat/indices?v
```

Search orders:

```bash
curl "http://localhost:9200/orders/_search?pretty&size=5"
```

---

## Pipeline Type

This project is an **EL Pipeline**:

```text
Extract → Load
```

It extracts data from an external API and loads it into **MongoDB** and **Elasticsearch**, with light validation and formatting before storage.

---

## Author

Developed by **Abdulaziz Bin Shibrayn**.