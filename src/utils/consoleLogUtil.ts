
export const consoleLogUtil = (message : any, ...data : any) => {
    if (process.env.NODE_ENV === 'development') {
        const formattedData = data.map((item : any) => typeof item === 'object' ? item : item);
        console.log(message, ...formattedData);
    }
}