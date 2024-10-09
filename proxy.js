require('dotenv').config();
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
function parseProxy(proxy) {
    const [host, port, user, password] = proxy.split(':');
    process.env.PROXY_HOST = host;
    process.env.PROXY_PORT = port;
    process.env.PROXY_USER = user;
    process.env.PROXY_PASSWORD = password;
}

parseProxy(process.env.PROXY);

const proxyHost = process.env.PROXY_HOST;
const proxyPort = process.env.PROXY_PORT;
const proxyUser = process.env.PROXY_USER;
const proxyPassword = process.env.PROXY_PASSWORD;

const proxyUrl = `http://${proxyUser}:${proxyPassword}@${proxyHost}:${proxyPort}`;
const agent = new HttpsProxyAgent(proxyUrl);

async function checkProxy() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json', {
            httpAgent: agent,
            httpsAgent: agent
        });
        console.log(`Địa chỉ IP của bạn qua proxy là: ${response.data.ip}`);
        return true;
    } catch (error) {
        console.error('Lỗi khi kiểm tra proxy:', error.message);
        return false;
    }
}
module.exports = { agent, checkProxy };
