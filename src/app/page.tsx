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
import Users from "./components/users";
import Brands from "./components/brands";
import Newsletters from "./components/newsletters";
import Generation from "./components/generation";

// Exports

export default function Home() {

  const [userId, setUserId] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [section, setSection] = useState<Section>({
    settings: false,
    configurations: false,
    generation: false,
    admin: false,
  });
  const [selectedSection, setSelectedSection] = useState<string>("");

  useEffect(() => {
    if(session?.user?.id) {
      setUserId(parseInt(session?.user?.id as string));
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    switch (selectedSection) {
      case "allBrands":
        setContent(
          userId ? (
            <Brands setup={{ userId }} />
          ) : (
            <div>You are not a valid user to access this section</div>
          )
        );
        break;
      case "allNewsletters":
        setContent(
          userId ? (
            <Newsletters setup={{ userId }} />
          ) : (
            <div>You are not a valid user to access this section</div>
          )
        );
        break;
      case "generation":
        setContent(
          <Generation />
        );
        break;
      case "userManagement":
        setContent(
          <Users />
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
          <b className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`} onClick={() => setSelectedSection("home")}>Home</b>
        </li>
        <li>
          <b className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`} onClick={() => setSelectedSection("generation")}>Generation</b>
        </li>
        <li className={`${styles["clickable"]} ${styles["width-100"]} ${styles["text-center"]}`}>
          <b
            onClick={() => setSection({ ...section, configurations: !section.configurations })}
          >Configurations</b>
          {section.configurations && (
            <ul className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-center"]} ${styles["gap-20"]} ${styles["max-width-150"]} ${styles["background-style-primary"]}`}>
              <li 
                className={`${styles["pd-top"]}`}
                onClick={() => setSelectedSection("allBrands")}
              >
                All Brands
              </li>
              <li
                onClick={() => setSelectedSection("allNewsletters")}
              >
                All Newsletters
              </li>
            </ul>
          )}
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
