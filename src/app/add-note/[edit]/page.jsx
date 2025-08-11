"use client";
import AddNotePage from "@/pages/notes/AddNotePage";
import { useParams } from "next/navigation";

export default function Edit() {
  const { edit } = useParams();
  console.log(edit);
  return (
    <>
      <AddNotePage isAuthenticated={true} edit={edit} />
    </>
  );
}
