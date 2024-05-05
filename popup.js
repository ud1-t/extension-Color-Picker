const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');
const copyBtn = document.querySelector('.copyBtn');

btn.addEventListener('click', async () => {
    chrome.storage.sync.get('color', ({ color }) => {
        console.log('color: ', color);
    });
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pickColor,
    }, async (injectionResults) => {
        const [data] = injectionResults;
        if(data.result) {
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            // Make copyBtn visible after selecting the color
            copyBtn.style.visibility = 'visible';
        }
        // console.log(injectionResults);
    });
});

copyBtn.addEventListener('click', async () => {
    const color = colorValue.innerText;
    try {
        await navigator.clipboard.writeText(color);
        // Display a "copied" notification if it doesn't exist already
        if (!document.querySelector('.notification')) {
            const notification = document.createElement('div');
            notification.textContent = 'Copied';
            notification.classList.add('notification');
            document.body.appendChild(notification);
            // Remove the notification after 2 seconds
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }
    } catch (error) {
        console.log(error);
    }
});

async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    } catch (error) {
        console.log('Error picking color:', error);
    }
}
