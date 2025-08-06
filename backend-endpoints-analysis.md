# Análisis Exhaustivo de Endpoints del Backend - MussikOn

## 📊 Resumen Ejecutivo

- **Total de endpoints**: 420
- **Categorías**: 11
- **Fecha de análisis**: 2025-08-06T17:37:04.220Z

## 📂 Endpoints por Categoría

### Analytics (28 endpoints - 6.7%)

- **GET** `/stats` - analyticsRoutes.ts
- **GET** `/stats/public` - analyticsRoutes.ts
- **GET** `/stats` - analyticsRoutes.ts
- **GET** `/stats/public` - analyticsRoutes.ts
- **GET** `/stats` - chatRoutes.ts
- **GET** `/stats` - chatRoutes.ts
- **GET** `/stats` - depositRoutes.ts
- **GET** `/stats` - depositRoutes.ts
- **GET** `/stats` - geolocationRoutes.ts
- **GET** `/stats` - geolocationRoutes.ts
- **GET** `/stats` - hiringRoutes.ts
- **GET** `/stats` - hiringRoutes.ts
- **GET** `/stats` - idriveHealthRoutes.ts
- **GET** `/stats` - idriveHealthRoutes.ts
- **GET** `/stats` - imagesRoutes.ts
- **GET** `/stats/public` - imagesRoutes.ts
- **GET** `/stats` - imagesRoutes.ts
- **GET** `/stats/public` - imagesRoutes.ts
- **GET** `/stats` - musicianSearchRoutes.ts
- **GET** `/stats` - musicianSearchRoutes.ts
- **GET** `/cache/stats` - optimizationRoutes.ts
- **GET** `/stats` - optimizationRoutes.ts
- **GET** `/cache/stats` - optimizationRoutes.ts
- **GET** `/stats` - optimizationRoutes.ts
- **GET** `/stats` - paymentRoutes.ts
- **GET** `/stats` - paymentRoutes.ts
- **GET** `/stats` - pushNotificationRoutes.ts
- **GET** `/stats` - pushNotificationRoutes.ts

### Authentication (12 endpoints - 2.9%)

- **POST** `/login` - adminAuthRoutes.ts
- **POST** `/login` - adminAuthRoutes.ts
- **GET** `/stats/authenticated` - analyticsRoutes.ts
- **GET** `/stats/authenticated` - analyticsRoutes.ts
- **POST** `/Register` - authRoutes.ts
- **POST** `/login` - authRoutes.ts
- **POST** `/email-register` - authRoutes.ts
- **POST** `/Register` - authRoutes.ts
- **POST** `/login` - authRoutes.ts
- **POST** `/email-register` - authRoutes.ts
- **POST** `/bank-accounts/register` - paymentSystemRoutes.ts
- **POST** `/bank-accounts/register` - paymentSystemRoutes.ts

### Events (28 endpoints - 6.7%)

- **POST** `/:eventId/accept` - eventsRoutes.ts
- **GET** `/my-events` - eventsRoutes.ts
- **GET** `/:eventId` - eventsRoutes.ts
- **PATCH** `/:eventId/cancel` - eventsRoutes.ts
- **PATCH** `/:eventId/complete` - eventsRoutes.ts
- **DELETE** `/:eventId` - eventsRoutes.ts
- **GET** `/advanced/:eventId` - eventsRoutes.ts
- **POST** `/:eventId/accept` - eventsRoutes.ts
- **GET** `/my-events` - eventsRoutes.ts
- **GET** `/:eventId` - eventsRoutes.ts
- **PATCH** `/:eventId/cancel` - eventsRoutes.ts
- **PATCH** `/:eventId/complete` - eventsRoutes.ts
- **DELETE** `/:eventId` - eventsRoutes.ts
- **GET** `/advanced/:eventId` - eventsRoutes.ts
- **GET** `/nearby-events` - geolocationRoutes.ts
- **GET** `/nearby-events` - geolocationRoutes.ts
- **POST** `/search-for-event` - musicianSearchRoutes.ts
- **GET** `/recommendations/:eventId` - musicianSearchRoutes.ts
- **POST** `/search-for-event` - musicianSearchRoutes.ts
- **GET** `/recommendations/:eventId` - musicianSearchRoutes.ts
- **POST** `/events/:eventId/pay-musician` - paymentSystemRoutes.ts
- **POST** `/events/:eventId/pay-musician` - paymentSystemRoutes.ts
- **GET** `/event/:eventId` - ratingRoutes.ts
- **GET** `/event/:eventId` - ratingRoutes.ts
- **GET** `/events` - searchRoutes.ts
- **GET** `/available-events` - searchRoutes.ts
- **GET** `/events` - searchRoutes.ts
- **GET** `/available-events` - searchRoutes.ts

