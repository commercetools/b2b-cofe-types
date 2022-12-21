export type WithError<T extends {}> = T & {
    error?: string;
    errorCode?: number;
};
