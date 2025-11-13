# **Project Overview & Vision**

## **Overview**

**Campus Connect** is a comprehensive college event management platform designed to streamline how **students**,and **admins**, manage and participate in campus activities.

The platform serves as a **digital bridge between event organizers and participants**, providing real-time updates, structured event data, and a seamless user experience for both managing and attending campus events.

Our core vision is to create a **centralized, and transparent** that reduces manual effort, avoids scheduling conflicts, and enhances student engagement.

---

## **Target Audience**

The platform caters to three distinct user roles:

- **Students** – Can sign up, log in, view all events, register or unregister for events, and track available seats in real-time.
- **Admins** – Created by Super Admins, they can log in to manage events (create, delete, and monitor student registrations).
- **Super Admins** – Oversee the system and create Admin accounts .

---

## **Core Functionalities**

### **Student Features**

- Self-registration and login flow.
- Dashboard displaying:
  - **Upcoming & past events.**
  - **Events already registered for.**
  - **Available seats** for each event in real time.
- **Register / Unregister** for events.
- **Validation:** Students cannot register for past events.

---

### **Admin Features**

- Login using credentials shared via email by the Super Admin.
- Dashboard to:
  - View all existing events.
  - Manage (create/delete) events they have created.
  - View **students registered for each event**.
- **Event Creation Validations:**
  - No two events can occur at the same **date, time, and location**.
  - Admin specifies **seat capacity**, which decreases dynamically as students register.
- Deleting an event automatically removes all student registrations for that event.

---

### **Super Admin Features**

- Create Admin accounts and assign login credentials.

---

## **Frontend Tech Stack **

The **Campus Connect frontend** is built with a **modern, scalable, and performance-optimized tech stack**, ensuring fast rendering and a responsive user interface.

| **Category**       | **Technology** |
| ------------------ | -------------- |
| Frontend Framework | ReactJS        |
| Build Tool         | Vite           |
| Styling Framework  | Tailwind CSS   |

---

## **Frontend Setup & Installation**

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/campus-connect-frontend.git
cd campus-connect-frontend

```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm run dev
```
