import { createContext, useContext } from 'react';

const DataContext = createContext();

// Create a custom context hook
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataContextProvider!");
    }
    return context;
};

export default DataContext;