### Geolocation (2 endpoints - 0.5%)

- **GET** `/location` - searchRoutes.ts
- **GET** `/location` - searchRoutes.ts

### Images (18 endpoints - 4.3%)

- **GET** `/:imageId` - imagesRoutes.ts
- **DELETE** `/:imageId` - imagesRoutes.ts
- **GET** `/:imageId/integrity` - imagesRoutes.ts
- **GET** `/:imageId/serve` - imagesRoutes.ts
- **GET** `/:imageId/presigned` - imagesRoutes.ts
- **POST** `/saveImage` - imagesRoutes.ts
- **GET** `/getImage/:key` - imagesRoutes.ts
- **GET** `/:imageId` - imagesRoutes.ts
- **DELETE** `/:imageId` - imagesRoutes.ts
- **GET** `/:imageId/integrity` - imagesRoutes.ts
- **GET** `/:imageId/serve` - imagesRoutes.ts
- **GET** `/:imageId/presigned` - imagesRoutes.ts
- **POST** `/saveImage` - imagesRoutes.ts
- **GET** `/getImage/:key` - imagesRoutes.ts
- **GET** `/payments/voucher-image/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/voucher-image-direct/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/voucher-image/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/voucher-image-direct/:depositId` - paymentSystemRoutes.ts

### Musicians (22 endpoints - 5.2%)

- **POST** `/musicians` - advancedSearchRoutes.ts
- **POST** `/update-status/:musicianId` - advancedSearchRoutes.ts
- **POST** `/heartbeat/:musicianId` - advancedSearchRoutes.ts
- **GET** `/daily-availability/:musicianId` - advancedSearchRoutes.ts
- **POST** `/musicians` - advancedSearchRoutes.ts
- **POST** `/update-status/:musicianId` - advancedSearchRoutes.ts
- **POST** `/heartbeat/:musicianId` - advancedSearchRoutes.ts
- **GET** `/daily-availability/:musicianId` - advancedSearchRoutes.ts
- **POST** `/request-musician` - eventsRoutes.ts
- **POST** `/request-musician` - eventsRoutes.ts
- **GET** `/nearby-musicians` - geolocationRoutes.ts
- **GET** `/nearby-musicians` - geolocationRoutes.ts
- **GET** `/musicians/earnings` - paymentSystemRoutes.ts
- **POST** `/musicians/withdraw-earnings` - paymentSystemRoutes.ts
- **GET** `/musicians/earnings` - paymentSystemRoutes.ts
- **POST** `/musicians/withdraw-earnings` - paymentSystemRoutes.ts
- **GET** `/top-musicians` - ratingRoutes.ts
- **GET** `/top-musicians` - ratingRoutes.ts
- **GET** `/musician-requests` - searchRoutes.ts
- **GET** `/available-musicians` - searchRoutes.ts
- **GET** `/musician-requests` - searchRoutes.ts
- **GET** `/available-musicians` - searchRoutes.ts

### Other (230 endpoints - 54.8%)

