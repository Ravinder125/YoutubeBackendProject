# This is a project on backend 
## In this project we are gonna create a video platform just similar to youtube

# API Documentation

## User Management API Endpoints

### Register User
```http
POST /api/v1/users/register
```

Register a new user with profile images.

**Request Body (multipart/form-data):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "securepassword123",
  "avatar": "(file upload)",
  "coverImage": "(file upload - optional)"
}
```

**Response:**
```json
{
  "status": 201,
  "data": {
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://cloudinary.com/avatar-url",
    "coverImage": "https://cloudinary.com/cover-url"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/v1/users/login
```

Login with email/username and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  // OR
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://cloudinary.com/avatar-url"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "User logged in Successfully"
}
```

### Logout User
```http
POST /api/v1/users/logout
```

Logout the currently authenticated user.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {},
  "message": "User logged out"
}
```

### Refresh Access Token
```http
POST /api/v1/users/refresh-token
```

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  },
  "message": "Access token refreshed"
}
```

### Change Password
```http
POST /api/v1/users/change-password
```

Change user's password.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "oldPassword": "currentpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe"
    }
  },
  "message": "Password changed successfully"
}
```

### Update Avatar
```http
PATCH /api/v1/users/avatar
```

Update user's avatar image.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body (multipart/form-data):**
```json
{
  "avatar": "(file upload)"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "avatarUrl": "https://cloudinary.com/new-avatar-url"
  },
  "message": "Avatar file is updated"
}
```

### Update Cover Image
```http
PATCH /api/v1/users/cover-image
```

Update user's cover image.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body (multipart/form-data):**
```json
{
  "coverImage": "(file upload)"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "coverimageURL": "https://cloudinary.com/new-cover-url"
  },
  "message": "Cover image is updated"
}
```

### Get Channel Profile
```http
GET /api/v1/users/c/:username
```

Get user's channel profile information.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cloudinary.com/avatar-url",
    "coverImage": "https://cloudinary.com/cover-url",
    "subscriberCount": 1000,
    "subscribedChannelsCount": 50,
    "isSubscribed": false
  },
  "message": "User channel fetched successfully"
}
```

### Get User Profile
```http
GET /api/v1/users/profile
```

Get current user's profile information.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "user": {
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://cloudinary.com/avatar-url",
      "coverImage": "https://cloudinary.com/cover-url"
    }
  },
  "message": "User details successfully fetched"
}
```

### Get Watch History
```http
GET /api/v1/users/history
```

Get user's video watch history.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "watchHistory": [
      {
        "videoId": "video-id",
        "title": "Video Title",
        "thumbnail": "https://cloudinary.com/thumbnail-url",
        "owner": {
          "username": "creator",
          "fullName": "Content Creator",
          "avatar": "https://cloudinary.com/creator-avatar"
        }
      }
    ]
  },
  "message": "Watch history fetched successfully"
}
```

## Video Management API Endpoints

### Upload Video
```http
POST /api/v1/videos
```

Upload a new video with optional thumbnail.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body (multipart/form-data):**
```json
{
  "videoFile": "(video file upload - required)",
  "thumbnail": "(image file upload - optional)",
  "publish": "yes" // or "no" for draft
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "Video": {
      "_id": "video-id",
      "videoUrl": "https://cloudinary.com/video-url",
      "thumbnail": "https://cloudinary.com/thumbnail-url",
      "duration": 120,
      "createdBy": "user-id",
      "isPublished": true,
      "views": [],
      "createdAt": "2024-01-20T12:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    }
  },
  "message": "Video is successfully uploaded"
}
```

### Get All Videos
```http
GET /api/v1/videos
```

Get paginated list of videos.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Query Parameters:**
- page (default: 1)
- limit (default: 3)
- query (search term)
- sortBy (field name)
- sortType (asc/desc)
- userId (filter by user)

**Response:**
```json
{
  "status": 200,
  "data": {
    "docs": [{
      "_id": "video-id",
      "videoUrl": "https://cloudinary.com/video-url",
      "thumbnail": "https://cloudinary.com/thumbnail-url",
      "creator": [{
        "avatar": "https://cloudinary.com/avatar-url",
        "username": "creator-username"
      }]
    }],
    "totalDocs": 10,
    "limit": 3,
    "page": 1,
    "totalPages": 4,
    "hasNextPage": true,
    "nextPage": 2,
    "hasPrevPage": false
  },
  "message": "Videos successfully fetched"
}
```

### Update Video
```http
PUT /api/v1/videos/:videoId
```

Update video details and thumbnail.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body (multipart/form-data):**
```json
{
  "title": "Updated video title",
  "description": "Updated description",
  "thumbnail": "(image file upload - optional)",
  "status": "published"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "updateVideo": {
      "_id": "video-id",
      "title": "Updated video title",
      "description": "Updated description",
      "thumbnail": "https://cloudinary.com/new-thumbnail-url",
      "status": "published"
    }
  },
  "message": "Video successfully updated"
}
```

### Delete Video
```http
DELETE /api/v1/videos/:videoId
```

