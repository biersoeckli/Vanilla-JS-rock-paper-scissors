const globalLoaderDiv = document.getElementById('global-loader');
const globalContentDiv = document.getElementById('global-content');

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
    return !list || list.length === 0;
}

export function escape(unsafe) {
    return `${unsafe}`.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

export function getLoader() {
    return '<div class="loader"><div></div></div>';
}

export async function loady(loadingFunc) {
    globalLoaderDiv.classList.remove('hidden');
    globalContentDiv.classList.add('hidden');
    await loadingFunc();
    globalLoaderDiv.classList.add('hidden');
    globalContentDiv.classList.remove('hidden');
}
