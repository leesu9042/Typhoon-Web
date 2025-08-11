

export function classifyTyphoon(windSpeed) {
    if (windSpeed >= 54) return "Super_Strong";
    if (windSpeed >= 44) return "Very_Strong";
    if (windSpeed >= 33) return "Strong";
    if (windSpeed >= 25) return "Normal";
    if (windSpeed >= 17) return "Weak"; // Optional
    return "NotTyphoon";
}