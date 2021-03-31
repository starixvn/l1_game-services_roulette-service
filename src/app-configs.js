export default {
    hostingPort: 8003,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2-api.lumigame.com",
        authUrl: "http://l2-auth.lumigame.com",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enabledApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://localhost:8080/api",
        auth: {
            url: "http://l2-auth.lumigame.com",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://127.0.0.1:27017",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "https://5b1908b2cdc3471a8238082527a23379@sentry.lumigame.com/20",
        logIdentifier: "roulette",
        env: "DEV",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: ["http://localhost:7456", "http://l2-games.lumigame.com", "http://l2-admin2.lumigame.com", "http://localhost:7000"],
};
