const { isValidString } = require("./validator");

function convertDate2Timestamp(datetime) {
    if (isValidString(datetime)) {
        return Math.floor(Date.parse(datetime) / 1000.0);
    } else if (datetime && "object" === typeof datetime) {
        return Math.floor(datetime.getTime() / 1000.0);
    }
    return 0;
}

function convertTimestamp2Date(ts) {
    return new Date(ts * 1000);
}

function convertTimeRangePeriod2Timestamp(time_range_period) {
    let re = /(\d+)([mhdM])/;
    if (!re.test(time_range_period)) {
        return 0;
    }
    let arr = time_range_period.match(re);
    if (3 > arr.length) {
        return 0;
    }
    const time_length = parseInt(arr[1]);
    const time_unit = arr[2];
    let diff_ts = 0;

    switch (time_unit) {
        case "m":
            // Minute
            diff_ts = time_length * 60;
            break;
        case "h":
            // Hour
            diff_ts = time_length * 60 * 60;
            break;
        case "d":
            // Day
            diff_ts = time_length * 60 * 60 * 24;
            break;
        case "M":
            // Month
            diff_ts = time_length * 60 * 60 * 24 * 30;
            break;
    }
    return diff_ts;
}

function formatDate(date) {
    let ret = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    }).format(new Date(date));
    return ret;
}

function getPastDate(seconds) {
    let now = new Date();
    let now_ts = convertDate2Timestamp(now);
    let past_ts = now_ts - seconds;
    let past = convertTimestamp2Date(past_ts);
    return past;
}

module.exports = {
    convertDate2Timestamp,
    convertTimestamp2Date,
    convertTimeRangePeriod2Timestamp,
    formatDate,
    getPastDate,
};
