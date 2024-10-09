function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateCardCode() {
    const letters = "ABCDEFGHJKPQRSTUVXYZ";
    const numbers = "23456789";

    function getRandomElement(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    let cardCodeArray = [];
    for (let i = 0; i < 4; i++) {
        cardCodeArray.push(getRandomElement(letters));
    }
    for (let i = 0; i < 3; i++) {
        cardCodeArray.push(getRandomElement(numbers));
    }
    for (let i = cardCodeArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardCodeArray[i], cardCodeArray[j]] = [cardCodeArray[j], cardCodeArray[i]];
    }
    return cardCodeArray.join('');
}

async function generateRandomIP() {
    function getRandomOctet() {
        return Math.floor(Math.random() * 256);
    }

    return `${getRandomOctet()}.${getRandomOctet()}.${getRandomOctet()}.${getRandomOctet()}`;
}

async function generateRandomUserName() {
    const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Võ", "Đặng"];
    const middleNames = ["Việt", "Thị", "Văn", "Hồng", "Minh", "Quang", "Thanh", "Anh"];
    const firstNames = ["Tùng", "Hùng", "Lan", "Anh", "Bình", "Dũng", "Sơn", "Phương"];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    return `${getRandomElement(lastNames)} ${getRandomElement(middleNames)} ${getRandomElement(firstNames)}`;
}

async function generateRandomDOB() {
    const minYear = 1980;
    const maxYear = 2005;
    return Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
}

async function generateRandomPhone() {
    const prefixes = ["096", "097", "098", "086", "032", "034", "035", "036"];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateRandomDigits(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    return `${getRandomElement(prefixes)}${generateRandomDigits(7)}`;
}

async function generateRandomGender() {
    const genders = ["Nam", "Nữ"];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    return getRandomElement(genders);
}

async function generateRandomAddress() {
    const addresses = [
        "Hà Nội",
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "Huế",
        "Nha Trang",
        "Vũng Tàu",
        "Quảng Ninh",
        "Bắc Ninh",
        "Hoà Bình"
    ];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    return getRandomElement(addresses);
}

module.exports = {
    sleep,
    generateCardCode,
    generateRandomIP,
    generateRandomUserName,
    generateRandomDOB,
    generateRandomPhone,
    generateRandomGender,
    generateRandomAddress
};
