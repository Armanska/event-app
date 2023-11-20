import React, {useState, useEffect} from 'react';
import {
        Heading, 
        Center, 
        Box, 
        Button, 
        useToast, 
        Input, 
        Select, 
        Grid, 
        Image, 
        GridItem, 
        Text,
        Badge
    } from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import AddEventForm from './AddEventForm';
import {useDataContext} from "../components/DataContext.jsx"; 

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false); 
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategory, setFilteredCategory] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const {categories} = useDataContext();


        const fetchEvents = async() => {
        try {
            const response = await fetch("http://localhost:3000/events");
            const events = await response.json()
            setEvents(events); 
            setFilteredEvents(events);
        }   catch(error) {
            console.error("Error fetching events:", error); 
        } 
    }

     // Fetch events when the component mounts
   useEffect(() => {
        fetchEvents();
    }, []);

    const getCategoryNameById = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "";
    };

        const handleSearch = async() => {
        try {
            const response = await fetch(`http://localhost:3000/events?q=${searchTerm}`);
        const filteredEvents = await response.json();
        setFilteredEvents(filteredEvents);
        }   catch(error) {
            console.error("Error searching events:", error); 
        } 
    }
      
        const handleCategoryFilter = async() => {
        try { 
            const response = await fetch(`http://localhost:3000/events?categoryIds_like=${filteredCategory}`);
        const filteredEvents = await response.json()
        setFilteredEvents(filteredEvents);
        }   catch(error) {
        console.error("Error filtering events:", error); 
        } 
    }
        
    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const handleFormSubmit = async (formData) => {
        // Convert createdBy to a number if it's not empty
        const createdByNumber = formData.createdBy ? Number(formData.createdBy) : "";

        try {
            // Send the new event data to the server and get the response
            const response = await fetch("http://localhost:3000/events", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdBy: createdByNumber, // Ensure createdBy is a number
                    categoryIds: formData.categoryIds.map(Number), // Ensure categoryIds is an array of numbers
                }),
            });

            if (response.ok) {
                // If the request is successful, do nothing here
                // The new event will be added to the events array in the callback from AddEventForm

                // Close the form
                closeForm();

                fetchEvents();


                // Display a success toast
                toast({
                    title: "Event Created",
                    description: "The new event has been successfully created.",
                    status: "success",
                    duration: 3000, 
                    isClosable: true,
                });
            
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <Box w="100vw" p={8} bg="teal">
           <Center> <Heading fontSize={{base:"2rem", md:"3rem"}} p={4} color="beige"> List of events </Heading> </Center>
            <Center><Button m={2} w={{base:"40vw", lg:"20vw", xl:"10vw"}} onClick={openForm}>Add Event</Button> </Center>
            <Center><Input
                m={2}
                w={{base:"60vw", md:"50vw", lg:"40vw", xl:"35vw"}}
                bg="white"
                type="text"
                placeholder="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button m={2} w={{base:"20vw", md:"15vw", lg:"10vw"}} onClick={handleSearch}>Search </Button></Center>

           <Center> <Select 
                m={2}
                w={{base:"60vw", md:"50vw", lg:"40vw", xl:"35vw"}}
                bg="white"
                value={filteredCategory}
                onChange={(e) => setFilteredCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                <option value="1">Sports</option>
                <option value="2">Games</option>
                <option value="3">Relaxation</option>
            </Select> 
            <Button  m={2} w={{base:"20vw", md:"15vw", lg:"10vw"}} onClick={handleCategoryFilter}>Apply </Button> </Center>
            <Grid
                    templateColumns={{base:"1fr", md:"repeat(2, 1fr)", lg:"repeat(3, 1fr)", xl:"repeat(4, 1fr)"}}
                    gap={8} >
                {filteredEvents.map((event) => (
                    <GridItem
                        key={event.id} 
                        mt={4}
                        borderRadius="10"
                        boxShadow="md"
                        bg="white"
                        cursor="pointer"
                    >
                            <Link to={`/event/${event.id}`}>
                                <Box>
                                    <Image width="100vw" height="40vh" borderTopRadius="10" object-fit="cover"
                                         src={event.image} alt={event.title}/>
                                </Box>
                                <Center><Box p={2}>
                                   <Center> <Heading as="h2" size="md" p={1}>{event.title}</Heading> </Center>
                                    <Text align="center" p={1} fontStyle="italic">{event.description} </Text>
                                    <Text align="center" p={1}>Start Time: {event.startTime}</Text>
                                    <Text align="center" p={1}>End Time: {event.endTime}</Text>
                                    <Text align="center" p={1}>
                                        Categories: </Text>
                                        <Center><Badge colorScheme="teal" m={1} mb={2} fontSize={16}>{" "}
                                        {Array.isArray(event.categoryIds)
                                            ? event.categoryIds.map((categoryId) =>
                                                getCategoryNameById(categoryId)
                                            ).join("/ ")
                                            : getCategoryNameById(event.categoryIds)}
                                            </Badge></Center>
                                    
                                </Box></Center>
                            </Link>
                            </GridItem>

                ))}

            </Grid>

            {isFormOpen && (
                <AddEventForm onClose={closeForm} onSubmit={handleFormSubmit}/>
            )}
        </Box>
    );
};

export default EventsPage;