// Exporting Types

export interface Section {
    settings: boolean;
    tickets: boolean;
    teams: boolean;
    admin: boolean;
}

export interface SettingsProps {
    setup: {
        onClose: () => void;
    }
}

export interface TicketsProps {
    setup: {
        title: string;
        description: string;
        userId: number;
        isPersonalTickets: boolean;
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
        hasComments: boolean;
        onViewComments: (id: number) => void;
    }
}

export interface CommentsProps {
    setup: {
        ticketId: number;
        userId: number;
    }
    onClose: () => void;
}

export interface CommentComponent {
    id: number;
    text: string;
    author: {
        id: number;
        name: string;
    };
    updatedAt: Date;
}

export interface StatusDropdownProps {
    setup: {
        onSelect: (status: string) => void;
    }
}

export interface TicketComponent {
    id: number;
    title: string;
    description: string;
    status: string;
    created: {
        id: number;
        name: string;
    };
    assignedTo: {
        id: number;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
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

export interface TeamComponent {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    createdAt: Date;
}

export interface UserComponent {
    id: number;
    name: string;
    email: string;
    team: {
        id: number;
        name: string;
    };
    createdAt: Date;
}