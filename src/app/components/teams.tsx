// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { FormData as FormDataType, TeamComponent } from "../../types/component";
import Table from "./table";
import Form from "./form";
import { teamForm } from "@/util/forms/team";

// Exports

export default function Teams() {

    const [teams, setTeams] = useState<TeamComponent[]>([]);
    const [teamsLoaded, setTeamsLoaded] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    useEffect(() => {

        const getTeams = async function () {
            try{

                const response = await fetch('/api/teams', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(!response.ok) {
                    console.error('Failed to fetch teams');
                    return;
                }

                const data = await response.json();

                if(data.status) {
                    setTeams(data.data);
                } else {
                    console.error(data.message);
                }

            } catch(error: unknown) {
                console.error('Failed to fetch teams');
                return;
            } finally {
                setTeamsLoaded(true);
            }
        }

        getTeams();

    }, [])

    const handleCreateTeam = async (data: FormDataType) => {
        try{

            const api = selectedTeamId ? `/api/teams/${selectedTeamId}` : '/api/teams';
            const method = selectedTeamId ? 'PUT' : 'POST';
            const body = selectedTeamId ? { ...data, id: selectedTeamId } : data;

            const response = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if(!response.ok) {
                console.error('Failed to create team');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Team created successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to create team');
        } finally {
            setShowForm(false);
        }
    }

    if(!teamsLoaded) {
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
                    api: selectedTeamId ? `/api/teams/${selectedTeamId}` : null,
                    content: teamForm,
                }}
                onClose={() => setShowForm(false)}
                onSubmit={(data: FormDataType) => {
                    handleCreateTeam(data);
                }}
            />
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>All Teams</h1>
                    <p>In this section, you can view and manage your own teams.</p>
                </div>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <button className={`${styles["button-structure"]} ${styles["primary-button"]}`} onClick={() => setShowForm(true)}>Create Team</button>
                </div>
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Name", "Description", "Member Count", "Created At"],
                    data: teams.map((team) => [
                        team.id.toString(),
                        team.name,
                        team.description,
                        team.memberCount.toString(),
                        new Date(team.createdAt).toISOString().split("T")[0]
                    ]),
                    filterBy: "",
                    clickable: true,
                    onClick: (id: number) => {
                        setSelectedTeamId(id);
                        setShowForm(true);
                    },
                    archiveable: false,
                    onArchive: (id: number) => {
                        console.log(id);
                    },
                    hasComments: false,
                    onViewComments: (id: number) => {
                        console.log(id);
                    },
                }}
            />

        </div>
    )
}