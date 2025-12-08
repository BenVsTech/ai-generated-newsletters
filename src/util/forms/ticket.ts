// Imports

import { FormElements } from "@/types/component";

// Exports

export const ticketForm: FormElements = {
    title: 'Create Ticket',
    description: 'This form is used to create a new ticket',
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
            label: 'Title',
            instructions: 'Enter the title of the ticket',
            id: 'tiatle',
            name: 'title',
            placeholder: 'e.g. "Bug Report"',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
        {
            tag: 'textarea',
            type: 'textarea',
            label: 'Description',
            instructions: 'Enter the description of the ticket',
            id: 'description',
            name: 'description',
            placeholder: 'e.g. "I am experiencing a bug when..."',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
        {
            tag: 'select',
            type: 'select',
            label: 'Status',
            instructions: 'Select the status of the ticket',
            id: 'status',
            name: 'status',
            placeholder: '',
            optionApiStatus: false,
            optionApiRef: null,
            options: [
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'archived', label: 'Archived' },
            ],
            required: true,
        },
        {
            tag: 'select',
            type: 'select',
            label: 'Assigned To',
            instructions: 'Select the user assigned to the ticket',
            id: 'assigned_to_user_id',
            name: 'assigned_to_user_id',
            placeholder: '',
            optionApiStatus: true,
            optionApiRef: 'users',
            options: [],
            required: true,
        },
        {
            tag: 'select',
            type: 'select',
            label: 'Created By',
            instructions: 'Select the user who created the ticket',
            id: 'created_by_user_id',
            name: 'created_by_user_id',
            placeholder: '',
            optionApiStatus: true,
            optionApiRef: 'users',
            options: [],
            required: true,
        },
    ],
}