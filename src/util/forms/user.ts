// Imports

import { FormElements } from "@/types/component";

// Exports

export const userForm: FormElements = {
    title: 'Create User',
    description: 'This form is used to create a new user',
    apiOptionsStatus: false,
    apiOptions: [],
    elements: [
        {
            tag: 'input',
            type: 'text',
            label: 'Name',
            instructions: 'Enter the name of the user',
            id: 'name',
            name: 'name',
            placeholder: 'e.g. "John Doe"',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
        {
            tag: 'input',
            type: 'text',
            label: 'Email',
            instructions: 'Enter the email of the user',
            id: 'email',
            name: 'email',
            placeholder: 'e.g. "john.doe@example.com"',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
    ],
}