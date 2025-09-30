const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Emma Rodriguez",
      address: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      rating: 5,
      review:
        "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
    },
    {
      id: 2,
      name: "Liam Johnson",
      address: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      rating: 4.5,
      review:
        "I’m truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!",
    },
    {
      id: 3,
      name: "Sophia Lee",
      address: "Seoul, South Korea",
      image:
        "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
      rating: 5,
      review:
        "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results.",
    },
  ];

  const Star = ({ index, rating, uid }) => {
    const fill = Math.max(0, Math.min(100, (rating - index) * 100));
    const id = `g-${uid}-${index}`;

    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-yellow-400"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset={`${fill}%`} stopColor="currentColor" />
            <stop offset={`${fill}%`} stopColor="transparent" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon points="12 2.5 15.09 8.26 21.82 9.03 16.91 13.97 18.18 20.64 12 17.25 5.82 20.64 7.09 13.97 2.18 9.03 8.91 8.26" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30">
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-[40px] font-bold">
          Customer Testimonials
        </h1>
        <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[696px]">
          Hear what our users say about us. We're always looking for ways to
          improve. If you have a positive experience with us, leave a review.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow max-w-xs"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-playfair text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    index={index}
                    rating={testimonial.rating}
                    uid={testimonial.id}
                  />
                ))}
            </div>

            <p className="text-gray-500 max-w-90 mt-4">
              "{testimonial.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
