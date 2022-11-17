export async function sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export function groupArrayBy(array, key) {
    return array.reduce((returnVal, currentItem) => {
        (returnVal[currentItem[key]] = returnVal[currentItem[key]] || []).push(currentItem);
        return returnVal;
    }, {});
}

export function isEmpty(list) {
    if (!list || list.length === 0) {
        return true;
    }
    return false;
}

export function escape(unsafe) {
    return `${unsafe}`.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
