/**
 * 
 * @param {*} imgEl image element or base64 encoded image 
 * @param {*} borderPercent Percent of the border to analyze
 * @returns object with channels r, g, b, a
 */
export default async function getAverageRGB(input, borderPercent = 10, sampleStep = 1) {
    const defaultRGB = { r: 0, g: 0, b: 0, a: 255 };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return defaultRGB;

    let imgEl;
    if (typeof input === 'string') {
        // Handle base64 input
        imgEl = new Image();
        imgEl.src = input;
        // Wait for image to load
        if (!imgEl.complete) {
            return new Promise((resolve) => {
                imgEl.onload = () => resolve(getAverageRGB(imgEl, borderPercent, sampleStep));
                imgEl.onerror = () => resolve(defaultRGB);
                return;
            });
        }
    } else {
        imgEl = input;
    }

    const width = canvas.width = imgEl.naturalWidth || imgEl.width;
    const height = canvas.height = imgEl.naturalHeight || imgEl.height;
    context.drawImage(imgEl, 0, 0);

    let data;
    try {
        data = context.getImageData(0, 0, width, height).data;
    } catch (e) {
        console.error('Security error: unable to access image data');
        return defaultRGB;
    }

    const borderWidth = Math.floor(width * borderPercent / 100);
    const borderHeight = Math.floor(height * borderPercent / 100);
    let rgb = { r: 0, g: 0, b: 0, a: 0 };
    let count = 0;

    // Sample top and bottom borders
    for (let x = 0; x < width; x += sampleStep) {
        for (let y = 0; y < borderHeight; y += sampleStep) {
            const i = (y * width + x) * 4;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
            rgb.a += data[i + 3];
            count++;
        }
        for (let y = height - borderHeight; y < height; y += sampleStep) {
            const i = (y * width + x) * 4;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
            rgb.a += data[i + 3];
            count++;
        }
    }

    // Sample left and right borders (excluding corners)
    for (let y = borderHeight; y < height - borderHeight; y += sampleStep) {
        for (let x = 0; x < borderWidth; x += sampleStep) {
            const i = (y * width + x) * 4;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
            rgb.a += data[i + 3];
            count++;
        }
        for (let x = width - borderWidth; x < width; x += sampleStep) {
            const i = (y * width + x) * 4;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
            rgb.a += data[i + 3];
            count++;
        }
    }

    if (count === 0) return defaultRGB;

    return {
        r: Math.floor(rgb.r / count),
        g: Math.floor(rgb.g / count),
        b: Math.floor(rgb.b / count),
        a: Math.floor(rgb.a / count),
    };
}