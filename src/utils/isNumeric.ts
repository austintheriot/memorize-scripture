// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
export const isNumeric = (str: string): boolean => {
	if (typeof str != 'string') return false;
	return !isNaN((str as unknown) as number) && !isNaN(parseFloat(str));
};