Mark video as deleted and remove from cloudinary.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "isVideoRemoved": {
      "_id": "video-id",
      "isDelete": true,
      "isPublished": false
    }
  },
  "message": "Video is successfully deleted"
}
```

### Toggle Video Publish Status
```http
PATCH /api/v1/videos/toggle/publish/:videoId
```

Toggle video between published and unpublished state.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "publish": "yes" // or "no"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "video": {
      "_id": "video-id",
      "isPublished": true
    }
  },
  "message": "Video's publish status is successfully updated"
}
```

### Watch Video
```http
PATCH /api/v1/videos/:videoId
```

Add user to video's view count.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "watchVideo": {
      "_id": "video-id",
      "views": ["user-id"]
    }
  },
  "message": "Video is successfully watched"
}
```

## Comment Management API Endpoints

### Create Comment
```http
POST /api/v1/comments/:videoId
```

Create a new comment on a video.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "content": "This is a great video!"
}
```

**Response:**
```json
{
  "status": 201,
  "data": {
    "comment": {
      "_id": "comment-id",
      "content": "This is a great video!",
      "video": "video-id",
      "createdBy": "user-id",
      "createdAt": "2024-01-20T12:00:00.000Z"
    }
  },
  "message": "Comment successfully created"
}
```

### Update Comment
```http
PATCH /api/v1/comments/c/:commentId
```

Update an existing comment.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "updateComment": {
      "_id": "comment-id",
      "content": "Updated comment content",
      "video": "video-id",
      "createdBy": "user-id"
    }
  },
  "message": "Comment is successfully updated"
}
```

### Delete Comment
```http
DELETE /api/v1/comments/c/:commentId
```

Soft delete a comment.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "deleteComment": {
      "_id": "comment-id",
      "isDelete": true
    }
  },
  "message": "Comment is successfully deleted"
}
```

### Get Video Comments
```http
GET /api/v1/comments/:videoId
```

Get paginated list of comments for a video.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Query Parameters:**
- page (default: 1)
- limit (default: 5)

**Response:**
```json
{
  "status": 200,
  "data": {
    "videoComments": {
      "docs": [
        {
          "_id": "comment-id",
          "content": "Great video!",
          "Commenter": [{
            "username": "commenter",
            "avatar": "https://cloudinary.com/avatar-url"
          }]
        }
      ],
      "totalDocs": 20,
      "limit": 5,
      "page": 1,
      "totalPages": 4,
      "hasNextPage": true
    }
  },
  "message": "Video comments retrieved successfully"
}
```

## Like Management API Endpoints

### Toggle Video Like
```http
POST /api/v1/likes/toggle/v/:videoId
```

Toggle like status for a video.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "updateLike": {
      "_id": "like-id",
      "video": "video-id",
      "createdBy": "user-id",
      "isDislike": false
    }
  },
  "message": "Video successfully liked"
}
```

### Toggle Tweet Like
```http
POST /api/v1/likes/toggle/t/:tweetId
```

Toggle like status for a tweet.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "updateLike": {
      "_id": "like-id",
      "tweet": "tweet-id",
      "createdBy": "user-id",
      "isDislike": false
    }
  },
  "message": "Tweet successfully liked"
}
```

### Toggle Comment Like
```http
POST /api/v1/likes/toggle/c/:commentId
```

Toggle like status for a comment.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "updateLike": {
      "_id": "like-id",
      "comment": "comment-id",
      "createdBy": "user-id",
      "isDislike": false
    }
  },
  "message": "Comment successfully liked"
}
```

### Get Liked Videos
```http
GET /api/v1/likes/videos
```

Get paginated list of videos liked by the user.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Query Parameters:**
- page (default: 1)
- limit (default: 10)

**Response:**
```json
{
  "status": 200,
  "data": {
    "paginate": {
      "docs": [
        {
          "video": {
            "_id": "video-id",
            "title": "Video Title",
            "thumbnail": "https://cloudinary.com/thumbnail-url"
          }
        }
      ],
      "totalDocs": 15,
      "limit": 10,
      "page": 1,
      "totalPages": 2,
      "hasNextPage": true
    }
  },
  "message": "Successfully fetched liked videos"
}
```

## Subscription Management API Endpoints

### Toggle Channel Subscription
```http
PUT /api/v1/subscriptions/c/:channelId
```

Subscribe or unsubscribe from a channel.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "toggle": {
      "_id": "subscription-id",
      "subscriber": "user-id",
      "channel": "channel-id",
      "createdAt": "2024-01-20T12:00:00.000Z"
    }
  },
  "message": "Channel is successfully subscribed"
}
```

### Get Subscribed Channels
```http
GET /api/v1/subscriptions/c/:channelId
```

