import React, { useState } from 'react';
import {
    Box,
    Input,
    Textarea,
    Button,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Checkbox,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useDataContext } from '../components/DataContext.jsx';

const AddEventForm = ({ onClose, onSubmit, createdBy }) => {
    const { categories, users } = useDataContext();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        categoryIds: [],
        location: "",
        startTime: "",
        endTime: "",
        createdBy: createdBy, // Pass the createdBy value as a number
        image: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            // If it's a checkbox, update the categoryIds array based on checked state
            const categoryId = Number(value);
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
            })
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Call the onSubmit callback with the new event data
        onSubmit(formData);

        // Close the form
        onClose();
    };


    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader m={2} color="teal">Add Event</ModalHeader>
                <ModalCloseButton m={2} color="teal"/>
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
                                        name="categoryIds"
                                        value={category.id}
                                        isChecked={formData.categoryIds.includes(category.id)}
                                        onChange={handleChange}
                                        id={category.id}
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

export default AddEventForm;
