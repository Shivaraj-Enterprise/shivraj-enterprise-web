export const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJxWwqylXP4DsRZgmbPfacN6M";
export const reviewRequest = "Thank you for working with Shivraj Enterprise. Would you share an honest review of your experience with our industrial manpower services? " + REVIEW_URL;
export const whatsappEnquiry = (message: string) => `https://wa.me/919998498311?text=${encodeURIComponent(message)}`;
export const quoteEnquiry = (message: string) => `/contact?inquiry=quote&message=${encodeURIComponent(message)}`;

export const serviceEnquiry = (service: string, area?: string) => `Hello Shivraj Enterprise, I need ${service}${area ? ` in ${area}` : " for my factory"}. Location: ${area ?? ""}; Workers: ; Shift: ; Start date: . Please confirm availability and quotation.`;