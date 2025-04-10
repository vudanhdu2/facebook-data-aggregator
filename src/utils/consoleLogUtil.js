
export const consoleLogUtil = (message, ...data) => {
    if (process.env.NODE_ENV === 'development') {
        const formattedData = data.map(item => typeof item === 'object' ? item : item);
        console.log(message, ...formattedData);
    }
}