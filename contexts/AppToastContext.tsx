import { ReactNode, createContext, useState } from "react";

export enum ToastType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

export type ToastOptions = {
    duration?: number;
};

interface InitialToastState {
    toastIsShowing: boolean;
    toastMessage?: string;
    toastType?: ToastType;
    toastOptions?: ToastOptions;
}

interface AppToastContextProps extends InitialToastState {
    notifySuccess: (toastMessage: string) => void;
    notifyError: (toastMessage: string) => void;
    notifyWarning: (toastMessage: string) => void;
    notifyInfo: (toastMessage: string) => void;
    hideToast: () => void;
}

interface AppToastProviderProps {
    children: ReactNode;
}

const initialToastState: InitialToastState = {
    toastIsShowing: false,
};

const AppToastContext = createContext<AppToastContextProps>({
    ...initialToastState,
    notifySuccess: () => {},
    notifyError: () => {},
    notifyWarning: () => {},
    notifyInfo: () => {},
    hideToast: () => {},
});

const AppToastProvider = ({ children }: AppToastProviderProps) => {
    const [toastState, setToastState] =
        useState<InitialToastState>(initialToastState);

    const notifySuccess = (toastMessage: string, options?: ToastOptions) => {
        setToastState((prevState) => ({
            ...prevState,
            toastIsShowing: true,
            toastMessage,
            toastType: ToastType.SUCCESS,
            toastOptions: options,
        }));
    };

    const notifyError = (toastMessage: string, options?: ToastOptions) => {
        console.log("notifying...");

        setToastState((prevState) => ({
            ...prevState,
            toastIsShowing: true,
            toastMessage,
            toastType: ToastType.ERROR,
            toastOptions: options,
        }));
    };

    const notifyWarning = (toastMessage: string, options?: ToastOptions) => {
        setToastState((prevState) => ({
            ...prevState,
            toastIsShowing: true,
            toastMessage,
            toastType: ToastType.WARNING,
            toastOptions: options,
        }));
    };

    const notifyInfo = (toastMessage: string, options?: ToastOptions) => {
        setToastState((prevState) => ({
            ...prevState,
            toastIsShowing: true,
            toastMessage,
            toastType: ToastType.INFO,
            toastOptions: options,
        }));
    };

    const hideToast = () => {
        setToastState(initialToastState);
    };

    const toastContextValue: AppToastContextProps = {
        ...toastState,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        hideToast,
    };

    return (
        <AppToastContext.Provider value={toastContextValue}>
            {children}
        </AppToastContext.Provider>
    );
};

export { AppToastContext, AppToastProvider };
