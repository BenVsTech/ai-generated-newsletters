// Imports

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FormData as FormDataType, Section } from "../types/component";
import { passwordForm } from "@/util/forms/password";
import Settings from "./components/settings";
import Form from "./components/form";

// Exports

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [section, setSection] = useState<Section>({
    settings: false,
    tickets: false,
    teams: false,
    admin: false,
  });
  const [selectedSection, setSelectedSection] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    switch (selectedSection) {
      case "allBrands":
        setContent(
          <div>This is the all brands section</div>
        );
        break;
      case "allNewsletters":
        setContent(
          <div>This is the all newsletters section</div>
        );
        break;
      case "aiGeneration":
        setContent(
          <div>This is the ai generation section</div>
        );
        break;
      case "userManagement":
        setContent(
          <div>This is the user management section</div>
        );
        break;
      case "updatePassword":
        setContent(
          <Form 
            setup={{ api: null, content: passwordForm }} 
            onClose={() => setSelectedSection("")} 
            onSubmit={(data: FormDataType) => {
              handleUpdatePassword(data);
            }} 
          />
        );
        break;
      case "home":
        setContent(
          <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
            <h1 className={`${styles["title-text"]}`}>Welcome to the AI Generated Newsletters System</h1>
            <p>In this system, you can create, view, and manage newsletters for your brands.</p>
          </div>
        );
        break;
      default:
        setContent(
          <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
            <h1 className={`${styles["title-text"]}`}>Welcome to the AI Generated Newsletters System</h1>
            <p>In this system, you can create, view, and manage newsletters for your brands.</p>
          </div>
        );
        break;
    }
  }, [selectedSection]);

  const handleUpdatePassword = async (data: FormDataType) => {
    try{

      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if(!response.ok) {
        console.error('Failed to update password');
        return;
      }

      const responseData = await response.json();

      if(responseData.status) {
        console.log('Password updated successfully');
      } else {
        console.error(responseData.message || 'Failed to update password');
      }

    } catch(error: unknown) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      return;
    } finally{
      setSelectedSection("home");
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`${styles["fullscreen"]} ${styles["row-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]}`}>
      {
        section.settings && (
          <Settings setup={{ onClose: () => setSection({ ...section, settings: false }) }} />
        )
      }
      <ul className={`${styles["height-100"]} ${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["max-width-150"]} ${styles["background-style-primary"]}`}>
        <li>
          <img src="/assets/logo.png" alt="Logo" className={`${styles["logo-structure"]}`} />
        </li>
        <li>
          <b className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]} ${selectedSection === "home" ? styles["active"] : ""}`} onClick={() => setSelectedSection("home")}>Home</b>
        </li>
        <li className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`}>
          <b
            onClick={() => setSection({ ...section, tickets: !section.tickets })}
          >Tickets</b>
          {section.tickets && (
            <ul className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["max-width-150"]} ${styles["background-style-primary"]}`}>
              <li 
                className={`${styles["pd-top"]}`}
                onClick={() => setSelectedSection("allTickets")}
              >
                All Tickets
              </li>
              <li
                onClick={() => setSelectedSection("myTickets")}
              >
                My Tickets
              </li>
            </ul>
          )}
        </li>
        <li className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`}>
          <b
            onClick={() => setSection({ ...section, teams: !section.teams })}
          >Teams</b>
          {
            section.teams && (
              <ul className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["max-width-150"]} ${styles["background-style-primary"]}`}>
                <li
                  className={`${styles["pd-top"]}`}
                  onClick={() => setSelectedSection("allTeams")}
                >
                  All Teams
                </li>
              </ul>
            )
          }
        </li>
        <li className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`}>
          <b
            onClick={() => setSection({ ...section, admin: !section.admin })}
          >Admin</b>
          {
            section.admin && (
              <ul className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["max-width-150"]} ${styles["background-style-primary"]}`}>
                <li
                  className={`${styles["pd-top"]}`}
                  onClick={() => setSelectedSection("userManagement")}
                >
                  User Management
                </li>
                <li
                  onClick={() => setSelectedSection("updatePassword")}
                >
                  Update Password
                </li>
              </ul>
            )
          }
        </li>
      </ul>
      <div className={`${styles["height-100"]} ${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-center"]}`}>
        <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-end"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["background-style-primary"]}`}>
          <img src="/assets/settings.png" alt="Settings" className={`${styles["icon-structure"]} ${styles["clickable"]}`} onClick={() => setSection({ ...section, settings: !section.settings })} />
        </div>
        <div id="content-container" className={`${styles["pd-all-round"]} ${styles["width-100"]}`}>
          {content}
        </div>
      </div>
    </div>
  );
}
