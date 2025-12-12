// Imports

import { FormElements } from "@/types/component";

// Exports

export const passwordForm: FormElements = {
    title: 'Update Password',
    description: 'This form is used to update your password',
    apiOptionsStatus: false,
    apiOptions: [],
    elements: [
        {
            tag: 'input',
            type: 'password',
            label: 'Current Password',
            instructions: 'Enter your new password',
            id: 'password',
            name: 'password',
            placeholder: 'Enter your new password',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
    ],
}