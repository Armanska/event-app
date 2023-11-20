import {ChakraProvider} from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import EventPage from './pages/EventPage';
import EventsPage from './pages/EventsPage';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import DataContextProvider from "./components/DataContextProvider.jsx";


const router = createBrowserRouter([
    {
    path: '/',
    element: <EventsPage/>,
    },
    {
    path: '/event/:eventId',
    element: <EventPage/>,
    },
    ]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <DataContextProvider>
                <RouterProvider router={router}/>
            </DataContextProvider>
        </ChakraProvider>
    </React.StrictMode>,
);