- **GET** `/verify` - adminAuthRoutes.ts
- **GET** `/me` - adminAuthRoutes.ts
- **POST** `/logout` - adminAuthRoutes.ts
- **GET** `/verify` - adminAuthRoutes.ts
- **GET** `/me` - adminAuthRoutes.ts
- **POST** `/logout` - adminAuthRoutes.ts
- **POST** `/check-availability` - advancedSearchRoutes.ts
- **POST** `/calculate-rate` - advancedSearchRoutes.ts
- **POST** `/check-availability` - advancedSearchRoutes.ts
- **POST** `/calculate-rate` - advancedSearchRoutes.ts
- **GET** `/performance` - analyticsRoutes.ts
- **GET** `/recent-activity` - analyticsRoutes.ts
- **GET** `/` - analyticsRoutes.ts
- **GET** `/performance` - analyticsRoutes.ts
- **GET** `/recent-activity` - analyticsRoutes.ts
- **GET** `/` - analyticsRoutes.ts
- **POST** `/request-verification` - authRoutes.ts
- **POST** `/verify-and-complete-registration` - authRoutes.ts
- **POST** `/forgot-password` - authRoutes.ts
- **POST** `/verify-code` - authRoutes.ts
- **POST** `/reset-password` - authRoutes.ts
- **POST** `/request-verification` - authRoutes.ts
- **POST** `/verify-and-complete-registration` - authRoutes.ts
- **POST** `/forgot-password` - authRoutes.ts
- **POST** `/verify-code` - authRoutes.ts
- **POST** `/reset-password` - authRoutes.ts
- **GET** `/conversations` - chatRoutes.ts
- **GET** `/conversations/:conversationId` - chatRoutes.ts
- **GET** `/conversations/:conversationId/messages` - chatRoutes.ts
- **POST** `/conversations` - chatRoutes.ts
- **POST** `/messages` - chatRoutes.ts
- **PUT** `/messages/:messageId/edit` - chatRoutes.ts
- **POST** `/messages/:messageId/reactions` - chatRoutes.ts
- **DELETE** `/messages/:messageId/reactions` - chatRoutes.ts
- **DELETE** `/messages/:messageId` - chatRoutes.ts
- **PUT** `/messages/:messageId/read` - chatRoutes.ts
- **PUT** `/conversations/:conversationId/typing` - chatRoutes.ts
- **DELETE** `/conversations/:conversationId` - chatRoutes.ts
- **PUT** `/conversations/:conversationId/archive` - chatRoutes.ts
- **GET** `/conversations` - chatRoutes.ts
- **GET** `/conversations/:conversationId` - chatRoutes.ts
- **GET** `/conversations/:conversationId/messages` - chatRoutes.ts
- **POST** `/conversations` - chatRoutes.ts
- **POST** `/messages` - chatRoutes.ts
- **PUT** `/messages/:messageId/edit` - chatRoutes.ts
- **POST** `/messages/:messageId/reactions` - chatRoutes.ts
- **DELETE** `/messages/:messageId/reactions` - chatRoutes.ts
- **DELETE** `/messages/:messageId` - chatRoutes.ts
- **PUT** `/messages/:messageId/read` - chatRoutes.ts
- **PUT** `/conversations/:conversationId/typing` - chatRoutes.ts
- **DELETE** `/conversations/:conversationId` - chatRoutes.ts
- **PUT** `/conversations/:conversationId/archive` - chatRoutes.ts
- **POST** `/report` - depositRoutes.ts
- **GET** `/pending` - depositRoutes.ts
- **GET** `/bank-accounts` - depositRoutes.ts
- **POST** `/report` - depositRoutes.ts
- **GET** `/pending` - depositRoutes.ts
- **GET** `/bank-accounts` - depositRoutes.ts
- **GET** `/my-pending` - eventsRoutes.ts
- **GET** `/my-assigned` - eventsRoutes.ts
- **GET** `/my-completed` - eventsRoutes.ts
- **GET** `/available-requests` - eventsRoutes.ts
- **GET** `/my-scheduled` - eventsRoutes.ts
- **GET** `/my-past-performances` - eventsRoutes.ts
- **GET** `/my-cancelled` - eventsRoutes.ts
- **POST** `/heartbeat` - eventsRoutes.ts
- **GET** `/my-pending` - eventsRoutes.ts
- **GET** `/my-assigned` - eventsRoutes.ts
- **GET** `/my-completed` - eventsRoutes.ts
- **GET** `/available-requests` - eventsRoutes.ts
- **GET** `/my-scheduled` - eventsRoutes.ts
- **GET** `/my-past-performances` - eventsRoutes.ts
- **GET** `/my-cancelled` - eventsRoutes.ts
- **POST** `/heartbeat` - eventsRoutes.ts
- **GET** `/proximity` - geolocationRoutes.ts
- **POST** `/optimize-route` - geolocationRoutes.ts
- **POST** `/geocode` - geolocationRoutes.ts
- **POST** `/reverse-geocode` - geolocationRoutes.ts
- **POST** `/calculate-distance` - geolocationRoutes.ts
- **POST** `/within-radius` - geolocationRoutes.ts
- **GET** `/proximity` - geolocationRoutes.ts
- **POST** `/optimize-route` - geolocationRoutes.ts
- **POST** `/geocode` - geolocationRoutes.ts
- **POST** `/reverse-geocode` - geolocationRoutes.ts
- **POST** `/calculate-distance` - geolocationRoutes.ts
- **POST** `/within-radius` - geolocationRoutes.ts
- **POST** `/create` - hiringRoutes.ts
- **GET** `/:requestId` - hiringRoutes.ts
- **PUT** `/:requestId/status` - hiringRoutes.ts
- **POST** `/:requestId/messages` - hiringRoutes.ts
- **PUT** `/:requestId/messages/read` - hiringRoutes.ts
- **POST** `/create` - hiringRoutes.ts
- **GET** `/:requestId` - hiringRoutes.ts
- **PUT** `/:requestId/status` - hiringRoutes.ts
- **POST** `/:requestId/messages` - hiringRoutes.ts
- **PUT** `/:requestId/messages/read` - hiringRoutes.ts
- **GET** `/health` - idriveHealthRoutes.ts
- **POST** `/health/check` - idriveHealthRoutes.ts
- **GET** `/health/tokens` - idriveHealthRoutes.ts
- **GET** `/health/report` - idriveHealthRoutes.ts
- **POST** `/restart` - idriveHealthRoutes.ts
- **GET** `/config` - idriveHealthRoutes.ts
- **GET** `/health` - idriveHealthRoutes.ts
- **POST** `/health/check` - idriveHealthRoutes.ts
- **GET** `/health/tokens` - idriveHealthRoutes.ts
- **GET** `/health/report` - idriveHealthRoutes.ts
- **POST** `/restart` - idriveHealthRoutes.ts
- **GET** `/config` - idriveHealthRoutes.ts
- **POST** `/upload` - imagesRoutes.ts
- **POST** `/upload/public` - imagesRoutes.ts
- **GET** `/` - imagesRoutes.ts
- **GET** `/url` - imagesRoutes.ts
- **GET** `/statistics` - imagesRoutes.ts
- **POST** `/cleanup` - imagesRoutes.ts
- **POST** `/validate` - imagesRoutes.ts
- **GET** `/serve-url` - imagesRoutes.ts
- **GET** `/diagnose` - imagesRoutes.ts
- **GET** `/single/:key` - imagesRoutes.ts
- **GET** `/single/:key/public` - imagesRoutes.ts
- **GET** `/filename/:filename` - imagesRoutes.ts
- **GET** `/filename/:filename/public` - imagesRoutes.ts
- **GET** `/all/public` - imagesRoutes.ts
- **GET** `/statistics/public` - imagesRoutes.ts
- **GET** `/verify/public` - imagesRoutes.ts
- **GET** `/all/signed` - imagesRoutes.ts
- **GET** `/all/signed/public` - imagesRoutes.ts
- **GET** `/all/idrive` - imagesRoutes.ts
- **GET** `/all/idrive/public` - imagesRoutes.ts
- **POST** `/upload` - imagesRoutes.ts
- **POST** `/upload/public` - imagesRoutes.ts
- **GET** `/` - imagesRoutes.ts
- **GET** `/url` - imagesRoutes.ts
- **GET** `/statistics` - imagesRoutes.ts
- **POST** `/cleanup` - imagesRoutes.ts
- **POST** `/validate` - imagesRoutes.ts
- **GET** `/serve-url` - imagesRoutes.ts
- **GET** `/diagnose` - imagesRoutes.ts
- **GET** `/single/:key` - imagesRoutes.ts
- **GET** `/single/:key/public` - imagesRoutes.ts
- **GET** `/filename/:filename` - imagesRoutes.ts
- **GET** `/filename/:filename/public` - imagesRoutes.ts
- **GET** `/all/public` - imagesRoutes.ts
- **GET** `/statistics/public` - imagesRoutes.ts
- **GET** `/verify/public` - imagesRoutes.ts
- **GET** `/all/signed` - imagesRoutes.ts
- **GET** `/all/signed/public` - imagesRoutes.ts
- **GET** `/all/idrive` - imagesRoutes.ts
- **GET** `/all/idrive/public` - imagesRoutes.ts
- **POST** `/` - musicianRequestRoutes.ts
- **GET** `/:id` - musicianRequestRoutes.ts
- **PUT** `/:id` - musicianRequestRoutes.ts
- **DELETE** `/:id` - musicianRequestRoutes.ts
- **POST** `/` - musicianRequestRoutes.ts
- **GET** `/:id` - musicianRequestRoutes.ts
- **PUT** `/:id` - musicianRequestRoutes.ts
- **DELETE** `/:id` - musicianRequestRoutes.ts
- **DELETE** `/cache/clear` - optimizationRoutes.ts
- **POST** `/query/analyze` - optimizationRoutes.ts
- **POST** `/index/create` - optimizationRoutes.ts
- **POST** `/query/execute` - optimizationRoutes.ts
- **POST** `/batch` - optimizationRoutes.ts
- **GET** `/health` - optimizationRoutes.ts
- **DELETE** `/cache/clear` - optimizationRoutes.ts
- **POST** `/query/analyze` - optimizationRoutes.ts
- **POST** `/index/create` - optimizationRoutes.ts
- **POST** `/query/execute` - optimizationRoutes.ts
- **POST** `/batch` - optimizationRoutes.ts
- **GET** `/health` - optimizationRoutes.ts
- **POST** `/methods` - paymentRoutes.ts
- **GET** `/methods` - paymentRoutes.ts
- **POST** `/intents` - paymentRoutes.ts
- **GET** `/intents` - paymentRoutes.ts
- **POST** `/process` - paymentRoutes.ts
- **POST** `/invoices` - paymentRoutes.ts
- **GET** `/invoices` - paymentRoutes.ts
- **POST** `/invoices/:invoiceId/pay` - paymentRoutes.ts
- **POST** `/refunds` - paymentRoutes.ts
- **POST** `/validate` - paymentRoutes.ts
- **GET** `/gateways` - paymentRoutes.ts
- **POST** `/methods` - paymentRoutes.ts
- **GET** `/methods` - paymentRoutes.ts
- **POST** `/intents` - paymentRoutes.ts
- **GET** `/intents` - paymentRoutes.ts
- **POST** `/process` - paymentRoutes.ts
- **POST** `/invoices` - paymentRoutes.ts
- **GET** `/invoices` - paymentRoutes.ts
- **POST** `/invoices/:invoiceId/pay` - paymentRoutes.ts
- **POST** `/refunds` - paymentRoutes.ts
- **POST** `/validate` - paymentRoutes.ts
- **GET** `/gateways` - paymentRoutes.ts
- **GET** `/my-balance` - paymentSystemRoutes.ts
- **GET** `/bank-accounts/my-accounts` - paymentSystemRoutes.ts
- **GET** `/firestore/indexes/status` - paymentSystemRoutes.ts
- **GET** `/my-balance` - paymentSystemRoutes.ts
- **GET** `/bank-accounts/my-accounts` - paymentSystemRoutes.ts
- **GET** `/firestore/indexes/status` - paymentSystemRoutes.ts
- **POST** `/subscription` - pushNotificationRoutes.ts
- **GET** `/subscriptions` - pushNotificationRoutes.ts
- **DELETE** `/subscription/:subscriptionId` - pushNotificationRoutes.ts
- **POST** `/bulk` - pushNotificationRoutes.ts
- **POST** `/templates` - pushNotificationRoutes.ts
- **GET** `/templates` - pushNotificationRoutes.ts
- **GET** `/templates/:templateId` - pushNotificationRoutes.ts
- **PUT** `/templates/:templateId` - pushNotificationRoutes.ts
- **DELETE** `/templates/:templateId` - pushNotificationRoutes.ts
- **GET** `/vapid-key` - pushNotificationRoutes.ts
- **POST** `/test` - pushNotificationRoutes.ts
- **POST** `/subscription` - pushNotificationRoutes.ts
- **GET** `/subscriptions` - pushNotificationRoutes.ts
- **DELETE** `/subscription/:subscriptionId` - pushNotificationRoutes.ts
- **POST** `/bulk` - pushNotificationRoutes.ts
- **POST** `/templates` - pushNotificationRoutes.ts
- **GET** `/templates` - pushNotificationRoutes.ts
- **GET** `/templates/:templateId` - pushNotificationRoutes.ts
- **PUT** `/templates/:templateId` - pushNotificationRoutes.ts
- **DELETE** `/templates/:templateId` - pushNotificationRoutes.ts
- **GET** `/vapid-key` - pushNotificationRoutes.ts
- **POST** `/test` - pushNotificationRoutes.ts
- **POST** `/` - ratingRoutes.ts
- **GET** `/trends` - ratingRoutes.ts
- **POST** `/` - ratingRoutes.ts
- **GET** `/trends` - ratingRoutes.ts
- **GET** `/global` - searchRoutes.ts
- **GET** `/global` - searchRoutes.ts
- **POST** `/upload` - voucherRoutes.ts
- **POST** `/batch` - voucherRoutes.ts
- **GET** `/statistics` - voucherRoutes.ts
- **POST** `/upload` - voucherRoutes.ts
- **POST** `/batch` - voucherRoutes.ts
- **GET** `/statistics` - voucherRoutes.ts

