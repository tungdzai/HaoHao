const crypto = require("crypto");

async function generateToken(data) {
    let {
        phone,
        content,
        userName,
        dob,
        address,
        gender,
        ipClient,
        channelId,
        timestamp
    } = data;
    let secretKey = "8cbeeffd1a159970592402366b548bb1a942bdee258294675362332398ae2c6e";

    let message = `${phone}|${content}|${userName}|${dob}|${address}|${gender}|${ipClient}|${channelId}:${timestamp}`;

    return crypto.createHmac('sha256', secretKey)
        .update(message)
        .digest('hex');
}

module.exports = { generateToken };
