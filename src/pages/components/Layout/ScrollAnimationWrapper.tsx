import { motion } from "framer-motion";
import { NextPage } from "next";


const ScrollAnimationWrapper: NextPage<any> = ({children, className, ...props}) => {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={ {once: true, amount: 0.8} }
      className={ className }
      { ...props }
    >
      { children }
    </motion.div>
  );
};

export default ScrollAnimationWrapper;
