export async function sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export function groupArrayBy(array, key) {
    return array.reduce((returnVal, currentItem) => {
        (returnVal[currentItem[key]] = returnVal[currentItem[key]] || []).push(currentItem);
        return returnVal;
    }, {});
}
