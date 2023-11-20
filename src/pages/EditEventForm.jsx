import React, { useState } from 'react';
import {
    Input,
    Textarea,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    Checkbox,
    Select,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useDataContext } from '../components/DataContext.jsx';

const EditEventForm = ({ event, isOpen, onClose, onSubmit }) => {
    const { categories, users } = useDataContext();
    const toast = useToast(); 

    const [formData, setFormData] = useState({
        title: event.title || "",
        description: event.description || "",
        categoryIds: event.categoryIds || [], 
        location: event.location || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        createdBy: event.createdBy || "",
        image: event.image || "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const categoryId = Number(name); 
            const updatedCategoryIds = checked
                ? [...formData.categoryIds, categoryId]
                : formData.categoryIds.filter((id) => id !== categoryId);

            setFormData({
                ...formData,
                categoryIds: updatedCategoryIds,
            });
            
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const createdByNumber = formData.createdBy ? Number(formData.createdBy) : "";

        try {
            const response = await fetch(`http://localhost:3000/events/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdBy: createdByNumber,
                }),
            });

            if (response.ok) {
                // If the request is successful, show a success toast
                toast({
                    title: "Event Updated",
                    description: "The event details have been successfully updated.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Update the event data
                onSubmit(formData);
                onClose();

            } else {
                // If the request fails, show an error toast
                toast({
                    title: "Error",
                    description: "An error occurred while updating the event.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });

                console.error("Error updating event:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader m={2} color="teal">Edit Event</ModalHeader>
                <ModalCloseButton m={2} color="teal" />
                <ModalBody>
                    <Box p={2}>
                        <FormControl onSubmit={handleSubmit}>
                            <Input
                                bg="beige"
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <Textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Box>
                                <FormLabel m={2} mb={1}>Category:</FormLabel>
                                {categories.map((category) => (
                                    <Checkbox
                                        m={3}
                                        mt={1}
                                        key={category.id}
                                        name={category.id.toString()} 
                                        isChecked={formData.categoryIds.includes(category.id)}
                                        onChange={handleChange}
                                    >
                                        {category.name}
                                    </Checkbox>
                                ))}
                            </Box>

                            <Input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                             <FormLabel m={2}>Start time:</FormLabel>
                            <Input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                            />
                             <FormLabel m={2}>End time:</FormLabel>
                            <Input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                            <Select
                                name="createdBy"
                                placeholder="Created By"
                                value={formData.createdBy}
                                onChange={handleChange}
                            >
                                <option value=""></option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                type="url"
                                name="image"
                                placeholder="Image url"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button w="7vw" colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                    <Button w="7vw" m={2} colorScheme="teal" onClick={handleSubmit}>
                        Save Event
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditEventForm;
