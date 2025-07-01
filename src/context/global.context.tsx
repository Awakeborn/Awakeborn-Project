import React, { createContext, useContext, useState, ReactNode, Children } from 'react';

type GlobalContextType = {
    value: {
        id: string;
        user_name: string;
        user_birth: string;
        wallet_address: string;
        credit_balance: number;
        connect_state: boolean;
        avatar_url: string;
        inserted_at: string;
        credit_price: number;
    };
    setValue: React.Dispatch<React.SetStateAction<{ id: string; user_name: string; user_birth: string; wallet_address: string; credit_balance: number; connect_state: boolean; avatar_url: string; inserted_at: string; credit_price: number }>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<{ id: string; user_name: string; user_birth: string; wallet_address: string; credit_balance: number; connect_state: boolean; avatar_url: string; inserted_at: string; credit_price: number; }>({
        id: '',
        user_name: '',
        user_birth: '',
        wallet_address: '',
        credit_balance: 0,
        connect_state: false,
        avatar_url: '',
        inserted_at: '',
        credit_price: 10
    });

    return (
        <GlobalContext.Provider value={{ value, setValue }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider!");
    }
    return context;
}