Get list of channels the user has subscribed to.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "subscribedChannels": [
      {
        "channel": {
          "_id": "channel-id",
          "username": "channelname",
          "avatar": "https://cloudinary.com/avatar-url"
        }
      }
    ]
  },
  "message": "Subscribed channels successfully fetched"
}
```

### Get Channel Subscribers
```http
GET /api/v1/subscriptions/u/:subscriberId
```

Get list of subscribers for a channel.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "subscribers": [
      {
        "subscriberInfo": [{
          "username": "subscriber",
          "avatar": "https://cloudinary.com/avatar-url",
          "email": "subscriber@example.com"
        }],
        "subscriberCount": 1000
      }
    ]
  },
  "message": "User channel's subscribers successfully fetched"
}
```

## Playlist Management API Endpoints

### Create Playlist
```http
POST /api/v1/playlists
```

Create a new playlist.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "name": "My Favorite Videos",
  "description": "A collection of my favorite videos",
  "isPublic": "yes"
}
```

**Response:**
```json
{
  "status": 201,
  "data": {
    "playlist": {
      "_id": "playlist-id",
      "name": "My Favorite Videos",
      "description": "A collection of my favorite videos",
      "isPublic": true,
      "createdBy": "user-id",
      "videos": []
    }
  },
  "message": "Playlist is successfully created"
}
```

### Add Video to Playlist
```http
PATCH /api/v1/playlists/add/:videoId/:playlistId
```

Add a video to a playlist.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "playlist": {
      "_id": "playlist-id",
      "videos": ["video-id"]
    }
  },
  "message": "Video successfully added to playlist"
}
```

### Remove Video from Playlist
```http
PATCH /api/v1/playlists/remove/:videoId/:playlistId
```

Remove a video from a playlist.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "updatedPlaylist": {
      "_id": "playlist-id",
      "videos": []
    }
  },
  "message": "Video successfully deleted from the playlist"
}
```

### Get Playlist by ID
```http
GET /api/v1/playlists/:playlistId
```

Get detailed information about a playlist.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "playlist": [{
      "videoList": [
        {
          "_id": "video-id",
          "title": "Video Title",
          "thumbnail": "https://cloudinary.com/thumbnail-url",
          "duration": 300,
          "createdBy": {
            "username": "creator",
            "avatar": "https://cloudinary.com/avatar-url"
          }
        }
      ]
    }]
  },
  "message": "Playlist fetched successfully"
}
```

### Update Playlist
```http
PATCH /api/v1/playlists/:playlistId
```

Update playlist details.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Request Body:**
```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description",
  "isPublic": "no"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "updatedPlaylist": {
      "_id": "playlist-id",
      "name": "Updated Playlist Name",
      "description": "Updated description",
      "isPublic": false
    }
  },
  "message": "Playlist is successfully updated"
}
```

### Delete Playlist
```http
DELETE /api/v1/playlists/:playlistId
```

Delete a playlist.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "deletedPlaylist": {
      "_id": "playlist-id",
      "name": "Playlist Name",
      "videos": []
    }
  },
  "message": "Playlist successfully deleted"
}
```

### Get User Playlists
```http
GET /api/v1/playlists/user/:userId
```

Get all playlists created by a user.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "_id": "playlist-id",
      "name": "Playlist Name",
      "description": "Playlist Description",
      "isPublic": true
    }
  ],
  "message": "User playlists successfully fetched"
}
```

## Dashboard API Endpoints

### Get Channel Stats
```http
GET /api/v1/dashboard/stats
```

Get statistics for the authenticated user's channel.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "data": {
    "aggregateQuery": {
      "channelVideos": [
        {
          "_id": "video-id",
          "thumbnail": "https://cloudinary.com/thumbnail-url",
          "title": "Video Title",
          "viewCount": 1500,
          "description": "Video description",
          "duration": 300,
          "createdAt": "2024-01-20T12:00:00.000Z"
        }
      ],
      "totalViews": 5000,
      "avatar": "https://cloudinary.com/avatar-url",
      "username": "channelname",
      "email": "channel@example.com",
      "coverImage": "https://cloudinary.com/cover-url",
      "subscriberCounts": 1000
    }
  },
  "message": "Successfully channels stats fetched"
}
```

### Get Channel Videos
```http
GET /api/v1/dashboard/videos
```

Get paginated list of videos for the authenticated user's channel.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Query Parameters:**
- page (default: 1)
- limit (default: 2)

**Response:**
```json
{
  "status": 200,
  "data": {
    "channelVideos": {
      "docs": [
        {
          "_id": "video-id",
          "videoUrl": "https://cloudinary.com/video-url",
          "thumbnail": "https://cloudinary.com/thumbnail-url",
          "title": "Video Title",
          "description": "Video description",
          "duration": 300,
          "viewsCount": 1500
        }
      ],
      "totalDocs": 10,
      "limit": 2,
      "page": 1,
      "totalPages": 5,
      "hasNextPage": true,
      "nextPage": 2,
      "hasPrevPage": false
    }
  },
  "message": "Channel videos successfully fetched"
}
```

## Health Check API Endpoint

### Check API Health
```http
GET /api/v1/healthcheck
```

Check if the API is working properly.

**Headers Required:**
- Authorization: Bearer {accessToken}

**Response:**
```json
{
  "status": 200,
  "message": "Everything is alright"
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "status": 400-500,
  "error": "Error message description",
  "success": false
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error