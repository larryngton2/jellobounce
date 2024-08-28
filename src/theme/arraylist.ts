/**
 * thanks to @liquidskid1 for the method
 */

let speed = 10;

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

let progress = 0;
const tSpeed = (0.1 / 20) * speed;
export function arraylistGradient() {
    const arraylist = document.getElementById("arraylist");
    if (arraylist == null) return;
    var color1 = window.getComputedStyle(arraylist).getPropertyValue("--gradient-color-1").trim();
    var color2 = window.getComputedStyle(arraylist).getPropertyValue("--gradient-color-2").trim();
    const modules = arraylist.children as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < modules.length; i++) {
        const element = modules[i];
        if (element.id != "module") continue;
        const percentage = 1 - (i / modules.length) + (.5 * Math.sin(.5 * i + progress));;
        const rgb = colorInterpolate(color1, color2, percentage);
        element.style.color = `rgb( ${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    progress += tSpeed;
    if (progress >= Math.PI * 2) {
        progress = 0;
    }
}

export function getRgb(color: string): RGBColor {
    const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      throw new Error(`Invalid color format: ${color}`);
    }
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
}

// https://stackoverflow.com/questions/66123016/interpolate-between-two-colours-based-on-a-percentage-value
export function colorInterpolate(colorA: string, colorB: string, interpolation: number): RGBColor {
    const rgbA = getRgb(colorA);
    const rgbB = getRgb(colorB);
    interpolation = Math.min(1, Math.max(0, interpolation));
    const interpolateComponent = (prop: keyof RGBColor) =>
      Math.round(rgbA[prop] * (1 - interpolation) + rgbB[prop] * interpolation);
    return {
      r: interpolateComponent('r'),
      g: interpolateComponent('g'),
      b: interpolateComponent('b'),
    };
}

setInterval(arraylistGradient, speed)