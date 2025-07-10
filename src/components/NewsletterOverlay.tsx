import React from 'react';

const NewsletterOverlay = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-35  w-full flex justify-center z-30 pointer-events-none">
      <div className="max-w-[1350px] w-full px-4">
        <div className="bg-gradient-to-r from-amber-600 to-yellow-400 shadow-2xl rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 border-2 md:border-4 border-white pointer-events-auto">
          <div className="text-white font-extrabold text-lg md:text-xl lg:text-3xl text-center md:text-left drop-shadow-lg flex-1">
            <span>STAY UP TO DATE ABOUT</span>
            <br />
            <span>OUR LATEST OFFERS</span>
          </div>
          <form className="flex flex-col gap-3 md:gap-4 w-full md:w-auto">
            <div className="flex items-center bg-white rounded-full px-3 md:px-4 py-2 w-full md:w-80 shadow-md">
              <span className="text-amber-400 mr-2">
                <svg
                  width="16"
                  height="16"
                  className="md:w-5 md:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M4 4h16v16H4V4zm0 0l8 8 8-8"
                  />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent outline-none flex-1 text-amber-900 placeholder-amber-400 text-sm md:text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-amber-900 text-white font-semibold rounded-full px-6 md:px-8 py-2 text-sm md:text-base transition hover:bg-amber-800 whitespace-nowrap shadow-md"
            >
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterOverlay;
