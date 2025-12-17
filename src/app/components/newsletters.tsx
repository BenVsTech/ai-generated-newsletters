// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { NewsletterComponent, NewslettersProps, ReturnContentData } from "../../types/component";
import Table from "./table";
import Content from "./content";

// Exports

export default function Newsletters({ setup }: NewslettersProps) {

    const [newsletters, setNewsletters] = useState<NewsletterComponent[]>([]);
    const [newslettersLoaded, setNewslettersLoaded] = useState<boolean>(false);
    const [selectedNewsletterId, setSelectedNewsletterId] = useState<number | null>(null);
    const [createNewsletterStatus, setCreateNewsletterStatus] = useState<boolean>(false);

    useEffect(() => {
        console.log('Selected Newsletter ID:', selectedNewsletterId);
    }, [selectedNewsletterId]);

    useEffect(() => {

        const getNewsletters = async function () {
            try{

                const response = await fetch(`/api/newsletters`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(!response.ok) {
                    console.error('Failed to fetch newsletters');
                    return;
                }

                const data = await response.json();

                if(data.status) {
                    setNewsletters(data.data);
                } else {
                    console.error(data.message);
                }

            } catch(error: unknown) {
                console.error('Failed to fetch newsletters');
                return;
            } finally {
                setNewslettersLoaded(true);
            }
        }

        getNewsletters();

    }, [])

    const handleCreateNewsletter = async (data: ReturnContentData) => {
        try{

            if (!data) {
                console.error('Data is undefined or null');
                return;
            }

            const api = selectedNewsletterId ? `/api/newsletters/${selectedNewsletterId}` : '/api/newsletters';
            const method = selectedNewsletterId ? 'PUT' : 'POST';
            const body = selectedNewsletterId ? { ...data, content: JSON.stringify(data.content || []), id: selectedNewsletterId } : { ...data, content: JSON.stringify(data.content || []), user_id: setup.userId };

            const response = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if(!response.ok) {
                console.error('Failed to create newsletter');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Newsletter created successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to create newsletter');
        } finally {
            setCreateNewsletterStatus(false);
        }
    }

    const handleArchiveNewsletter = async (id: number) => {
        try{

            const response = await fetch(`/api/newsletters/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                console.error('Failed to archive newsletter');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Newsletter archived successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to archive newsletter');
            return;
        } finally {
            const newNewsletters = newsletters.filter((newsletter: NewsletterComponent) => newsletter.id !== id);
            setNewsletters(newNewsletters);
        }
    }

    if(!newslettersLoaded) {
        return (
            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]}`}>
                Loading...
            </div>
        )
    }

    if(createNewsletterStatus) {
        return (
            <Content setup={{
                newsletterId: selectedNewsletterId as number,
                onClose: () => setCreateNewsletterStatus(false),
                onSubmit: (data: ReturnContentData) => {
                    handleCreateNewsletter(data);
                },
            }} />
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>All Newsletters</h1>
                    <p>In this section, you can view and manage all newsletters.</p>
                </div>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <button 
                        className={`${styles["button-structure"]} ${styles["primary-button"]}`} 
                        onClick={() => {
                            setSelectedNewsletterId(null);
                            setCreateNewsletterStatus(true);
                        }}
                    >
                        Create Newsletter
                    </button>
                </div>
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Name", "Speaker", "Brand", "Created By", "Last Updated"],
                    data: newsletters.map((newsletter: NewsletterComponent) => [
                        newsletter.id.toString(),
                        newsletter.name,
                        newsletter.speaker,
                        newsletter.brand.name,
                        newsletter.user.name,
                        new Date(newsletter.lastUpdated).toISOString().split("T")[0]
                    ]),
                    filterBy: "",
                    clickable: true,
                    onClick: (id: number) => {
                        setSelectedNewsletterId(id);
                        setCreateNewsletterStatus(true);
                    },
                    archiveable: true,
                    onArchive: (id: number) => {
                        handleArchiveNewsletter(id);
                    },
                }}
            />

        </div>
    )
}