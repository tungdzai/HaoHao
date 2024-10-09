const axios = require('axios');
const {agent, checkProxy} = require('./proxy');
const {generateToken} = require('./decode');
const {
    sleep,
    generateRandomIP,
    generateRandomUserName,
    generateRandomDOB,
    generateRandomGender,
    generateRandomAddress
} = require('./handlers');
const {sendTelegramMessageNTC,botNTC} = require('./telegram');
const keep_alive = require('./keep_alive.js');

async function luckyDraw(phoneNumber, content) {
    const data = {
        "keyword": "HAO",
        "phone": phoneNumber,
        "code": content
    }
    try {
        const response = await axios.post('https://khuyenmai.mihaohao.vn/v1/prize-codes/lucky-draw', data, {
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
            httpsAgent: agent
        });
        return response.data;

    } catch (error) {
        const messages = `Lỗi vòng quy may mắn ${phoneNumber} ${content} ${error}`;
        await sendTelegramMessageNTC(messages);
        console.error(messages);
    }

}
async function payments(phoneNumber, code, amount) {
    const data = {
        "amount": amount,
        "channel": 1,
        "phoneNumber": phoneNumber,
        "code": code,
        "programType": 1
    }

    try {
        const response = await axios.post('https://khuyenmai.mihaohao.vn/v1/payments/multi-channel', data, {
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
            httpsAgent: agent
        });
        return response.data;

    } catch (error) {
        const messages = `Lỗi nạp thẻ ${phoneNumber} ${code} ${amount} ${error}`;
        await sendTelegramMessageNTC(messages);
        console.error(messages);
    }

}

async function main(phone,content,reties = 4) {
    let data = {
        phone:phone,
        content:content,
        userName:await generateRandomUserName(),
        dob: await generateRandomDOB(),
        address:await generateRandomAddress(),
        gender:await generateRandomGender(),
        ipClient:await generateRandomIP(),
        channelId:1,
        timestamp:Date.now().toString()
    };
    const token = await generateToken(data);
    data = {...data, token};
    console.log(data)
    if (reties < 0) {
        return null
    }
    if (reties === 4) {
        await sleep(15000)
    } else {
        await sleep(15000 + reties * 1000)
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
        if (status === -4) {
            const phoneInvalid = `Số điện thoại không hớp lệ ${phone}`
            await sendTelegramMessageNTC(phoneInvalid);
        } else if (status === 3) {
            const codeUsed = `Mã được sử dụng ${content}`;
            await sendTelegramMessageNTC(codeUsed);

        } else if (status === 4) {
            const wrongCode = `Mã không hợp lệ ${content}`
            await sendTelegramMessageNTC(wrongCode);
        } else if (status === -1) {
            const block = `Số điện thoại bị chặn ${phone}`
            await sendTelegramMessageNTC(block);
        }
        console.log("Kết quả trả về:", response.data);
        if (status === 1) {
            const result = await luckyDraw(phone, content);
            if (result) {
                const amount = result.Award.AmountTopup;
                const statusTopUp = await payments(phone, content, amount);
                if (statusTopUp.HasWallet) {
                    await sendTelegramMessageNTC(`${phone} nạp thành công ${amount}`);
                } else {
                    await sendTelegramMessageNTC(`Nạp không thành công với SĐT: ${phone} với mã code: ${content}`);
                }
            } else {
                await sendTelegramMessageNTC(`Lỗi dữ liệu vòng quay ${phone} với mã code: ${content} `);

            }
        }

    } catch (error) {
        if (error.response && (error.response.data.statusCode === 403 || error.response.data.statusCode === 400)) {
            console.log("Lỗi:", error.response.data.statusCode);
            return await main(phone,content,reties - 1)
        }
        console.log("Lỗi:", error);
    }
}

botNTC.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const lines = text.split('\n');
    for (const line of lines){
        const regex = /^(\d{10})\s+(\w+)$/;
        const match = text.match(regex);
        if (match) {
            const phone = match[1];
            const content = match[2];
            const isProxyWorking = await checkProxy();
            if (isProxyWorking) {
                await main(phone, content);
            } else {
                console.error("Proxy không hoạt động. Dừng lại.");
            }

        } else {
            await botNTC.sendMessage(chatId, 'Vui lòng nhập theo định dạng: <số điện thoại> <mã thẻ>');
        }
    }
});