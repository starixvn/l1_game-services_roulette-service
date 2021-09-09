export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2_game_api_uat:5000",
        authUrl: "http://l2_auth_api_uat:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        placeBetTimeout: 4500,
        requestTimeout: 10000, // 10s
        enabledApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://l2_game_server_uat:5000/api",
        auth: {
            url: "http://l2_auth_api_uat:5000",
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
        url: "mongodb://lmn_backend:LmnBackend%4022027@10.99.99.187:37201/?replicaSet=SabaL2UAT",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "http://8ac47fca6d3e4a41908896a64ef201ac@10.2.189.51:9009/53",
        logIdentifier: "roulette",
        env: "UAT",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: [
        "http://l2uat.sgamesuat.net",
        "https://l2uat.sgamesuat.net",
        "http://l2uatadm.sgamesuat.net",
        "https://l2uatadm.sgamesuat.net",
        "http://l2uatm.sgamesuat.net",
        "https://l2uatm.sgamesuat.net",
    ],
    metrics: {
        enable: true,
        secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
    },
};
