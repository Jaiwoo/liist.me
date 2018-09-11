'use strict';

// Production Database
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/liist-me';

// Test Database
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-liist-me';

// PORT
exports.PORT = process.env.PORT || 8080;