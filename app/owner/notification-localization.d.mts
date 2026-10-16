export type LocalizedNotification = {title:string;body:string};
export function localizeNotification(row: {kind?:string;title?:string;body?:string;payload?:Record<string,unknown>} | null | undefined, locale: "ar" | "en"): LocalizedNotification;
