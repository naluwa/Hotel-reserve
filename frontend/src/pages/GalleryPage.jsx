import { useState, useEffect } from "react";
import { Button, Card } from "../components/base";
import suiteStandard from "../assets/img/suite_standard.svg";
import suiteLuxury from "../assets/img/suite_luxury.svg";
import poolImage from "../assets/img/pool.svg";
import lobbyImage from "../assets/img/lobby.svg";

const INITIAL_GALLERY = [
  { id: 1, title: "Ocean View Suite", category: "Rooms", caption: "Serene morning views of the coastline.", src: suiteLuxury },
  { id: 2, title: "Grand Lounge", category: "Amenities", caption: "Calm interiors designed for relaxation.", src: lobbyImage },
  { id: 3, title: "Infinity Pool", category: "Outdoor", caption: "Sunlit outdoor pool and private cabanas.", src: poolImage },
  { id: 4, title: "Gourmet Dining", category: "Dining", caption: "Signature dishes prepared fresh daily.", src: suiteStandard },
];

export default function GalleryPage({ isAdmin = false, showToast }) {
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem("hotel_gallery_images_v2");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GALLERY;
  });

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("hotel_gallery_images_v2", JSON.stringify(images));
    } catch {
      // ignore
    }
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
    filter === "All"
      ? images
      : images.filter((img) => img.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="section-shell p-8 lg:p-10 text-center max-w-3xl mx-auto">
        <p className="eyebrow">Resort Showcase</p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Gallery & Visuals
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Explore scenes from Grand Reserve. Filter by category or view our signature spaces.
        </p>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition ${
                filter === cat
                  ? "bg-brass text-heritage-900 font-bold"
                  : "border border-cashmere-700 text-slate-300 hover:border-brass"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Upload Section (Admin Only) */}
      {isAdmin && (
        <Card className="p-6 bg-cashmere-900 border-cashmere-700 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Upload Gallery Photo (Admin Only)
            </h3>
            <span className="text-xs uppercase tracking-widest text-brass font-semibold">
              Admin Access
            </span>
          </div>

          <form onSubmit={handleAddImage} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  placeholder="Enter photo title here"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-cashmere-700 bg-heritage-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-cashmere-700 bg-heritage-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-brass"
                >
                  <option value="Rooms">Rooms</option>
                  <option value="Dining">Dining</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                Select Image File *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-cashmere-700 bg-heritage-900 p-2 text-xs text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brass file:px-3 file:py-1 file:text-xs file:font-bold file:text-heritage-900"
              />
            </div>

            {selectedFile && (
              <div className="mt-2 text-center">
                <img
                  src={selectedFile}
                  alt="Preview"
                  className="mx-auto h-32 rounded-xl object-cover border border-brass-subtle"
                />
              </div>
            )}

            <Button type="submit" fullWidth className="mt-2">
              Upload to Gallery
            </Button>
          </form>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-xl border border-cashmere-700 bg-heritage-900"
          >
            <div className="h-64 w-full bg-cashmere-900 flex items-center justify-center overflow-hidden">
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-500 p-6 text-center">
                  <svg className="h-12 w-12 text-brass/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-xs uppercase tracking-widest text-slate-400 font-semibold">{img.title}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-cashmere-900 border-t border-cashmere-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brass block">
                  {img.category}
                </span>
                <h4 className="font-semibold text-white text-sm">{img.title}</h4>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 rounded px-2 py-1"
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