### Payments (46 endpoints - 11.0%)

- **GET** `/my-deposits` - depositRoutes.ts
- **POST** `/:depositId/approve` - depositRoutes.ts
- **POST** `/:depositId/reject` - depositRoutes.ts
- **GET** `/:depositId` - depositRoutes.ts
- **GET** `/my-deposits` - depositRoutes.ts
- **POST** `/:depositId/approve` - depositRoutes.ts
- **POST** `/:depositId/reject` - depositRoutes.ts
- **GET** `/:depositId` - depositRoutes.ts
- **GET** `/voucher/:depositId` - imagesRoutes.ts
- **GET** `/voucher/:depositId` - imagesRoutes.ts
- **PUT** `/methods/:paymentMethodId/default` - paymentRoutes.ts
- **GET** `/voucher/:depositId/presigned-url` - paymentRoutes.ts
- **PUT** `/methods/:paymentMethodId/default` - paymentRoutes.ts
- **GET** `/voucher/:depositId/presigned-url` - paymentRoutes.ts
- **GET** `/payments/statistics` - paymentSystemRoutes.ts
- **GET** `/payments/deposit-stats` - paymentSystemRoutes.ts
- **GET** `/payments/pending-deposits` - paymentSystemRoutes.ts
- **GET** `/payments/pending-withdrawals` - paymentSystemRoutes.ts
- **POST** `/deposit` - paymentSystemRoutes.ts
- **GET** `/my-deposits` - paymentSystemRoutes.ts
- **GET** `/payments/pending-deposits` - paymentSystemRoutes.ts
- **PUT** `/payments/verify-deposit/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/pending-withdrawals` - paymentSystemRoutes.ts
- **PUT** `/payments/process-withdrawal/:withdrawalId` - paymentSystemRoutes.ts
- **GET** `/payments/check-duplicate/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/deposit-info/:depositId` - paymentSystemRoutes.ts
- **GET** `/voucher/:depositId/presigned-url` - paymentSystemRoutes.ts
- **GET** `/payments/statistics` - paymentSystemRoutes.ts
- **GET** `/payments/deposit-stats` - paymentSystemRoutes.ts
- **GET** `/payments/pending-deposits` - paymentSystemRoutes.ts
- **GET** `/payments/pending-withdrawals` - paymentSystemRoutes.ts
- **POST** `/deposit` - paymentSystemRoutes.ts
- **GET** `/my-deposits` - paymentSystemRoutes.ts
- **GET** `/payments/pending-deposits` - paymentSystemRoutes.ts
- **PUT** `/payments/verify-deposit/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/pending-withdrawals` - paymentSystemRoutes.ts
- **PUT** `/payments/process-withdrawal/:withdrawalId` - paymentSystemRoutes.ts
- **GET** `/payments/check-duplicate/:depositId` - paymentSystemRoutes.ts
- **GET** `/payments/deposit-info/:depositId` - paymentSystemRoutes.ts
- **GET** `/voucher/:depositId/presigned-url` - paymentSystemRoutes.ts
- **GET** `/:depositId` - voucherRoutes.ts
- **GET** `/:depositId/integrity` - voucherRoutes.ts
- **DELETE** `/:depositId` - voucherRoutes.ts
- **GET** `/:depositId` - voucherRoutes.ts
- **GET** `/:depositId/integrity` - voucherRoutes.ts
- **DELETE** `/:depositId` - voucherRoutes.ts

