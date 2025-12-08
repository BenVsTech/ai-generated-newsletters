// Imports

import { FormElements } from "@/types/component";

// Exports

export const commentForm: FormElements = {
    title: 'Create Comment',
    description: 'This form is used to create a new comment',
    apiOptionsStatus: false,
    apiOptions: [],
    elements: [
        {
            tag: 'textarea',
            type: 'textarea',
            label: 'Add a Comment',
            instructions: 'Enter the text of the comment',
            id: 'text',
            name: 'text',
            placeholder: 'e.g. "This is a comment"',
            optionApiStatus: false,
            optionApiRef: null,
            options: [],
            required: true,
        },
    ],
}