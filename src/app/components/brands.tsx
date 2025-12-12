// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { FormData as FormDataType, BrandComponent, BrandsProps } from "../../types/component";
import Table from "./table";
import Form from "./form";
import { brandForm } from "@/util/forms/brand";

// Exports

export default function Brands({ setup }: BrandsProps) {

    const [brands, setBrands] = useState<BrandComponent[]>([]);
    const [brandsLoaded, setBrandsLoaded] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

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

    }, [])

    const handleCreateBrand = async (data: FormDataType) => {
        try{

            const api = selectedBrandId ? `/api/brands/${selectedBrandId}` : '/api/brands';
            const method = selectedBrandId ? 'PUT' : 'POST';
            const body = selectedBrandId ? { ...data, id: selectedBrandId } : data;

            const response = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...body, user_id: setup.userId }),
            });

            if(!response.ok) {
                console.error('Failed to create brand');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Brand created successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to create brand');
        } finally {
            setShowForm(false);
        }
    }

    const handleArchiveBrand = async (id: number) => {
        try{

            const response = await fetch(`/api/brands/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                console.error('Failed to archive brand');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Brand archived successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to archive brand');
            return;
        } finally {
            const newBrands = brands.filter((brand) => brand.id !== id);
            setBrands(newBrands);
        }
    }

    if(!brandsLoaded) {
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
                    api: selectedBrandId ? `/api/brands/${selectedBrandId}` : null,
                    content: brandForm,
                }}
                onClose={() => setShowForm(false)}
                onSubmit={(data: FormDataType) => {
                    handleCreateBrand(data);
                }}
            />
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>All Brands</h1>
                    <p>In this section, you can view and manage all brands.</p>
                </div>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <button 
                        className={`${styles["button-structure"]} ${styles["primary-button"]}`} 
                        onClick={() => {
                            setSelectedBrandId(null);
                            setShowForm(true);
                        }}
                    >
                        Create Brand
                    </button>
                </div>
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Name", "Created By", "Last Updated"],
                    data: brands.map((brand) => [
                        brand.id.toString(),
                        brand.name,
                        brand.user.name,
                        new Date(brand.lastUpdated).toISOString().split("T")[0]
                    ]),
                    filterBy: "",
                    clickable: true,
                    onClick: (id: number) => {
                        setSelectedBrandId(id);
                        setShowForm(true);
                    },
                    archiveable: true,
                    onArchive: (id: number) => {
                        handleArchiveBrand(id);
                    },
                }}
            />

        </div>
    )
}