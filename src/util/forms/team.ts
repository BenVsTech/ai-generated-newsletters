// Imports

import { FormElements } from "@/types/component";

// Exports

export const teamForm: FormElements = {
    title: 'Create Team',
    description: 'This form is used to create a new team',
    apiOptionsStatus: true,
    apiOptions: [
        {
            api: '/api/users',
            ref: 'users',
        },
    ],
    elements: [
        {
            tag: 'input',
            type: 'text',
            label: 'Name',
            instructions: 'Enter the name of the team',
            id: 'name',
            name: 'name',
            placeholder: 'e.g. "My Team"',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
        {
            tag: 'textarea',
            type: 'textarea',
            label: 'Description',
            instructions: 'Enter the description of the team',
            id: 'description',
            name: 'description',
            placeholder: 'e.g. "This is a team for..."',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
    ],
}