### Ratings (6 endpoints - 1.4%)

- **PUT** `/:ratingId` - ratingRoutes.ts
- **POST** `/:ratingId/helpful` - ratingRoutes.ts
- **POST** `/:ratingId/report` - ratingRoutes.ts
- **PUT** `/:ratingId` - ratingRoutes.ts
- **POST** `/:ratingId/helpful` - ratingRoutes.ts
- **POST** `/:ratingId/report` - ratingRoutes.ts

### Search (4 endpoints - 1.0%)

- **GET** `/conversations/search` - chatRoutes.ts
- **GET** `/conversations/search` - chatRoutes.ts
- **POST** `/advanced-search` - musicianSearchRoutes.ts
- **POST** `/advanced-search` - musicianSearchRoutes.ts

### Users (24 endpoints - 5.7%)

- **POST** `/create-user` - adminAuthRoutes.ts
- **POST** `/create-user` - adminAuthRoutes.ts
- **PUT** `/update/:userEmail` - authRoutes.ts
- **GET** `/validate-number/:userEmail` - authRoutes.ts
- **POST** `/add-event/:userEmail` - authRoutes.ts
- **DELETE** `/delete/:userEmail` - authRoutes.ts
- **PUT** `/update/:userEmail` - authRoutes.ts
- **GET** `/validate-number/:userEmail` - authRoutes.ts
- **POST** `/add-event/:userEmail` - authRoutes.ts
- **DELETE** `/delete/:userEmail` - authRoutes.ts
- **GET** `/users` - chatRoutes.ts
- **GET** `/users` - chatRoutes.ts
- **GET** `/user` - hiringRoutes.ts
- **GET** `/user` - hiringRoutes.ts
- **POST** `/send/:userId` - pushNotificationRoutes.ts
- **POST** `/send/:userId` - pushNotificationRoutes.ts
- **GET** `/user/:userId/:category` - ratingRoutes.ts
- **GET** `/user/:userId/:category/stats` - ratingRoutes.ts
- **GET** `/user/:userId/:category/helpful` - ratingRoutes.ts
- **GET** `/user/:userId/:category` - ratingRoutes.ts
- **GET** `/user/:userId/:category/stats` - ratingRoutes.ts
- **GET** `/user/:userId/:category/helpful` - ratingRoutes.ts
- **GET** `/users` - searchRoutes.ts
- **GET** `/users` - searchRoutes.ts

## 🏗️ Estructuras de Datos

### chatRoutes.ts

- Message

### depositRoutes.ts

- BankDeposit

### hiringRoutes.ts

- HiringRequest

### imagesRoutes.ts

- ImageUploadResult

### musicianRequestRoutes.ts

- MusicianRequest

### notificationRoutes.ts

- Notification

### optimizationRoutes.ts

- CacheStats

### paymentRoutes.ts

- PaymentMethod

### paymentSystemRoutes.ts

- BankAccount

### pushNotificationRoutes.ts

- PushSubscription

### ratingRoutes.ts

- Rating

