# 🌍 Explorify

**Explorify** is a modern travel-sharing platform designed to bring together adventurers, wanderers, and explorers from around the world. Whether you've just uncovered a hidden gem in your hometown or journeyed across continents, Explorify lets you document and share those experiences with a global community.  

Users can upload captivating photos, write meaningful reviews, and categorize their discoveries by country, theme, and tags. With powerful search and filter tools, it's easy to find the next destination on your bucket list — be it ancient ruins, local food spots, serene hot springs, or bustling cities.  

Built with a scalable clean architecture, Explorify ensures a seamless experience on both the frontend and backend. Real-time notifications, a points and badge system, and a social following feature help foster interaction and community engagement. Whether you're a traveler, a storyteller, or someone who just loves discovering new places, **Explorify is your space to explore, share, and connect**.

---

## 🚀 Features

- 🗺️ Upload and share places with descriptions, categories, and photos
- 🌟 Add and edit reviews with star ratings
- 🔍 Search places by category, country, tags, and more
- 🛡️ Admin approval system for places and reviews
- 🧩 Points & badge system to gamify exploration
- 👥 Follow other users and get notified when they share new places
- 🧭 UI with Ant Design and Framer Motion

---


## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- JavaScript
- Ant Design
- Framer Motion
- Leaflet.js
- Slugify
- Use-Debounce
- Sweetalert2
- @microsoft/signalr

**Backend:**
- ASP.NET Core Web API
- Entity Framework Core
- Dapper (for optimized queries)
- SignalR (for real-time notifications)
- ImageSharp (for processing uploaded images)
- Quartz.NET
- SendGrid
- Slugify
- xUnit

**Database:**
- MS SQL Server

**Cloud**
- Azure Application Insights
- Azure SQL Server + Azure SQL Database
- Azure Blob Storage (for image & badge uploads)

---

## 🌐 External APIs

- **[WeatherAPI](https://www.weatherapi.com/):**  
  Used to fetch real-time weather data for the locations users explore and upload. This adds an extra layer of context and engagement to each shared place.

- **[Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview):**  
  Converts user-entered addresses into accurate geographic coordinates (latitude and longitude) using a custom `GeocodingService`. This enables precise map visualization and location-based features within the platform.

## 👤 User Roles & Permissions

Explorify supports two primary user roles, each with distinct responsibilities and access levels:

### 🧑‍💻 Regular User

Regular users are the core of the Explorify community. They can:

- Upload new places with descriptions, categories, and up to 10 images
- Write reviews and rate places
- Edit or delete their own places and reviews (before approval)
- Search and explore places by category, country, and tags
- Earn points and unlock badges based on their activity
- Follow other users and view their uploads
- Receive real-time notifications for approvals, followers, and messages

### 🛡️ Administrator

Administrators ensure content quality and platform moderation. They have access to:

- Approve or reject places and reviews submitted by users
- View recently deleted content
- Promote users to admin role
- View platform-wide statistics (user count, approval queues, etc.)
- Manage user roles and permissions
- Monitor application performance via Azure Application Insights

## 📊 Points & Badges System

To encourage meaningful contributions and community engagement, Explorify features a gamified system based on points and badges.

### 🪙 Points

Users earn or lose points based on their activity on the platform:

- ✅ +10 points when a submitted place is approved by an admin
- ❌ -10 points when a submitted place is disapproved
- ✅ +5 points when a review is approved
- ❌ -5 points when a review is rejected or removed
- ✅ +2 points for following another user

Points reflect a user’s activity level and can contribute to unlocking badges.

---

### 🏅 Badges

Badges are permanent achievements awarded to users when they reach certain milestones. They appear on the user’s profile, fully visible if earned, or darkened with a padlock icon if locked.

#### 🏆 Badge Types

- **📍 First Place Shared:** Earned after your first place is approved
- **📝 First Review Submitted:** Earned after your first review is approved
- **🔥 100 Points Achieved:** Earned by reaching 100 total points
- **🚀 500 Points Achieved:** Earned by reaching 500 total points
- **🌟 1000 Points Achieved:** Earned by reaching 1000 total points
- **👥 First Follower:** Earned when someone follows you
- **🎉 50 Followers:** Earned after gaining 50 followers
- **🏅 100 Followers:** Earned after gaining 100 followers