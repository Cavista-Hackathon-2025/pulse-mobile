import React, { ReactNode, createContext, useState } from 'react';

interface AppState {
  isLoading: boolean;
  loadingText: string;
  nestedModalActive: boolean;
  statusBarColor: string;
}

interface AppStateContextProps extends AppState {
  setIsLoading: (value: boolean) => void;
  setLoadingText: (value: string) => void;
  setNestedModalActive: (value: boolean) => void;
  setStatusBarColor: (value: string) => void;
}

interface AppStateProviderProps {
  children: ReactNode;
}

const initialState: AppState = {
  isLoading: false,
  loadingText: '',
  nestedModalActive: false,
  statusBarColor: 'white',
};

const AppStateContext = createContext<AppStateContextProps>({
  ...initialState,
  setIsLoading: () => {},
  setLoadingText: () => {},
  setNestedModalActive: () => {},
  setStatusBarColor: () => {},
});

const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, setState] = useState<AppState>(initialState);

  const setIsLoading = (value: boolean) => {
    setState((prevState) => ({ ...prevState, isLoading: value }));
  };

  const setLoadingText = (value: string) => {
    setState((prevState) => ({ ...prevState, loadingText: value }));
  };

  const setNestedModalActive = (value: boolean) => {
    setState((prevState) => ({ ...prevState, nestedModalActive: value }));
  };

  const setStatusBarColor = (value: string) => {
    setState((prevState) => ({ ...prevState, statusBarColor: value }));
  };

  const value: AppStateContextProps = {
    ...state,
    setIsLoading,
    setLoadingText,
    setNestedModalActive,
    setStatusBarColor,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export { AppStateContext, AppStateProvider };
