const config = {
    name: "balance",
    aliases: ["bal", "money"],
    description: "Check user's/self money",
    usage: "<reply/tag/none>",
    cooldown: 5,
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "balance.userNoData": "User not found/not ready",
        "balance.selfNoData": "Your data is not ready",
        "balance.result": "Balance: {money}XC"
    },
    "vi_VN": {
        "balance.userNoData": "Người dùng không tìm thấy/chưa sẵn sàng",
        "balance.selfNoData": "Dữ liệu của bạn chưa sẵn sàng",
        "balance.result": "Số dư: {money}XC"
    },
    "ar_SY": {
        "balance.userNoData": "المستخدم غير موجود / غير جاهز",
        "balance.selfNoData": "البيانات الخاصة بك ليست جاهزة",
        "balance.result": "فائض: {money}XC"
    }
}

/** @type {TOnCallCommand} */
function onCall({ message, getLang, xDB }) {
    const { type, mentions } = message;
    const Users = xDB.users;
    let userBalance;
    if (type == "message_reply") {
        const { senderID: TSenderID } = message.messageReply;

        userBalance = Users.getMoney(TSenderID);
        if (userBalance == null) return message.reply(getLang("balance.userNoData"));
    } else if (Object.keys(mentions).length >= 1) {
        let msg = "";

        for (const TSenderID in mentions) {
            userBalance = Users.getMoney(TSenderID);
            msg += `${mentions[TSenderID].replace(/@/g, '')}: ${global.addCommas(userBalance || 0)}XC\n`;
        }

        return message.reply(msg);
    } else {
        userBalance = Users.getMoney(message.senderID);
        if (userBalance == null) return message.reply(getLang("balance.selfNoData"));
    }

    message.reply(getLang("balance.result", { money: global.addCommas(userBalance) }));
}

export default {
    config,
    langData,
    onCall
}
