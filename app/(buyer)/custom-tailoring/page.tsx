'use client'
import React, { useState, useEffect } from 'react';
import { Scissors, Ruler, ShieldCheck, Clock, Award, Users, ArrowRight, Play, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TailoringPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const tailoringSteps = [
    {
      number: "01",
      title: "Consultation",
      description: "Personal style consultation with master tailors",
      detail: "Begin your journey with an in-depth consultation where our master tailors understand your lifestyle, preferences, and vision for the perfect garment."
    },
    {
      number: "02", 
      title: "Measurements",
      description: "Precision body measurements with advanced techniques",
      detail: "Using time-honored techniques combined with modern precision, we capture over 40 individual measurements to ensure an impeccable fit."
    },
    {
      number: "03",
      title: "Design",
      description: "Custom design creation and fabric selection",
      detail: "Choose from our curated collection of premium fabrics and work with our designers to create a piece that reflects your unique style."
    },
    {
      number: "04",
      title: "Crafting",
      description: "Hand-crafted construction by master artisans",
      detail: "Each garment is meticulously crafted by hand, with attention to every detail, stitch, and finishing touch that defines true luxury."
    },
    {
      number: "05",
      title: "Fitting",
      description: "Multiple fittings for perfect refinement",
      detail: "Through careful fittings and adjustments, we ensure your garment achieves the perfect silhouette and comfort you deserve."
    }
  ];

  const testimonials = [
    {
      name: "Krishna Sahay",
      role: "Customer",
      quote: "The attention to detail is extraordinary. Every piece fits like it was made for me—because it was.",
      rating: 5
    },
    {
      name: "Priya Singh ",
      role: "Fashion Designer",
      quote: "Impeccable craftsmanship that rivals the finest European ateliers. Truly exceptional.",
      rating: 5
    },
    {
      name: "Sofia Saifi",
      role: "Customer",
      quote: "The quality and service exceeded every expectation. This is luxury tailoring at its finest.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % tailoringSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight">
              Tailor Your
              <span className="block font-serif italic text-gray-600">Perfection</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Where craftsmanship meets modern precision. Every stitch tells a story of excellence, 
              every fit speaks of sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href='/shop'>
              <button className="group bg-black text-white px-12 py-4 hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 text-lg">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="group flex items-center gap-3 text-lg text-gray-700 hover:text-black transition-colors"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-black transition-colors">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                Watch Our Process
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 animate-float">
          <Scissors className="w-12 h-12 text-gray-300" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delayed">
          <Ruler className="w-10 h-10 text-gray-300" />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 md:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              The Art of <span className="font-serif italic">Precision</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our five-step process ensures every garment achieves the perfect balance of comfort, style, and sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Steps Navigation */}
            <div className="space-y-8">
              {tailoringSteps.map((step, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-500 ${
                    activeStep === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start gap-6">
                    <span className={`text-6xl font-light transition-colors duration-500 ${
                      activeStep === index ? 'text-black' : 'text-gray-300'
                    }`}>
                      {step.number}
                    </span>
                    <div className="pt-2">
                      <h3 className="text-2xl font-medium mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      {activeStep === index && (
                        <p className="text-gray-700 animate-fadeIn">{step.detail}</p>
                      )}
                    </div>
                  </div>
                  {activeStep === index && (
                    <div className="ml-20 mt-4 h-0.5 bg-black animate-expandWidth"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Content */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                    <Image
                      src='/fashion.jpg'
                      alt='photo'
                      fill
                      className='rounded-3xl'
                    />
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {tailoringSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      activeStep === index ? 'bg-black w-8' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: <Scissors className="w-8 h-8" />,
                title: "Master Craftsmanship",
                description: "Over 200 hours of meticulous handwork goes into every piece, ensuring unparalleled quality and attention to detail."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Timeless Design",
                description: "Classic silhouettes enhanced with contemporary touches create garments that transcend seasonal trends."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Materials",
                description: "Sourced from the finest mills in Italy, our fabrics represent the pinnacle of luxury and durability."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Personal Service",
                description: "Dedicated consultants guide you through every step, ensuring a truly personalized experience."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Lifetime Guarantee",
                description: "We stand behind our craftsmanship with comprehensive alterations and maintenance services."
              },
              {
                icon: <Ruler className="w-8 h-8" />,
                title: "Perfect Fit",
                description: "Advanced measurement techniques ensure every garment fits your body perfectly, enhancing your natural silhouette."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 hover:bg-gray-50 transition-all duration-300 rounded-2xl"
              >
                <div className="mb-6 text-gray-600 group-hover:text-black transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-20 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Client <span className="font-serif italic">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from our discerning clients who have experienced the pinnacle of tailoring excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-2xl hover:bg-gray-800 transition-colors duration-300"
              >
                <Quote className="w-8 h-8 text-gray-500 mb-6" />
                <p className="text-lg mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
            Ready to Experience
            <span className="block font-serif italic text-gray-600">Tailoring Excellence?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Begin your journey to owning garments that reflect your unique style and sophistication. 
            Book your consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href='/shop'>
            <button className="border-2 flex items-center gap-5 border-gray-300 text-gray-700 px-12 py-4 hover:border-black hover:text-black transition-all duration-300 text-lg">
              View Our Gallery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-light">48h</div>
              <div className="text-gray-600">Consultation Response</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light">3-4 weeks</div>
              <div className="text-gray-600">Completion Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light">Lifetime</div>
              <div className="text-gray-600">Service Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <div className="w-8 h-8 flex items-center justify-center">✕</div>
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-70">Video not available for now </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-expandWidth {
          animation: expandWidth 0.5s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default TailoringPage;