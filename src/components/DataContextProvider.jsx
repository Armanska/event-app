import { useEffect, useState } from 'react';
import DataContext from './DataContext'; 

// Create a custom Provider component
const DataContextProvider = ({ children }) => {
    // State to store categories and users
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch categories and users when the component mounts
    useEffect(() => {
        // Fetch categories and set them using setCategories
        fetch("http://localhost:3000/categories")
            .then((response) => response.json())
            .then((categories) => setCategories(categories))
            .catch((error) => console.error("Error fetching categories:", error));

        // Fetch users and set them using setUsers
        fetch("http://localhost:3000/users")
            .then((response) => response.json())
            .then((users) => setUsers(users))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    // Wrap the children components with the context provider
    return (
        <DataContext.Provider value={{ categories, users }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;
