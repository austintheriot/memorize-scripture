import React, {
  useEffect, createContext, useContext, ReactNode, useCallback,
} from 'react';
import useStateIfMounted from './useStateIfMounted';

const KeyboardUserContext = createContext(false);

interface Props {
  children: ReactNode;
}

function IsKeyboardUserContextProvider({ children }: Props) {
  const [isKeyboardUser, setIsKeyboardUser] = useStateIfMounted(false);

  const setIsKeyboardUserHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      setIsKeyboardUser(true);
      window.removeEventListener('keyup', setIsKeyboardUserHandler);
    }
  }, [setIsKeyboardUser]);

  useEffect(() => {
    window.addEventListener('keyup', setIsKeyboardUserHandler);
    return () => window.removeEventListener('keyup', setIsKeyboardUserHandler);
  });

  return (
    <KeyboardUserContext.Provider value={isKeyboardUser}>
      {children}
    </KeyboardUserContext.Provider>
  );
}

export { IsKeyboardUserContextProvider };

export default function useIsKeyboardUser() {
  return useContext(KeyboardUserContext);
}
