const axios = require('axios');
const {agent, checkProxy} = require('./proxy');
const {generateToken} = require('./decode');
const {
    sleep,
    generateCardCode,
    generateRandomIP,
    generateRandomUserName,
    generateRandomDOB,
    generateRandomPhone,
    generateRandomGender,
    generateRandomAddress
} = require('./handlers');
const {sendTelegramMessage} = require('./telegram');
const keep_alive = require('./keep_alive.js');

async function submitData(reties = 4) {
    const address = await generateRandomAddress();
    const content = await generateCardCode();
    const dob = await generateRandomDOB();
    const gender = await generateRandomGender();
    const ipClient = await generateRandomIP();
    const userName = await generateRandomUserName();
    const channelId = 1;
    const phone = await generateRandomPhone();
    const timestamp = Date.now().toString();
    let data = {
        phone,
        content,
        userName,
        dob,
        address,
        gender,
        ipClient,
        channelId,
        timestamp
    };
    const token = await generateToken(data);
    data = {...data, token};
    console.log(data)
    if (reties < 0) {
        return null
    }
    if (reties === 4) {
        await sleep(11000)
    } else {
        await sleep(10000 + reties * 1000)
    }
    try {
        const response = await axios.post('https://khuyenmai.mihaohao.vn/v1/prize-codes/submit-info', data, {
            headers: {
                'Host': 'khuyenmai.mihaohao.vn',
                'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
                'sec-ch-ua-mobile': '?1',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                'sec-ch-ua-platform': 'Android',
                'origin': 'https://khuyenmai.mihaohao.vn',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://khuyenmai.mihaohao.vn/trang-chu',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            },
            httpAgent: agent,
            httpsAgent: agent,
        });
        const status = response.data.Status;
        if ((status !== 4) && (status !== -4) && (status !== 3)) {
            const code = response.data.Message;
            await sendTelegramMessage(code);
        }
        console.log("Kết quả trả về:", response.data);
    } catch (error) {
        if (error.response && (error.response.data.statusCode === 403 || error.response.data.statusCode === 400)) {
            console.log("Lỗi:", error.response.data.statusCode);
            return await submitData(reties - 1)
        }
        console.log("Lỗi:", error);
    }
}

async function runMultipleRequests(requests) {
    const promises = [];
    for (let i = 0; i < requests; i++) {
        promises.push(submitData());
    }
    await Promise.all(promises);
    console.log(`Đã hoàn tất ${requests} luồng, nghỉ ${requests} giây...`);
    await sleep(requests * 1000);
}

async function checkProxyAndRun() {
    while (true) {
        const isProxyWorking = await checkProxy();
        if (isProxyWorking) {
            await runMultipleRequests(20);
        } else {
            console.error("Proxy không hoạt động. Dừng lại.");
        }
    }
}

checkProxyAndRun();
