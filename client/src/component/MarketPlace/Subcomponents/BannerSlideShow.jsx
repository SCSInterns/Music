import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BannerSlideshow = ({ data }) => {
  const [links, setLinks] = useState([]);

  const banners = [
    {
      id: 2,
      image:
        "https://img.freepik.com/free-vector/after-school-activities-children-social-media-promo-template_23-2149623777.jpg?t=st=1737453143~exp=1737456743~hmac=d802c10428b8c66d018e6bf32dfd18fa24f2f9f7a2f68174654aae976810a521&w=1060",
      alt: "http://localhost:3000",
    },
    {
      id: 3,
      image:
        "https://img.freepik.com/free-vector/hand-drawn-dance-school-sale-banner_23-2149416106.jpg?t=st=1737453188~exp=1737456788~hmac=3e4f8fcf6ba24e54d9ddd953e1f9fe96b3eb520101a198a7f7b78964ecc4b11b&w=1060",
      alt: "http://localhost:3000",
    },
  ];

  useEffect(() => {
    const newLinks = data.map((link) => ({
      imagelink: link.bannerlink,
      weblink: link.websitelink,
    }));

    if (data.length < 3) {
      banners.forEach((banner) => {
        newLinks.push({
          imagelink: banner.image,
          weblink: banner.alt,
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
          ? banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-fill"
                />
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
