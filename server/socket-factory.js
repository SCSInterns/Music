const { Server } = require("socket.io");

let socketIOSingleton = null;

async function socketIOFactory(serverInstance) {
    if (!socketIOSingleton) {
        socketIOSingleton = new Server(serverInstance,
            {
                cors: {
                    origin: "http://localhost:5000/",
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
