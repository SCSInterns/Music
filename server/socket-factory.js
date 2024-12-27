const { Server } = require("socket.io");

let socketIOSingleton = null;

async function socketIOFactory(serverInstance) {
    if (!socketIOSingleton) {
        socketIOSingleton = new Server(serverInstance,
            {
                cors: {
                    origin: "https://musicvista.netlify.app/",
                    methods: ["GET", "POST"]
                },
            }
        );
    }
    return socketIOSingleton;
}

module.exports = {
    socketIOFactory,
    get socketIOSingleton() {
        return socketIOSingleton;
    },
};
