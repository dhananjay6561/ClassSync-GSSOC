import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import b from '../../assets/b2.jpg';
import g from '../../assets/pic-girl.jpg';
import b11 from '../../assets/b1.avif';
import g11 from '../../assets/g2.avif';
import b7 from '../../assets/g4.avif';
import f from '../../assets/pic-boy.jpg';
import gi from '../../assets/pgi.jpg';


const Testimonial = () => {
  const testimonials = [
    { id: 1, name: "Priya Mehta", message: "ClassSync has transformed the way we handle teacher scheduling and substitutions.",image: g },
    { id: 2, name: "David Lin", message: "We no longer worry about last-minute leave requests.",image: b },
    { id: 3, name: "John Carter", message: "ClassSync has brought a new level of organization to our school.",image: b11 },
    { id: 4, name: "Anika Roy", message: "Submitting leave is now a 2-click process. I get notified instantly when a substitute is assigned.",image: g11 },
    { id: 5, name: "Sameer Hussain", message: "Setup was quick, integration was smooth, and support has been top-notch.",image: f },
    { id: 6, name: "Sarah Owens", message: "ClassSync gives us complete visibility into schedules and staff availability. ",image: gi },
    { id: 7, name: "Alex Peterson", message: "It feels like ClassSync was built with teachers in mind. I instantly get leave approvals, class updates.",image: b7 },
  ];

  return (
    <>
    <div className="space-y-8 px-4 py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 text-center">
        Testimonials
      </h1>
    </div>
    <div className="swiper-button-prev !absolute !top-1/2 !-left-10 !-translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"></div>

    <div className="swiper-button-next !absolute !top-1/2 !-right-10 !-translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"></div>

    <div className='h-100'>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2.5,
          slideShadows: false,
        }}
        speed={300}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination,Navigation]}
        className="w-full max-w-4xl"
        loop={true}
        navigation={true}
        autoplay={{
          delay:1500,
          disableOnInteraction:false,

        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide
            key={testimonial.id}
            className="bg-white rounded-xl shadow-md px-6 py-8 w-72 h-72 transition-all duration-300"
          >
            <img
  src={testimonial.image}
  
  className="w-20 h-20 rounded-full object-cover mb-4 mx-auto"
/>
            <p className="text-gray-700 mb-4">"{testimonial.message}"</p>
            <h4 className="text-lg font-semibold text-blue-600">{testimonial.name}</h4>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
};

export default Testimonial
