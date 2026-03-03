// API end points
export const API_ENDPOINTS = {
    appEditions: '/wp-json/wp/v2/metro-app-editions?metro_app_content=1',
    trendingVideos: '/wp-json/videos/trending-commercial?per_page=50&fields=id,headline',
    videosSearch: '/wp-json/videos/search',
    videosSearchInvalid: '/wp-json/videos/search?s=xyzinvalidquery123456789',
    horoscopes: '/wp-json/metro-horoscopes/daily',
    invalidEndpoint: '/wp-json/invalid-endpoint'
};

// API test data
export const ZODIAC_SIGNS = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
];