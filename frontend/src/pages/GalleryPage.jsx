import { useState, useEffect } from "react";
import { Button, Card, Input, Select } from "../components/base";
import suiteStandard from "../assets/img/suite_standard.jpg";
import suiteLuxury from "../assets/img/suite_luxury.jpg";
import poolImage from "../assets/img/pool.jpg";
import lobbyImage from "../assets/img/lobby.jpg";

const INITIAL_GALLERY = [
  {
    id: 1,
    title: "Ocean View Suite",
    category: "Rooms",
    caption: "Wake up to sweeping views of the Indian Ocean.",
    src: suiteLuxury,
  },
  {
    id: 2,
    title: "Grand Lobby",
    category: "Amenities",
    caption: "A refined welcome - colonial elegance meets modern comfort.",
    src: lobbyImage,
  },
  {
    id: 3,
    title: "Infinity Pool",
    category: "Outdoor",
    caption: "The rooftop pool with panoramic views over Colombo.",
    src: poolImage,
  },
  {
    id: 4,
    title: "Deluxe Room",
    category: "Rooms",
    caption: "Spacious rooms with warm tones and premium bedding.",
    src: suiteStandard,
  },
];

export default function GalleryPage({ isAdmin = false, showToast }) {
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem("hotel_gallery_images_v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GALLERY;
  });

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("hotel_gallery_images_v2", JSON.stringify(images));
    } catch {}
  }, [images]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast?.("Please select a valid image file.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast?.("Please select an image file to upload.", "error");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: newTitle.trim() || "Resort Feature",
      category: newCategory,
      caption: "Uploaded by Admin",
      src: selectedFile,
    };

    setImages((prev) => [newEntry, ...prev]);
    setNewTitle("");
    setSelectedFile(null);
    showToast?.("New photo added to the gallery.", "success");
  };

  const handleDeleteImage = (id) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
    showToast?.("Photo removed from gallery.", "info");
  };

  const categories = ["All", ...new Set(images.map((img) => img.category))];

  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-3xl p-8 text-center lg:p-10">
        <p className="eyebrow">Resort showcase</p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Gallery &amp; visuals
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Explore the spaces that define Grand Reserve Colombo - from calm
          ocean-view suites to the signature rooftop pool.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${
                filter === cat
                  ? "bg-brass font-bold text-heritage-900"
                  : "border border-white/10 text-slate-300 hover:border-brass hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
        <Card className="mx-auto max-w-2xl border-white/10 bg-cashmere-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Upload gallery photo
            </h3>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
              Admin access
            </span>
          </div>

          <form onSubmit={handleAddImage} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Input
                  label="Photo title"
                  placeholder="Enter photo title here"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <Select
                  label="Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  options={[
                    { value: "Rooms", label: "Rooms" },
                    { value: "Dining", label: "Dining" },
                    { value: "Amenities", label: "Amenities" },
                    { value: "Outdoor", label: "Outdoor" },
                    { value: "General", label: "General" },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.22em] text-slate-400">
                Select image file
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-white/10 bg-heritage-900 p-2 text-xs text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brass file:px-3 file:py-1 file:text-xs file:font-bold file:text-heritage-900"
              />
            </div>

            {selectedFile && (
              <div className="text-center">
                <img
                  src={selectedFile}
                  alt="Preview"
                  className="mx-auto h-32 rounded-xl border border-brass/20 object-cover"
                />
              </div>
            )}

            <Button type="submit" fullWidth className="mt-2">
              Upload to gallery
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="motion-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-cashmere-900/70"
          >
            <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-heritage-900/70">
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center p-6 text-center text-slate-500">
                  <svg
                    className="h-12 w-12 text-brass/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {img.title}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-cashmere-900/80 p-4">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-brass">
                  {img.category}
                </span>
                <h4 className="text-sm font-semibold text-white">
                  {img.title}
                </h4>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 transition hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
