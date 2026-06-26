# 📋 Task Management Application

A modern, full-stack Task Management platform built with a Node.js/Express backend and an Angular frontend. This project features a robust relational database schema and background job processing for asynchronous tasks like email notifications.

## 🚀 Tech Stack

**Frontend:**
* Angular (TypeScript)
* RxJS / HttpClient

**Backend:**
* Node.js & Express (TypeScript)
* Sequelize ORM
* MySQL (Native Local Installation)

**Background Processing:**
* BullMQ
* Redis (Native Local Installation)

---

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed natively on your local machine:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MySQL](https://dev.mysql.com/downloads/installer/) (Running on default port `3306`)
* [Redis](https://redis.io/docs/getting-started/) (Running on default port `6379`)
* [Angular CLI](https://angular.io/cli) (installed globally via `npm install -g @angular/cli`)

---

## 🛠️ Backend Setup

### 1. Install Dependencies
Navigate to your backend directory and install the required npm packages:
```bash
cd server
npm install
