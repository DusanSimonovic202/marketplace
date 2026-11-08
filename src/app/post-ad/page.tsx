
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

export default function PostAdPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const imagePreviews = useMemo(
    () => selectedImages.map((file) => URL.createObjectURL(file)),
    [selectedImages]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    condition: "",
    categoryId: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        }
      } catch {
        setError("Could not load categories.");
      }
    }

    loadCategories();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedImages.length + files.length > 8) {
      setError("You can select a maximum of 8 images.");
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setError("Images must be valid image files smaller than 5 MB.");
      return;
    }

    setError("");
    setSelectedImages((previous) => [...previous, ...files]);
  }

  function removeImage(index: number) {
    setSelectedImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrls: string[] = [];

      // Upload images to Cloudinary first.
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();

        selectedImages.forEach((image) => {
          imageFormData.append("images", image);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error || "Image upload failed."
          );
        }

        imageUrls = uploadData.images;
      }

      // Create the advertisement with the uploaded image URLs.
      const response = await fetch("/api/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          images: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Something went wrong."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create advertisement."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Post an advertisement
          </h1>

          <p className="mt-2 text-gray-600">
            Fill in the details below to publish your listing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
         className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-gray-900 font-medium"
        >
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Advertisement title *
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="What are you selling?"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Category *
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              maxLength={5000}
              placeholder="Describe your item..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          {/* Advertisement images */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Photos
            </label>

            <p className="mb-3 text-sm text-gray-500">
              Add up to 8 images. Maximum 5 MB per image.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={selectedImages.length >= 8 || loading}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:font-semibold file:text-green-700 hover:file:bg-green-100"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={`${selectedImages[index].name}-${index}`}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt={`Advertisement image ${index + 1}`}
                      className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Price
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="RSD">RSD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Condition
            </label>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="">Not specified</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Country
              </label>

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Uploading and publishing..." : "Publish advertisement"}
          </button>
        </form>
      </div>
    </main>
  );
}
