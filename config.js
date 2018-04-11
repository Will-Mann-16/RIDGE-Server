'use strict';

var saltRounds = 8;
var secretKey = "vauxhGXfq9G7QamWi2eCevukZ9ZPyKSZHwgzGZ1ldw1Q6xYkMX5zOhOXBGQhMEN";
var expirationTime = 60 * 60 * 24 * 7;

module.exports = {
    saltRounds: saltRounds,
    secretKey: secretKey,
    expirationTime: expirationTime
};
