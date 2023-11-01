export const shortenText = (str, index) => {
    const res = str.substr(0, index) + '...' + str.substr(str.length - index);
    return res;
}