import { useContext, useState } from "react";
import { createContext, ReactNode } from "react";
import { ErrorBoundary } from "~/components/ErrorBoundary/ErrorBoundary";

export type Theme = "dark" | "light";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

export const ThemContext = createContext<ThemeContextType>({
	theme: "dark",
	setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>("dark");

	return (
		<ThemContext.Provider
			value={{
				theme,
				setTheme,
			}}
		>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ThemContext.Provider>
	);
};

export const useTheme = () => {
	return useContext(ThemContext);
};
