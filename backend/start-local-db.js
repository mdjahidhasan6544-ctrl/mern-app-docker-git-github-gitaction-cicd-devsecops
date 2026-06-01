const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
    try {
        console.log('🔄 Starting Local MongoDB Server...');
        const mongod = await MongoMemoryServer.create({ instance: { port: 27017 }});
        
        console.log(`✅ MongoDB Memory Server running locally!`);
        console.log(`🔗 Connection URI: ${mongod.getUri()}`);
        console.log(`(Keep this terminal open as long as you want the database to run)`);
        
    } catch (err) {
        if (err.message.includes('EADDRINUSE')) {
            console.error('❌ Port 27017 is already in use by another MongoDB instance or program.');
        } else {
            console.error('❌ Failed to start the memory server:', err);
        }
        process.exit(1);
    }
})();
