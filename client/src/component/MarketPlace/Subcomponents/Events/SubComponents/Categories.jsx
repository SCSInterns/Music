import {
  FaMusic,
  FaUserFriends,
  FaTheaterMasks,
  FaChild,
  FaPaintBrush,
  FaStar,
  FaRegCircle,
  FaBaseballBall,
} from "react-icons/fa"; // Use suitable icons for each category.

export default function CategoriesSection() {
  const categories = [
    {
      name: "Music Shows",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaMusic />,
    },
    {
      name: "Workshops",
      image:
        "https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaPaintBrush />,
    },
    {
      name: "Meetups",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaUserFriends />,
    },
    {
      name: "Kids",
      image:
        "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaChild />,
    },
    {
      name: "Performances",
      image:
        "https://images.unsplash.com/photo-1562329265-95a6d7a83440?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaTheaterMasks />,
    },
    {
      name: "Exhibitions",
      image:
        "https://images.unsplash.com/photo-1632383380175-812d44ec112b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaStar />,
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaBaseballBall />,
    },
    {
      name: "Others",
      image:
        "https://images.unsplash.com/photo-1546778316-dfda79f1c84e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaRegCircle />,
    },
  ];

  return (
    <section className="py-12">
      {/* Parallax Background */}
      <div
        className="relative overflow-hidden bg-cover bg-center md:h-auto h-auto bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 mt-10 max-w-7xl mx-auto text-center text-white py-16">
          <h2 className="text-3xl font-bold mb-6">Explore Our Categories</h2>
          <p className="text-lg mb-10">
            Browse through a variety of exciting categories to find your next
            adventure.
          </p>

          {/* Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-white"
              >
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center px-4 md:px-0 z-10">
                  {category.icon}
                  <div className="p-4 text-center">
                    <h3 className="md:text-xl text-sm font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
