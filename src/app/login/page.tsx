// Imports

"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

// Exports

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
  
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
  
        if (result?.error) {
          setError("Invalid email or password");
          setIsLoading(false);
        } else if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login");
        setIsLoading(false);
      }
    };
  
    return (
      <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
        <h1 className={styles["title-text"]}>Login</h1>
        <form onSubmit={handleSubmit} className={`${styles["column-container"]} ${styles["gap-10"]}`}>
            <div className={`${styles["column-container"]} ${styles["gap-5"]}`}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={styles["input-structure"]}
                />
            </div>
            <div className={`${styles["column-container"]} ${styles["gap-5"]}`}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={styles["input-structure"]}
                />
            </div>
            {error && (
                <div className={`${styles["column-container"]} ${styles["gap-5"]} ${styles["text-center"]}`}>
                    {error}
                </div>
            )}
            <button 
                className={`${styles["button-structure"]} ${styles["primary-button"]}`}
                type="submit" 
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>
      </div>
    );
}