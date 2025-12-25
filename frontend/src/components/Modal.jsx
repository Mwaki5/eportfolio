import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaX } from "react-icons/fa6";

const Modal = ({ isOpen, setIsOpen, children }) => {
  const [show, setShow] = useState(false); // Controls mounting
  const [animateIn, setAnimateIn] = useState(false); // Controls animation

  useEffect(() => {
    if (isOpen) {
      setShow(true); // Mount off-screen first
      setTimeout(() => setAnimateIn(true), 50); // Trigger animation
    } else {
      setAnimateIn(false); // Start slide-out
      const timer = setTimeout(() => setShow(false), 80); // Wait for animation

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  const Modal = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className={`modalBody bg-white px-2 py-4  rounded-lg shadow-lg 
          transform transition-all duration-500 w-4/5 md:w-2/3
          ${
            animateIn
              ? "translate-y-[50px] opacity-100 ease-out" // Slide in
              : "-translate-y-full opacity-0 ease-in " // Off-screen
          }
        `}
      >
        <div className="flex justify-end">
          <FaX
            className="hover:cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {children}
      </div>
    </div>
  );
  return ReactDOM.createPortal(Modal, document.body);
};

export default Modal;
