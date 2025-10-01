import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getPageTableOfContents } from "notion-utils";
import cn from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

export default function TableOfContents({ blockMap, className, style }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const collectionId = Object.keys(blockMap.collection)[0];
  const page = Object.values(blockMap.block).find(
    (block) => block.value.parent_id === collectionId
  ).value;
  const nodes = getPageTableOfContents(page, blockMap);

  if (!nodes.length) return null;

  // Handle scroll progress tracking
  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize once
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(id) {
    id = id.replaceAll("-", "");
    const target = document.querySelector(`.notion-block-${id}`);
    if (!target) return;
    const top =
      document.documentElement.scrollTop +
      target.getBoundingClientRect().top -
      65;
    document.documentElement.scrollTo({
      top,
      behavior: "smooth",
    });
    setOpen(false);
  }

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-zinc-900 text-white p-3 shadow-lg dark:bg-neutral-200 dark:text-black md:hidden"
        aria-label="Toggle Table of Contents"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer content (slides from right) */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 z-50 h-full w-[70%] sm:w-[60%] bg-neutral-800 dark:text-gray-400 dark:bg-transparent shadow-2xl overflow-y-auto p-5 rounded-l-2xl md:hidden"
            >
              <div className="mb-3">
                <h2 className="text-lg font-semibold mb-1 text-white dark:text-gray-200">
                  Contents
                </h2>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Read: {progress.toFixed(0)}%</span>
                  <div className="flex-1 ml-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-1 bg-gray-300 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {nodes.map((node) => (
                <div key={node.id}>
                  <a
                    data-target-id={node.id}
                    className="block py-2 hover:text-white cursor-pointer transition duration-100"
                    style={{ paddingLeft: node.indentLevel * 20 + "px" }}
                    onClick={() => scrollTo(node.id)}
                  >
                    {node.text}
                  </a>
                </div>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop TOC */}
      <aside
        className={cn(
          className,
          "hidden md:block pl-4 text-sm text-zinc-700/70 dark:text-neutral-400"
        )}
        style={style}
      >
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Read: {progress.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-1 bg-zinc-800 dark:bg-gray-300 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {nodes.map((node) => (
          <div key={node.id}>
            <a
              data-target-id={node.id}
              className="block py-1 hover:text-black dark:hover:text-white cursor-pointer transition duration-100"
              style={{ paddingLeft: node.indentLevel * 24 + "px" }}
              onClick={() => scrollTo(node.id)}
            >
              {node.text}
            </a>
          </div>
        ))}
      </aside>
    </>
  );
}

TableOfContents.propTypes = {
  blockMap: PropTypes.object.isRequired,
};
