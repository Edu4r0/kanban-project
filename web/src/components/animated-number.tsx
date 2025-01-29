"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
  precision?: number;
  format?: (number: number) => string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
}

export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 75,
  damping = 15,
  precision = 0,
  format = (num) => num.toLocaleString(),
  onAnimationStart,
  onAnimationComplete,
  className,
}: AnimatedNumberProps) {
  // Estado inicial de la animación comienza en 0

  // Creamos el resorte (spring) que empieza en el valor 0
  const spring = useSpring(0, { mass, stiffness, damping });

  // Transformamos el valor del spring al formato deseado
  const display = useTransform(spring, (current) =>
    format(parseFloat(current.toFixed(precision)))
  );

  useEffect(() => {
    // Cuando value cambia, establecemos el nuevo objetivo del spring
    spring.set(value);

    if (onAnimationStart) onAnimationStart();

    // Suscripción a los cambios en el spring
    const unsubscribe = spring.on("change", (latestValue) => {
      // Si el valor final es alcanzado, se llama a onAnimationComplete
      if (latestValue === value && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => unsubscribe();
  }, [value, spring, onAnimationStart, onAnimationComplete]);

  return <motion.span className={className}>{display}</motion.span>;
}