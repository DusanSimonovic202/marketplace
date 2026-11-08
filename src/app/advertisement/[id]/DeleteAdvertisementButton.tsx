"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAdvertisementButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this advertisement?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/advertisements/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete advertisement.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete advertisement"}
    </button>
  );
}