export function shortenText(text, number) {
    if (text.length <= number) {
        return text;
    }
    return text.substring(0, number) + '...';
}
export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Function to get the ordinal suffix for the day
    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // handles 11th, 12th, 13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

// Function to extract file name
export const extractFileNameFromURI = (url) => {
    const fileName = url.split('/uploads/')[1];
    return fileName;
  };
  
