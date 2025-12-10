// Exporting Types

export interface Section {
    settings: boolean;
    configurations: boolean;
    generation: boolean;
    admin: boolean;
}

export interface SettingsProps {
    setup: {
        onClose: () => void;
    }
}

export interface TableProps {
    setup: {
        headers: string[];
        data: string[][];
        filterBy: string;
        clickable: boolean;
        onClick: (id: number) => void;
        archiveable: boolean;
        onArchive: (id: number) => void;
    }
}

export interface StatusDropdownProps {
    setup: {
        onSelect: (status: string) => void;
    }
}

export interface FormProps {
    setup: {
        api: string | null;
        content: FormElements;
    },
    onClose: () => void;
    onSubmit: (data: FormData) => void;
}

export interface OptionApi {
    api: string;
    ref: string;
}

export interface Option {
    value: string;
    label: string;
}

export interface element {
    tag: string;
    type: string;
    label: string;
    instructions: string;
    id: string;
    name: string;
    placeholder: string;
    required: boolean;
    optionApiStatus: boolean;
    optionApiRef: string | null;
    options: Option[];
}

export interface FormElements {
    title: string;
    description: string;
    apiOptionsStatus: boolean;
    apiOptions: OptionApi[];
    elements: element[];
}

export interface FormData {
    [key: string]: string;
}

export interface UserComponent {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}