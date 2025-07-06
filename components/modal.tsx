import React from "react";

import { AnimatePresence, motion } from "motion/react";
interface modalProps {
  courseId: string;
  handleDelete: (courseId: string) => void;
  onClose: () => void;
}
const Modal = ({ courseId, handleDelete, onClose }: modalProps) => {
  return (
    <AnimatePresence>
      <motion.article
        className="abs-center w-160 h-80 backdrop-blur-3xl text-white flex-center flex-col gap-10 rounded-lg border-[0.5px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
      >
        <h1 className="text-xl text-center px-4">
          Are you sure you want to delete this course?
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleDelete(courseId)}
            className="bg-red-500 px-4 py-2 rounded-sm hover:bg-red-600 transition-colors duration-300"
          >
            Delete Course
          </button>
          <button
            onClick={onClose}
            className="bg-white/10 px-4 py-2 rounded-sm hover:bg-white/20 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </motion.article>
    </AnimatePresence>
  );
};

export default Modal;
