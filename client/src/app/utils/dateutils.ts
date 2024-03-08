
export const formattedDate = (isoDate: string) => new Date(isoDate).toISOString().split('T')[0];
