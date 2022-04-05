# Instagram clone with Vue 3 and Nest

### Content
- [Video ](#video)
- [Project structure](#project-structure)
- [Stack](#stack)
- [App Features](#app-features)
- [Known bugs](#known-bugs)
- [Installation](#installation)
- [Notes](#notes)

### Video
https://user-images.githubusercontent.com/59411497/160753517-13fc2142-4c9c-48d3-8bbf-26f228c4c462.mp4

### Project structure
for a quick understanding of project structure you can look at frontend models (frontend/src/models) or backend modules and their entities (backend/src/modules)

### Stack
#### Frontend

1. Vue 3
2. Vuex
3. Typescript
4. Quasar
5. Vue i18n
6. other - date-fns, some lodash functions, eslint + tslint + prettier

#### Backend

1. Node.js (Nest.js)
2. Typescript
3. PostgreSQL + TypeORM
4. AWS S3 (Amazon Simple Storage Service)

#### Other

Github actions CI pipeline

### App Features

❌ === not implemented yet  
✨ === TODO idea. it seems that it won't be implemented but there were some plans


#### Global
- English lanugage (wow!)
- User notifications (Post like, Comment like, User followed)
- Remove notificiation if user unliked/unfollowed
- User following system
- Google analytics
- Sentry - error monitoring and logging for both frontend and backend

#### Auth
- Login / Register / Forgot password
- OAuth with Google / Github
- 2FA with QR code
- Unique username / email check
- Send email verification mail
- Automaticly redirect to requested page after login (/auth?redirect=/profile/1)
- JWT access (1d exp) and refresh (30d exp) tokens, auto relogin if access token expired 

#### Feed
- View all recent posts from friends (push / fan-out-on-write)
- Remove friend's post from feed after user has seen it ✨
- View own new posts (<24h) on top before friends feed
- View all recent posts based on their naive calculated score (likesNumber + commentsNumber*5 / (now - createdAt)) after friends feed
- Use pull / fan-out-on-read feed for celebrities (100000+ subscribers) ✨
- Feed infinite scroll with [vue-observe-visibility](https://github.com/Akryum/vue-observe-visibility)
- Search users, search tags
- User suggestions in sidebar who follows you / followed by who you follow / new to instagram
##### Post
- Posts CRUD
- Images support. Dragndrop or browse image to upload
- Videos support. Dragndrop or browse video to upload ✨
- Image crop with [vue-cropperjs](https://github.com/Agontuk/vue-cropperjs#readme)
- Image aspect ratio (1:1, 4:5, 16:9, original)
- Image filters
- Tags system and tag suggestion
- Dbclick to like post (with cool animation haha) or like with button
- Show users who liked this post
- Comments CRUD
- Like comment
- Report post
- Comment system with infinity reply nesting with path enumeration / materialized path | look bugs section (1)
- Share to users in messanger ✨
- Bookmark ✨
##### Story
- Story CR✨U✨D✨
- Drawing canvas with [vue-drawing-canvas](https://github.com/razztyfication/vue-drawing-canvas)
- Implement smart eraser (erase only user drawings) ✨

#### Messenger ✨

#### Profile page
- View all own photos/videos
- View posts, followers and followed number
- Follow/unfollow if not own page
- Edit info - change username / name / email (✨) / bio etc...
- Upload user avatar (store in AWS S3, compression with [sharp](https://github.com/lovell/sharp))
- Upload gif avatar ✨

### Known bugs
1. Can't load author relation in comment replies (posts.service.ts, line 172) and need to fix update/delete and correct create reply saving in frontend (FE + BE)
2. Missing pagination in profile, post likes and somewhere else (FE + BE)
3. Story drawing canvas incorrect markup if 16:9 image, problems with image size (FE)
4. Search posts by tag not working (BE)


### Installation  
1. Clone project  
2. Terminal 1 - "docker compose up"  
3. Terminal 2 - "yarn global add @quasar/cli" and "cd .\frontend\" and "quasar dev"  
4. Terminal 3 - "cd .\backend\" and "yarn start:dev" 
5. Don't forget to create new server (Object => Create => Server) and then database (instagram) in pgadmin (localhost:8082). small tip: in server connection field enter: host.docker.internal
6. star? 🤩😊 anyway, glad to any PRs  

Invalid login: 535-5.7.8 Username and Password not accepted - https://myaccount.google.com/lesssecureapps

### Notes
- it was planned as 3-month pet project but it lasted for 4 and even with +1 month deadline i couldn't do lots of things that i wanted. although of course i spent only a couple of hours a day on it, i think it's ok haha
- also i wanted to add some caching and queues but at this rate it'll drag on for another couple of weeks
- in the video logo on the top left disappeared from 0:36. it's cuz i took image source directly from instagram but it was blocked in russia lolll. before that i reseted browser cache behind the frame
