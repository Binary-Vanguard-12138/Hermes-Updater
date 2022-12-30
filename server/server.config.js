module.exports = {
    apps: [
        {
            name: "SGAdminBackend",
            script: "./server.js",
            watch: true,
            env: {
                PORT: 5000,
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
