"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const CONTACT_NUMBER = "919693230030";

export function WhatsAppBot() {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi, I'm interested in One and Only Furniture solutions. Please assist me with my inquiry.",
    );
    window.open(`https://wa.me/${CONTACT_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center z-1050 hover:bg-[#20bd5a] transition-colors"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.button>
  );
}
