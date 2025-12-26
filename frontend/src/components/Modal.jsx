import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { FaX } from "react-icons/fa6";

const Modal = ({ isOpen, setIsOpen, children }) => {
  const [show, setShow] = useState(false); // Mount/unmount control
  const [animateIn, setAnimateIn] = useState(false); // Animation
  const modalRef = useRef(); // Ref for modal content

  // Handle mounting/unmounting and animation
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShow(false), 300); // Adjust to match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, setIsOpen]);

  if (!show) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        ref={modalRef}
        className={`modalBody bg-white px-2 py-4 rounded-lg shadow-lg
          transform transition-all duration-300 w-4/5 md:w-2/3
          ${
            animateIn
              ? "translate-y-[50px] opacity-100 ease-out"
              : "-translate-y-full opacity-0 ease-in"
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
