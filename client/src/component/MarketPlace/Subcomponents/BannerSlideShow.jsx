import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BannerSlideshow = ({ data }) => {
  const [links, setLinks] = useState([]);
  const [Banners, setBanners] = useState([]);

  const getBanners = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/getmarketingbanners";

    const response = await fetch(url, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setBanners(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  useEffect(() => {
    const newLinks = data.map((link) => ({
      imagelink: link.bannerlink,
      weblink: link.websitelink,
    }));

    if (data.length < 3) {
      Banners.forEach((banner) => {
        newLinks.push({
          imagelink: banner.imageUrl,
          weblink: "http://localhost:3000",
        });
      });
    }

    setLinks(newLinks);
  }, [data]);

  return (
    <div className="banner-slideshow">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="w-full md:h-[400px] h-[200px]"
      >
        {links.length === 0
          ? Banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <a href="http://localhost:3000">
                  <img
                    src={banner.imageUrl}
                    alt={"Banners"}
                    className="w-full h-full object-fill"
                  />
                </a>
              </SwiperSlide>
            ))
          : links.map((banner, index) => (
              <SwiperSlide key={index}>
                <a href={banner.weblink}>
                  <img
                    src={banner.imagelink}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-fill"
                  />
                </a>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default BannerSlideshow;
