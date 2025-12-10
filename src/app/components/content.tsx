// Imports

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { ContentProps, ContentData, ReturnContentData } from "@/types/component";
import { Brand } from "@/types/database";

// Exports

export default function Content({ setup }: ContentProps) {

    const [contentCount, setContentCount] = useState<number>(0);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandsLoaded, setBrandsLoaded] = useState<boolean>(false);
    const [newsletterName, setNewsletterName] = useState<string>('');
    const [newsletterBrandId, setNewsletterBrandId] = useState<number | null>(null);
    const [newsletterSpeaker, setNewsletterSpeaker] = useState<string>('');
    const [contentData, setContentData] = useState<ContentData[]>([]);
    const [returnContentData, setReturnContentData] = useState<ReturnContentData>({ name: '', brand_id: null, speaker: '', content: [] });

    useEffect(() => {
        setReturnContentData({ name: newsletterName, brand_id: newsletterBrandId, speaker: newsletterSpeaker, content: contentData });
    }, [newsletterName, newsletterBrandId, newsletterSpeaker, contentData, setup.newsletterId]);

    const handleSubmitContent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setup.onSubmit(returnContentData);
    }

    useEffect(() => {
        const getBrands = async function () {
            try{
                const response = await fetch(`/api/brands`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if(!response.ok) {
                    console.error('Failed to fetch brands');
                    return;
                }
    
                const data = await response.json();
    
                if(data.status) {
                    setBrands(data.data);
                } else {
                    console.error(data.message);
                }
            } catch(error: unknown) {
                console.error('Failed to fetch brands');
                return;
            } finally {
                setBrandsLoaded(true);
            }
        }

        getBrands();

    }, []);

    if(!brandsLoaded) {
        return (
            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]}`}>
                Loading...
            </div>
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>Create Content</h1>
                    <p>In this section, you can create content for the newsletter.</p>
                </div>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <button className={`${styles["button-structure"]} ${styles["secondary-button"]}`} onClick={setup.onClose}>Back</button>
                </div>
            </div>

            <form onSubmit={handleSubmitContent} className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-20"]}`}>

                <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <label htmlFor="">Newsletter Name</label>
                    <input type="text" className={`${styles["input-structure"]} ${styles["width-100"]}`} id="newsletter-name" name="newsletter-name" value={newsletterName} onChange={(e) => setNewsletterName(e.target.value)} required />
                </div>

                <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <label htmlFor="">Brand</label>
                    <select className={`${styles["input-structure"]} ${styles["width-100"]} ${styles["clickable"]}`} id="newsletter-brand" name="newsletter-brand" value={Number(newsletterBrandId)} onChange={(e) => setNewsletterBrandId(Number(e.target.value))} required>
                        <option value="">Select a brand</option>    
                        {
                            brands.map((brand: Brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <label htmlFor="">Speaker</label>
                    <select className={`${styles["input-structure"]} ${styles["width-100"]} ${styles["clickable"]}`} id="newsletter-speaker" name="newsletter-speaker" value={newsletterSpeaker} onChange={(e) => setNewsletterSpeaker(e.target.value)} required>
                        <option value="">Select a speaker</option>
                        <option value="Winston Churchill">Winston Churchill</option>
                        <option value="Abraham Lincoln">Abraham Lincoln</option>
                        <option value="Mahatma Gandhi">Mahatma Gandhi</option>
                        <option value="Martin Luther King Jr.">Martin Luther King Jr.</option>
                        <option value="Nelson Mandela">Nelson Mandela</option>
                        <option value="Mother Teresa">Mother Teresa</option>
                        <option value="Nelson Mandela">Nelson Mandela</option>
                    </select>
                </div>

                {
                    Array.from({ length: contentCount }, (_, index) => (
                        <div key={index} className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-5"]}`}>
                                <h2 className={`${styles["title-text"]}`}>Content {index + 1}</h2>
                                <button 
                                    className={`${styles["button-structure"]} ${styles["secondary-button"]}`} 
                                    onClick={() => {
                                        setContentCount(contentCount - 1);
                                        setContentData(contentData.filter((_, i) => i !== index));
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                                <label htmlFor={`title-${index}`}>
                                    <b>Title</b>
                                </label>
                                <input 
                                    type="text" 
                                    className={`${styles["input-structure"]} ${styles["width-100"]}`} 
                                    id={`title-${index}`} 
                                    name={`title-${index}`} 
                                    value={contentData[index].title} 
                                    onChange={(e) => {
                                        const updated = [...contentData];
                                        updated[index] = { ...updated[index], title: e.target.value };
                                        setContentData(updated);
                                    }}
                                    required
                                />
                            </div>
                            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                                <label htmlFor={`content-${index}`}>
                                    <b>Content</b>
                                </label>
                                <textarea 
                                    className={`${styles["input-structure"]} ${styles["width-100"]}`} 
                                    id={`content-${index}`} 
                                    name={`content-${index}`} 
                                    value={contentData[index].content} 
                                    onChange={(e) => {
                                        const updated = [...contentData];
                                        updated[index] = { ...updated[index], content: e.target.value };
                                        setContentData(updated);
                                    }}                                      
                                    required
                                ></textarea>
                            </div>
                            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                                <label htmlFor={`image-${index}`}>
                                    <b>Image URL</b>
                                </label>
                                <input 
                                    type="text" 
                                    className={`${styles["input-structure"]} ${styles["width-100"]}`} 
                                    id={`image-${index}`} 
                                    name={`image-${index}`} 
                                    value={contentData[index].image} 
                                    onChange={(e) => {
                                        const updated = [...contentData];
                                        updated[index] = { ...updated[index], image: e.target.value };
                                        setContentData(updated);
                                    }}
                                      
                                />
                            </div>
                            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                                <label htmlFor={`link-${index}`}>
                                <b>Link</b>
                                </label>
                                <input 
                                    type="text" 
                                    className={`${styles["input-structure"]} ${styles["width-100"]}`} 
                                    id={`link-${index}`} 
                                    name={`link-${index}`} 
                                    value={contentData[index].link} 
                                    onChange={(e) => {
                                        const updated = [...contentData];
                                        updated[index] = { ...updated[index], link: e.target.value };
                                        setContentData(updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }

                <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                    <button 
                        className={`${styles["button-structure"]} ${styles["primary-button"]}`} 
                        onClick={() => {
                            setContentCount(contentCount + 1);
                            setContentData([...contentData, { title: '', content: '', image: '', link: '' }]);
                        }}
                        type="button"
                    >
                        Add Content
                    </button>
                    <button className={`${styles["button-structure"]} ${styles["primary-button"]}`} type="submit">Submit</button>
                </div>

            </form>

        </div>
    )
}