// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { Newsletter } from "@/types/database";

// Exports

export default function Generation() {

    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [newslettersLoaded, setNewslettersLoaded] = useState<boolean>(false);
    const [selectedNewsletterId, setSelectedNewsletterId] = useState<number | null>(null);
    const [generateNewsletterStatus, setGenerateNewsletterStatus] = useState<boolean>(false);

    useEffect(() => {
        const getNewsletters = async function () {
            setNewslettersLoaded(false);
            try{

                const response = await fetch('/api/newsletters', {
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
    }, []);

    const handleGenerateNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!selectedNewsletterId) {
            console.error('No newsletter selected');
            return;
        }

        setGenerateNewsletterStatus(true);

        try{
            console.log('Selected Newsletter ID:', selectedNewsletterId);
            console.log('Generating newsletter...');

        } catch(error: unknown) {
            console.error('Failed to generate newsletter');
        } finally {
            setGenerateNewsletterStatus(false);
        }
    }

    if(!newslettersLoaded) {
        return (
            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
                Loading...
            </div>
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
            <h1 className={`${styles["title-text"]}`}>AI Generated Newsletters</h1>
            <p>In this section, you can generate newsletters for your brands.</p>
            <form onSubmit={handleGenerateNewsletter} className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

                <select 
                    className={`${styles["input-structure"]} ${styles["clickable"]}`} 
                    name="newsletter-generation" 
                    id="newsletter-generation" 
                    value={selectedNewsletterId?.toString() || ''} 
                    onChange={(e) => setSelectedNewsletterId(Number(e.target.value))}
                >
                    <option value="">Select a newsletter</option>
                    {
                        newsletters.map((newsletter: Newsletter) => (
                            <option key={newsletter.id} value={newsletter.id}>{newsletter.name}</option>
                        ))
                    }
                </select>

                <button className={`${styles["button-structure"]} ${styles["primary-button"]}`} type="submit" disabled={generateNewsletterStatus}>Generate Newsletter</button>

            </form>
            {
                generateNewsletterStatus && (
                    <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
                        Generating newsletter...
                    </div>
                )
            }
        </div>
    )
}