// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { FormData as FormDataType, UserComponent } from "../../types/component";
import Table from "./table";
import Form from "./form";
import { userForm } from "@/util/forms/user";

// Exports

export default function Users() {

    const [users, setUsers] = useState<UserComponent[]>([]);
    const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    useEffect(() => {

        const getUsers = async function () {
            try{

                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(!response.ok) {
                    console.error('Failed to fetch users');
                    return;
                }

                const data = await response.json();

                if(data.status) {
                    setUsers(data.data);
                } else {
                    console.error(data.message);
                }

            } catch(error: unknown) {
                console.error('Failed to fetch users');
                return;
            } finally {
                setUsersLoaded(true);
            }
        }

        getUsers();

    }, [])

    const handleCreateUser = async (data: FormDataType) => {
        try{

            const api = selectedUserId ? `/api/users/${selectedUserId}` : '/api/users';
            const method = selectedUserId ? 'PUT' : 'POST';
            const body = selectedUserId ? { ...data, id: selectedUserId } : data;

            const response = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if(!response.ok) {
                console.error('Failed to create user');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('User created successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to create user');
        } finally {
            setShowForm(false);
        }
    }

    const handleArchiveUser = async (id: number) => {
        try{

            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                console.error('Failed to archive user');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('User archived successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to archive user');
            return;
        } finally {
            const newUsers = users.filter((user) => user.id !== id);
            setUsers(newUsers);
        }
    }

    if(!usersLoaded) {
        return (
            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]}`}>
                Loading...
            </div>
        )
    }

    if(showForm) {
        return (
            <Form 
                setup={{
                    api: selectedUserId ? `/api/users/${selectedUserId}` : null,
                    content: userForm,
                }}
                onClose={() => setShowForm(false)}
                onSubmit={(data: FormDataType) => {
                    handleCreateUser(data);
                }}
            />
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>All Users</h1>
                    <p>In this section, you can view and manage all users.</p>
                </div>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <button 
                        className={`${styles["button-structure"]} ${styles["primary-button"]}`} 
                        onClick={() => {
                            setSelectedUserId(null);
                            setShowForm(true);
                        }}
                    >
                        Create User
                    </button>
                </div>
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Name", "Email", "Created At"],
                    data: users.map((user) => [
                        user.id.toString(),
                        user.name,
                        user.email,
                        new Date(user.createdAt).toISOString().split("T")[0]
                    ]),
                    filterBy: "",
                    clickable: true,
                    onClick: (id: number) => {
                        setSelectedUserId(id);
                        setShowForm(true);
                    },
                    archiveable: true,
                    onArchive: (id: number) => {
                        handleArchiveUser(id);
                    },
                }}
            />

        </div>
    )
}