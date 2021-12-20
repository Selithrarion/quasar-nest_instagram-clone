# Instagram clone with Vue 3 and Nest

### Video  
TODO

### Stack
#### Frontend

1. Vue 3
2. Vuex
3. Typescript
4. Quasar
5. Socket.io
6. Vue i18n
7. other - date-fns, some lodash functions, eslint + tslint + prettier

#### Backend

1. Node.js (Nest.js)
2. Typescript
3. PostgreSQL + TypeORM (database)
4. Swagger, Swagger UI (docs)
5. Socket.io
6. AWS S3 (Amazon Simple Storage Service)

#### Other

Github actions CI pipeline

### App Features
❌ === not implemented yet
#### Global
- English lanugage
- User notifications ❌

#### Auth
- Login / Register / Forgot password ❌
- OAuth with Google / Github ❌
- Unique username / email validation ❌

- Send email verification mail ❌
- Automaticly redirect to requested page after login (/auth?redirect=/profile/1) ❌
- JWT access (1d exp) and refresh (30d exp) tokens, auto relogin if access token expired ❌

#### Feed
- View all recent posts (photos/videos) from subscriptions or trends ❌
- Search posts with selected tags ❌
##### Post
- Posts CRUD ❌
- Images crop with [vue-cropperjs](https://github.com/Agontuk/vue-cropperjs#readme) ❌
- Tags suggestion ❌
- Dbclick to like post or like with button ❌
- Comments CRUD, comment reply ❌
- Share (?) ❌
- Bookmark (?) ❌

#### Profile page
- View all own photos/videos ❌
- Edit info - change username / name / email / about etc... ❌
- Upload user avatar (store in AWS S3, compression with [sharp](https://github.com/lovell/sharp)) ❌

### Install  
1. Clone project  
2. Terminal #1 "docker compose up"  
3. Terminal #2 "cd .\frontend\" and "quasar dev"  
4. Terminal #3 "cd .\backend\" and "yarn start:dev" 
5. Don't forget to create new server (Object => Create => Server) and then database (jiraClone) in pgadmin (localhost:8082). small tip: in server connection field enter: host.docker.internal
6. do you like stars? 🤩😊 anyway, glad to any PRs  


