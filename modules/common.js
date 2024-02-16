// navigation for settings module
export default function common() {

  const interpolateColor = (value, minValue, maxValue) => {
    const red = 255;
    const green = 255 - Math.round(255 * (value - minValue) / (maxValue - minValue));
    const blue = 51;
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  }

  return {
    interpolateColor
  }
}