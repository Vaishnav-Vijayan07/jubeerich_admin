export const setColorOpacityRGB = (color: string | null) => {
    const rgbaComponents = color?.match(/\d+(\.\d+)?/g);
    if (rgbaComponents && rgbaComponents.length === 4) {
        rgbaComponents[3] = "0.2";
        return `rgba(${rgbaComponents.join(", ")})`;
    }
};