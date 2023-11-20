import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    useToast, 
    Center, 
    SimpleGrid,
    Badge
} from '@chakra-ui/react';
import EditEventForm from './EditEventForm';
import {useDataContext} from "../components/DataContext.jsx";

const EventPage = () => {
    const {eventId} = useParams();
    const [event, setEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); 
    const toast = useToast();
    const {categories, users} = useDataContext();


    const fetchEvent = async() => {
        try {
            const response = await fetch(`http://localhost:3000/events/${eventId}`);
            const event = await response.json()
            setEvent(event); 
        }   catch(error) {
            console.error("Error fetching events:", error); 
        } 
    }

    useEffect(() => {
        // Fetch the single event when the component mounts and when eventId changes
        fetchEvent();
    }, [eventId]);


    const getCategoryNameById = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "";
    };

    const getUserNameById = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.name : "";
    };

    const getUserImageById = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.image : "";
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const handleEditSubmit = (editedData) => {
        // This function will be called when the user submits the edit form
        setEvent(editedData);
        fetchEvent();
    };

    const handleDeleteClick = () => {
        setIsDeleting(true); // Show the delete confirmation modal
    };

    const handleCloseDelete = () => {
        setIsDeleting(false); // Close the delete confirmation modal
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/events/${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast({
                    title: 'Event Deleted',
                    description: 'The event has been successfully deleted.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                setIsDeleting(false);

                // Redirect to the EventsPage after successful delete
                window.location.href = "/"; 
              

            } 

        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the event.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });

            console.error('Error deleting event:', error);
            setIsDeleting(false);
        }
    };

    if (!event) {
        return <p> Loading...</p>;
    }


    return (
        <Box pl={10} pr={10} bg="teal">
        <Center><Box 
                width={{base:"80vw", md:"70vw", lg:"60vw", xl:"50vw"}} 
                pb={6} 
                bg="white" 
                m={{md:"10"}} 
                mt={{base:"10"}} 
                mb={{base:"10"}} 
                borderRadius={10}>
            <Image
                display="block"
                borderTopRadius={10}
                w="100%" 
                h={{base:"40vh", md:"50vh", lg:"60vh"}}
                src={event.image} 
                alt={event.title}/>
            <SimpleGrid columns={{base:1, lg:2}} spacing={4}>
            <Box m={4}><Heading as="h2" size="lg" m={2}>{event.title}</Heading>
            <Text m={2} fontStyle="italic">{event.description}</Text>
            <Text m={2}> Start Time: {event.startTime}</Text>
            <Text m={2}> End Time: {event.endTime}</Text>
            <SimpleGrid columns={{base:1, lg:2}} spacing={2}>
                <Box><Text fontWeight="semibold" m={2} mb={0}> Created By:</Text>
                <Text m={2}>{event.createdBy ? getUserNameById(event.createdBy) : "Unknown User"}
                        {event.createdBy 
                        ? <Image
                        display="block"
                        margin= {2}
                        width={{base:"30%", md:"25%", lg:"85%", xl:"70%"}}
                        borderRadius={100}
                        src={getUserImageById(event.createdBy)}
                        alt={getUserNameById(event.createdBy)}/>
                        : ""}

            </Text> </Box>
            <Box><Text fontWeight="semibold" m={2} mt={1}>
                    Categories:  </Text> 
                    <Badge colorScheme="teal" m={1} fontSize={16}>
                    {Array.isArray(event.categoryIds)
                        ? event.categoryIds.map((categoryId) =>
                            getCategoryNameById(categoryId)
                        ).join("/ ")
                        : getCategoryNameById(event.categoryIds)}
                        </Badge></Box>
                        </SimpleGrid>                      
            </Box>
            
            <Box  m={4}>
          <Box m={1} > <Button m={2} w={{base:"70vw", md:"60vw", lg:"20vw", xl:"12vw"}} onClick={handleEditClick}>Edit</Button></Box>
           <Box  m={1} > <Button m={2} w={{base:"70vw", md:"60vw", lg:"20vw", xl:"12vw"}} onClick={handleDeleteClick} colorScheme="red">Delete</Button> </Box>
           <Box  m={1} > <Button as={Link} to="/"  m={2} width={{base:"70vw", md:"60vw", lg:"20vw", xl:"12vw"}} colorScheme="teal"> Back to All Events </Button> </Box>
        
           </Box>
            </SimpleGrid>

            {/* Render the edit form modal when isEditing is true */}
            {isEditing && (
                <EditEventForm
                    event={event}
                    isOpen={isEditing}
                    onClose={handleCloseEdit}
                    onSubmit={handleEditSubmit}
                />
            
            )}

            {/* Render the delete confirmation modal when isDeleting is true */}
            {isDeleting && (
                <Modal isOpen={isDeleting} onClose={handleCloseDelete}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>Confirm Delete </ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            Are you sure you want to delete this event? This action cannot be undone.
                        </ModalBody>
                        <ModalFooter>
                            <Button m={1} colorScheme="red" onClick={handleConfirmDelete}>Delete</Button>
                            <Button m={1} onClick={handleCloseDelete}> Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        
        </Box>
        </Center>
        </Box>
    );
};

export default EventPage;
