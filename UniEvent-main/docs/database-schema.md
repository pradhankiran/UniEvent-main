# Database Schema

Firebase Realtime Database JSON representation.

```json
{
  "users": {
    "uid123": {
      "name": "Kiran Pradhan",
      "email": "kiran@email.com",
      "role": "student",
      "department": "Computer Science",
      "joinedClubs": { "club1": true },
      "points": 120,
      "createdAt": "timestamp"
    }
  },

  "clubs": {
    "club1": {
      "name": "Coding Club",
      "description": "Tech and programming club",
      "facultyAdvisor": "uid_faculty1",
      "createdBy": "uid_student1",
      "members": { "uid123": true },
      "events": { "event1": true },
      "createdAt": "timestamp"
    }
  },

  "events": {
    "event1": {
      "title": "AI Workshop",
      "description": "Intro to AI",
      "clubId": "club1",
      "createdBy": "uid_student1",
      "approvedBy": "uid_faculty1",
      "date": "2026-04-10",
      "time": "10:00",
      "location": "Auditorium",
      "capacity": 200,
      "registeredCount": 45,
      "status": "approved",
      "bannerUrl": "image_link"
    }
  },

  "registrations": {
    "event1": {
      "uid123": {
        "registeredAt": "timestamp",
        "checkedIn": false,
        "qrCode": "generated_qr_string"
      }
    }
  },

  "announcements": {
    "announcement1": {
      "title": "Exam Notice",
      "content": "Mid semester exam schedule released",
      "postedBy": "uid_faculty1",
      "priority": "high",
      "createdAt": "timestamp"
    }
  },

  "feedback": {
    "event1": {
      "uid123": {
        "rating": 5,
        "comment": "Great workshop!"
      }
    }
  },

  "leaderboard": {
    "uid123": {
      "points": 120
    }
  },

  "notifications": {
    "uid123": {
      "notif1": {
        "title": "Event Reminder",
        "message": "AI Workshop tomorrow",
        "read": false
      }
    }
  }
}
```
